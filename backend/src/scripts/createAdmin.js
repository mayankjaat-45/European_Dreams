import dns from "node:dns";
import dotenv from "dotenv";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const { default: mongoose } = await import("mongoose");
const { default: connectDb } = await import("../config/db.js");
const { default: User } = await import("../models/User.js");

const createAdmin = async () => {
  try {
    await connectDb();

    const name = process.env.ADMIN_NAME || "European Dreams Admin";

    const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();

    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      console.log("⚠️ Admin already exists");
      console.log(`Email: ${existingUser.email}`);

      await mongoose.connection.close();
      process.exit(0);
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: "super_admin",
      isActive: true,
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Super Admin Created Successfully");
    console.log(`Name  : ${admin.name}`);
    console.log(`Email : ${admin.email}`);
    console.log(`Role  : ${admin.role}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin");
    console.error(error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

createAdmin();
