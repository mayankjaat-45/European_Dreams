import mongoose from "mongoose";

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const allowedRoles = ["super_admin", "admin", "editor"];

const getSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/*
 * Super Admin
 * GET /api/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const {
      search = "",
      role = "",
      status = "all",
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (role && allowedRoles.includes(role)) {
      filter.role = role;
    }

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean(),

      User.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          users: users.map(getSafeUser),

          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalItems: total,
            limit: limitNumber,
          },
        },
        "Users fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Super Admin
 * GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: getSafeUser(user),
        },
        "User fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Super Admin
 * POST /api/users
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = "admin" } = req.body;

    if (!name?.trim()) {
      throw new ApiError(400, "Name is required");
    }

    if (!email?.trim()) {
      throw new ApiError(400, "Email is required");
    }

    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    if (password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters");
    }

    if (!allowedRoles.includes(role)) {
      throw new ApiError(400, "Invalid user role");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      throw new ApiError(409, "A user with this email already exists");
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      isActive: true,
    });

    res.status(201).json(
      new ApiResponse(
        201,
        {
          user: getSafeUser(user),
        },
        "User created successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Super Admin
 * PUT /api/users/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const { name, email, role, isActive } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        throw new ApiError(400, "Name cannot be empty");
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      if (!normalizedEmail) {
        throw new ApiError(400, "Email cannot be empty");
      }

      const duplicateUser = await User.findOne({
        _id: {
          $ne: user._id,
        },
        email: normalizedEmail,
      });

      if (duplicateUser) {
        throw new ApiError(409, "A user with this email already exists");
      }

      user.email = normalizedEmail;
    }

    if (role !== undefined) {
      if (!allowedRoles.includes(role)) {
        throw new ApiError(400, "Invalid user role");
      }

      if (
        user._id.toString() === req.user._id.toString() &&
        role !== "super_admin"
      ) {
        throw new ApiError(400, "You cannot remove your own super admin role");
      }

      user.role = role;
    }

    if (isActive !== undefined) {
      if (
        user._id.toString() === req.user._id.toString() &&
        isActive === false
      ) {
        throw new ApiError(400, "You cannot disable your own account");
      }

      user.isActive =
        typeof isActive === "boolean" ? isActive : isActive === "true";
    }

    await user.save({
      validateBeforeSave: true,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: getSafeUser(user),
        },
        "User updated successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Super Admin
 * PATCH /api/users/:id/reset-password
 */
export const resetUserPassword = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      throw new ApiError(400, "New password and confirm password are required");
    }

    if (newPassword.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters");
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "New password and confirm password do not match");
    }

    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();

    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, null, "User password reset successfully"));
  } catch (error) {
    next(error);
  }
};

/*
 * Super Admin
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    if (req.params.id === req.user._id.toString()) {
      throw new ApiError(400, "You cannot delete your own account");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await user.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};
