import streamifier from "streamifier";

import configureCloudinary from "../config/cloudinary.js";

/*
 * Explicitly configure Cloudinary when this utility loads.
 * This also supports standalone scripts such as
 * uploadUniversityImages.js.
 */
const cloudinary = configureCloudinary();

const uploadBufferToCloudinary = ({
  buffer,
  folder,
  resourceType = "image",
  publicId,
  transformation,
  overwrite = true,
}) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("A valid file buffer is required");
  }

  if (!folder?.trim()) {
    throw new Error("Cloudinary folder is required");
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder.trim(),
      resource_type: resourceType,
      overwrite,
      invalidate: overwrite,
      unique_filename: !publicId,
      use_filename: false,
    };

    if (publicId?.trim()) {
      uploadOptions.public_id = publicId.trim();
    }

    if (transformation) {
      uploadOptions.transformation = transformation;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url || !result?.public_id) {
          reject(
            new Error("Cloudinary upload completed without a URL or public ID"),
          );
          return;
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).on("error", reject).pipe(uploadStream);
  });
};

const deleteFromCloudinary = async ({ publicId, resourceType = "image" }) => {
  if (!publicId?.trim()) {
    return null;
  }

  return cloudinary.uploader.destroy(publicId.trim(), {
    resource_type: resourceType,
    invalidate: true,
  });
};

const uploadUniversityHeroImage = async ({ buffer, universitySlug }) => {
  if (!universitySlug?.trim()) {
    throw new Error("University slug is required");
  }

  const baseFolder = process.env.CLOUDINARY_FOLDER || "european-dreams";

  return uploadBufferToCloudinary({
    buffer,

    folder: `${baseFolder}/universities/${universitySlug.trim()}`,

    publicId: "hero",

    resourceType: "image",

    overwrite: true,

    transformation: [
      {
        width: 1600,
        height: 900,
        crop: "fill",
        gravity: "auto",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
};

const uploadUniversityGalleryImage = async ({
  buffer,
  universitySlug,
  imageId,
}) => {
  if (!universitySlug?.trim()) {
    throw new Error("University slug is required");
  }

  if (!imageId?.trim()) {
    throw new Error("Gallery image ID is required");
  }

  const baseFolder = process.env.CLOUDINARY_FOLDER || "european-dreams";

  return uploadBufferToCloudinary({
    buffer,

    folder: `${baseFolder}/universities/${universitySlug.trim()}/gallery`,

    publicId: imageId.trim(),

    resourceType: "image",

    overwrite: true,

    transformation: [
      {
        width: 1400,
        height: 900,
        crop: "fill",
        gravity: "auto",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
};

export {
  deleteFromCloudinary,
  uploadBufferToCloudinary,
  uploadUniversityGalleryImage,
  uploadUniversityHeroImage,
};
