import dns from "node:dns";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import slugify from "slugify";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const { default: connectDb } = await import("../config/db.js");

const { default: University } = await import("../models/University.js");

const { uploadUniversityHeroImage } =
  await import("../utils/cloudinaryUpload.js");

const { italianUniversities } = await import("../data/italy/universities.js");

const universityImagesDirectory = path.resolve(
  process.cwd(),
  "src/assets/universities",
);

const supportedExtensions = [".webp", ".jpg", ".jpeg", ".png"];

const createUniversitySlug = (name) => {
  return slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });
};

const findHeroImage = (universitySlug) => {
  const universityDirectory = path.join(
    universityImagesDirectory,
    universitySlug,
  );

  if (!fs.existsSync(universityDirectory)) {
    return null;
  }

  for (const extension of supportedExtensions) {
    const imagePath = path.join(universityDirectory, `hero${extension}`);

    if (fs.existsSync(imagePath)) {
      return imagePath;
    }
  }

  return null;
};

const uploadSingleUniversityImage = async (universityData) => {
  const universitySlug = createUniversitySlug(universityData.name);

  const university = await University.findOne({
    slug: universitySlug,
  });

  if (!university) {
    console.log(`⚠️ University not found in database: ${universityData.name}`);

    return {
      status: "missing-university",
      name: universityData.name,
    };
  }

  const heroImagePath = findHeroImage(universitySlug);

  if (!heroImagePath) {
    console.log(`⚠️ Hero image not found: ${universityData.name}`);

    return {
      status: "missing-image",
      name: universityData.name,
    };
  }

  const imageBuffer = fs.readFileSync(heroImagePath);

  const uploadedImage = await uploadUniversityHeroImage({
    buffer: imageBuffer,
    universitySlug,
  });

  university.heroImage = uploadedImage.secure_url;

  university.heroImagePublicId = uploadedImage.public_id;

  await university.save();

  console.log(`✅ Image uploaded: ${university.name}`);

  return {
    status: "uploaded",
    name: university.name,
    url: uploadedImage.secure_url,
  };
};

const uploadUniversityImages = async () => {
  const summary = {
    uploaded: 0,
    missingImages: 0,
    missingUniversities: 0,
    failed: 0,
  };

  try {
    await connectDb();

    console.log(
      `🖼️ Uploading images for ${italianUniversities.length} universities...\n`,
    );

    if (!fs.existsSync(universityImagesDirectory)) {
      throw new Error(
        `University image directory not found: ${universityImagesDirectory}`,
      );
    }

    for (const universityData of italianUniversities) {
      try {
        const result = await uploadSingleUniversityImage(universityData);

        if (result.status === "uploaded") {
          summary.uploaded += 1;
        }

        if (result.status === "missing-image") {
          summary.missingImages += 1;
        }

        if (result.status === "missing-university") {
          summary.missingUniversities += 1;
        }
      } catch (error) {
        summary.failed += 1;

        console.error(`❌ Upload failed for ${universityData.name}`);

        console.error(error.message);
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("✅ University image upload completed");

    console.log(`🖼️ Uploaded             : ${summary.uploaded}`);

    console.log(`📁 Missing images       : ${summary.missingImages}`);

    console.log(`🏛️ Missing universities : ${summary.missingUniversities}`);

    console.log(`❌ Failed               : ${summary.failed}`);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("\n❌ University image upload failed");

    console.error(error);

    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    console.log("✅ MongoDB connection closed");
  }
};

await uploadUniversityImages();
