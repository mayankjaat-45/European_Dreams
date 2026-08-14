import dotenv from "dotenv";

dotenv.config();

const { default: configureCloudinary } =
  await import("../config/cloudinary.js");

try {
  const cloudinary = configureCloudinary();

  const result = await cloudinary.api.ping();

  console.log("✅ Cloudinary connected successfully");
  console.log(result);

  process.exit(0);
} catch (error) {
  console.error("❌ Cloudinary connection failed");
  console.error(error);

  process.exit(1);
}
