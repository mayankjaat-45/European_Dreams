import jwt from "jsonwebtoken";

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
    }

    if (!token && req.cookies?.adminToken) {
      token = req.cookies.adminToken;
    }

    if (!token) {
      throw new ApiError(401, "Authentication required. Please login.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(
        401,
        "The user associated with this token no longer exists",
      );
    }

    if (!user.isActive) {
      throw new ApiError(403, "Your account has been disabled");
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      throw new ApiError(
        401,
        "Password was recently changed. Please login again.",
      );
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You are not authorized to perform this action"),
      );
    }

    next();
  };
};
