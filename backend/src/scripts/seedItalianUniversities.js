import dns from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import slugify from "slugify";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const { default: connectDb } = await import("../config/db.js");

const { default: University } = await import("../models/University.js");

const { italianUniversities } = await import("../data/italy/universities.js");

const cleanString = (value = "") => {
  return String(value ?? "").trim();
};

const cleanStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => cleanString(item)).filter(Boolean);
};

const cleanGallery = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return {
          url: cleanString(item),
          publicId: "",
          alt: "",
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        url: cleanString(item.url),
        publicId: cleanString(item.publicId),
        alt: cleanString(item.alt),
      };
    })
    .filter((item) => item?.url);
};

const normalizeAdmissionRequirements = (value = {}) => {
  return {
    academics: cleanString(value?.academics),
    ielts: cleanString(value?.ielts),
    pte: cleanString(value?.pte),
    centS: cleanString(value?.centS),
    sat: cleanString(value?.sat),
    imat: cleanString(value?.imat),
    notes: cleanString(value?.notes),
  };
};

const normalizeUniversity = (item, index) => {
  const bachelorsCount = Math.max(Number(item.bachelorsCount) || 0, 0);

  const mastersCount = Math.max(Number(item.mastersCount) || 0, 0);

  return {
    name: cleanString(item.name),

    slug: slugify(item.name, {
      lower: true,
      strict: true,
      trim: true,
    }),

    country: "Italy",

    city: cleanString(item.city),

    region: cleanString(item.region),

    regionGroup: cleanString(item.regionGroup),

    universityType: cleanString(item.universityType).toLowerCase() || "public",

    establishedYear:
      item.establishedYear === undefined ||
      item.establishedYear === null ||
      item.establishedYear === ""
        ? null
        : Number(item.establishedYear),

    ranking: cleanString(item.ranking),

    heroImage: cleanString(item.heroImage),

    heroImagePublicId: cleanString(item.heroImagePublicId),

    gallery: cleanGallery(item.gallery),

    shortDescription: cleanString(item.shortDescription),

    overview: cleanString(item.overview),

    whyChoose: cleanStringArray(item.whyChoose),

    scholarships: cleanString(item.scholarships),

    eligibility: cleanString(item.eligibility),

    admissionRequirements: normalizeAdmissionRequirements(
      item.admissionRequirements,
    ),

    applicationFee: cleanString(item.applicationFee),

    tuitionFeeRange: cleanString(item.tuitionFeeRange),

    intakes: cleanStringArray(item.intakes),

    applicationDeadline: cleanString(item.applicationDeadline),

    languageRequirements: cleanString(item.languageRequirements),

    campusLife: cleanString(item.campusLife),

    accommodation: cleanString(item.accommodation),

    officialWebsite: cleanString(item.officialWebsite),

    brochureUrl: cleanString(item.brochureUrl),

    bachelorsCount,

    mastersCount,

    totalEnglishCourses: bachelorsCount + mastersCount,

    offersMedicineInEnglish: Boolean(item.offersMedicineInEnglish),

    seoTitle: cleanString(item.seoTitle),

    metaDescription: cleanString(item.metaDescription),

    keywords: cleanStringArray(item.keywords).map((keyword) =>
      keyword.toLowerCase(),
    ),

    isFeatured: Boolean(item.isFeatured),

    isActive: item.isActive === undefined ? true : Boolean(item.isActive),

    displayOrder: Number(item.displayOrder) || index + 1,
  };
};

const validateUniversity = (university) => {
  if (!university.name) {
    throw new Error("University name is required");
  }

  if (!university.slug) {
    throw new Error(`${university.name}: slug could not be generated`);
  }

  if (!university.region) {
    throw new Error(`${university.name}: region is required`);
  }

  if (!university.regionGroup) {
    throw new Error(`${university.name}: region group is required`);
  }
};

const seedItalianUniversities = async () => {
  try {
    await connectDb();

    console.log(
      `🎓 Starting Italian university seed for ${italianUniversities.length} records...\n`,
    );

    const operations = italianUniversities.map((item, index) => {
      const university = normalizeUniversity(item, index);

      validateUniversity(university);

      return {
        updateOne: {
          filter: {
            slug: university.slug,
          },

          update: {
            $set: university,

            $setOnInsert: {
              createdBy: null,
            },
          },

          upsert: true,
        },
      };
    });

    const result = await University.bulkWrite(operations, {
      ordered: false,
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Italian universities seeded");
    console.log(`📌 Matched  : ${result.matchedCount}`);
    console.log(`✏️ Modified : ${result.modifiedCount}`);
    console.log(`➕ Inserted : ${result.upsertedCount}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("\n❌ Italian university seed failed");
    console.error(error);

    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    console.log("✅ MongoDB connection closed");
  }
};

await seedItalianUniversities();
