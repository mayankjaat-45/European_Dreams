import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  deleteFromCloudinary,
  uploadBufferToCloudinary,
} from "../utils/cloudinaryUpload.js";

const allowedFolders = {
  university_hero: "universities/hero",
  university_gallery: "universities/gallery",
  blog: "blogs",
  brochure: "brochures",
  general: "general",
};

const allowedUploadTypes = Object.keys(allowedFolders);

const getUploadFolder = (type) => {
  const baseFolder = process.env.CLOUDINARY_FOLDER || "european-dreams";

  const childFolder = allowedFolders[type] || allowedFolders.general;

  return `${baseFolder}/${childFolder}`;
};

const getResourceType = (file) => {
  if (file.mimetype === "application/pdf") {
    return "raw";
  }

  return "image";
};

const getImageTransformation = (type, file) => {
  if (file.mimetype === "application/pdf") {
    return undefined;
  }

  if (type === "university_hero") {
    return [
      {
        width: 1600,
        height: 900,
        crop: "fill",
        gravity: "auto",
        quality: "auto",
        fetch_format: "auto",
      },
    ];
  }

  if (type === "university_gallery") {
    return [
      {
        width: 1400,
        height: 900,
        crop: "fill",
        gravity: "auto",
        quality: "auto",
        fetch_format: "auto",
      },
    ];
  }

  return [
    {
      quality: "auto",
      fetch_format: "auto",
    },
  ];
};

const validateUploadType = (type) => {
  if (!allowedUploadTypes.includes(type)) {
    throw new ApiError(
      400,
      `Invalid upload type. Allowed values: ${allowedUploadTypes.join(", ")}`,
    );
  }
};

/*
 * Admin
 * POST /api/uploads/single
 */
export const uploadSingleFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "Please select a file");
    }

    const type = String(req.body.type || "general")
      .trim()
      .toLowerCase();

    validateUploadType(type);

    const result = await uploadBufferToCloudinary({
      buffer: req.file.buffer,
      folder: getUploadFolder(type),
      resourceType: getResourceType(req.file),
      transformation: getImageTransformation(type, req.file),
    });

    res.status(201).json(
      new ApiResponse(
        201,
        {
          file: {
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type,
            format: result.format || "",
            width: result.width || null,
            height: result.height || null,
            bytes: result.bytes || req.file.size,
          },
        },
        "File uploaded successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * POST /api/uploads/multiple
 */
export const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files?.length) {
      throw new ApiError(400, "Please select at least one file");
    }

    const type = String(req.body.type || "general")
      .trim()
      .toLowerCase();

    validateUploadType(type);

    const uploadResults = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadBufferToCloudinary({
          buffer: file.buffer,
          folder: getUploadFolder(type),
          resourceType: getResourceType(file),
          transformation: getImageTransformation(type, file),
        });

        return {
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format || "",
          width: result.width || null,
          height: result.height || null,
          bytes: result.bytes || file.size,
        };
      }),
    );

    res.status(201).json(
      new ApiResponse(
        201,
        {
          files: uploadResults,
        },
        `${uploadResults.length} files uploaded successfully`,
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * DELETE /api/uploads
 */
export const deleteUploadedFile = async (req, res, next) => {
  try {
    const { publicId, resourceType = "image" } = req.body;

    if (!publicId?.trim()) {
      throw new ApiError(400, "Public ID is required");
    }

    if (!["image", "raw", "video"].includes(resourceType)) {
      throw new ApiError(400, "Invalid resource type");
    }

    const result = await deleteFromCloudinary({
      publicId: publicId.trim(),
      resourceType,
    });

    if (result?.result === "not found") {
      throw new ApiError(404, "Uploaded file not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          result: result?.result || "ok",
        },
        "File deleted successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};
