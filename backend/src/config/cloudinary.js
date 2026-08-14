import { v2 as cloudinary } from "cloudinary";

const configureCloudinary = () => {
  const requiredVariables = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const missingVariables = requiredVariables.filter((key) => !process.env[key]);

  if (missingVariables.length) {
    throw new Error(
      `Missing Cloudinary variables: ${missingVariables.join(", ")}`,
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
};

/*
 * Configure immediately when this module is imported.
 * This is required for standalone scripts such as
 * uploadUniversityImages.js.
 */
configureCloudinary();

export { cloudinary };
export default configureCloudinary;
