import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import generateToken from "../utils/generateToken.js";

import crypto from "node:crypto";

import sendEmail from "../utils/sendEmail.js";
import SiteSettings from "../models/SiteSettings.js";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Your account has been disabled. Contact the administrator.",
      );
    }

    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched) {
      throw new ApiError(401, "Invalid email or password");
    }

    user.lastLoginAt = new Date();

    await user.save({
      validateBeforeSave: false,
    });

    const token = generateToken(user._id);

    res.cookie("adminToken", token, getCookieOptions());

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
          },
        },
        "Login successful",
      ),
    );
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user,
        },
        "Profile fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new ApiError(
        400,
        "Current password, new password and confirm password are required",
      );
    }

    if (newPassword.length < 8) {
      throw new ApiError(400, "New password must be at least 8 characters");
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "New password and confirm password do not match");
    }

    if (currentPassword === newPassword) {
      throw new ApiError(
        400,
        "New password must be different from current password",
      );
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const passwordMatched = await user.comparePassword(currentPassword);

    if (!passwordMatched) {
      throw new ApiError(401, "Current password is incorrect");
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();

    await user.save();

    const token = generateToken(user._id);

    res.cookie("adminToken", token, getCookieOptions());

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token,
        },
        "Password changed successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const cookieOptions = getCookieOptions();

    res.clearCookie("adminToken", {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    });

    res.status(200).json(new ApiResponse(200, null, "Logout successful"));
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      throw new ApiError(400, "Email is required");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
      isActive: true,
    });

    /*
     * Always return the same message so attackers cannot
     * determine whether an email exists.
     */
    if (!user) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            null,
            "If an account exists with this email, a password reset link has been sent.",
          ),
        );
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({
      validateBeforeSave: false,
    });

    const frontendUrl =
      process.env.ADMIN_FRONTEND_URL || process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new ApiError(500, "Frontend URL is not configured");
    }

    const resetUrl = `${frontendUrl.replace(
      /\/+$/,
      "",
    )}/reset-password/${resetToken}`;

    const settings = await SiteSettings.findOne().select(
      "websiteName primaryEmail",
    );

    const websiteName = settings?.websiteName || "European Dreams";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#10213d;">
        <h2 style="color:#174a96;">Reset your password</h2>

        <p>Hello ${user.name},</p>

        <p>
          We received a request to reset your ${websiteName} admin password.
        </p>

        <p>
          Click the button below to create a new password.
          This link will expire in 15 minutes.
        </p>

        <p style="margin:30px 0;">
          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              background:#174a96;
              color:#ffffff;
              padding:12px 22px;
              border-radius:8px;
              text-decoration:none;
              font-weight:700;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          If the button does not work, copy this link:
        </p>

        <p style="word-break:break-all;">
          ${resetUrl}
        </p>

        <p>
          If you did not request this password reset,
          you can safely ignore this email.
        </p>

        <p>
          Regards,<br />
          <strong>${websiteName}</strong>
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: `${websiteName} password reset`,
        html,
        text: `Reset your password using this link: ${resetUrl}. The link expires in 15 minutes.`,
      });
    } catch (emailError) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;

      await user.save({
        validateBeforeSave: false,
      });

      throw new ApiError(
        500,
        "Password reset email could not be sent. Please try again later.",
      );
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If an account exists with this email, a password reset link has been sent.",
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const validateResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      throw new ApiError(400, "Reset token is required");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
      isActive: true,
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      throw new ApiError(400, "Reset token is invalid or has expired");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          valid: true,
        },
        "Reset token is valid",
      ),
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;

    const { newPassword, confirmPassword } = req.body;

    if (!token) {
      throw new ApiError(400, "Reset token is required");
    }

    if (!newPassword || !confirmPassword) {
      throw new ApiError(400, "New password and confirm password are required");
    }

    if (newPassword.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters");
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "New password and confirm password do not match");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
      isActive: true,
    }).select("+password +passwordResetToken +passwordResetExpires");

    if (!user) {
      throw new ApiError(400, "Reset token is invalid or has expired");
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();

    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    const authToken = generateToken(user._id);

    res.cookie("adminToken", authToken, getCookieOptions());

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token: authToken,

          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          },
        },
        "Password reset successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};
