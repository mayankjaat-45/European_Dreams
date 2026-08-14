import express from "express";

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  resetUserPassword,
  updateUser,
} from "../controllers/user.controller.js";

import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect, authorize("super_admin"));

router.get("/", getUsers);
router.post("/", createUser);

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.patch("/:id/reset-password", resetUserPassword);

export default router;
