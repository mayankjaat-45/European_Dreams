import dns from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import slugify from "slugify";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const { default: connectDb } = await import("../config/db.js");

const { default: University } = await import("../models/University.js");

const { default: Course } = await import("../models/Course.js");

const { piedmontLiguriaCourses } =
  await import("../data/italy/courses/piedmontLiguria.js");

const { lombardyCourses } = await import("../data/italy/courses/lombardy.js");

const { trentinoVenetoFriuliCourses } =
  await import("../data/italy/courses/trentinoVenetoFriuli.js");

const { emiliaRomagnaCourses } =
  await import("../data/italy/courses/emiliaRomagna.js");

const { centralItalyCourses } =
  await import("../data/italy/courses/centralItaly.js");

const { southernItalyCourses } =
  await import("../data/italy/courses/southernItaly.js");

const { islandsCourses } = await import("../data/italy/courses/islands.js");

/* -------------------------------------------------------------------------- */
/*                                Course data                                 */
/* -------------------------------------------------------------------------- */

const italianCourses = [
  ...piedmontLiguriaCourses,
  ...lombardyCourses,
  ...trentinoVenetoFriuliCourses,
  ...emiliaRomagnaCourses,
  ...centralItalyCourses,
  ...southernItalyCourses,
  ...islandsCourses,
];

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const cleanString = (value = "") => {
  return String(value ?? "").trim();
};

const cleanArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => cleanString(item)).filter(Boolean);
};

const cleanBoolean = (value, fallback = false) => {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value).toLowerCase() === "true";
};

const cleanNumber = (value, fallback = 0) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return fallback;
  }

  return number;
};

const createCourseSlug = (name) => {
  return slugify(cleanString(name), {
    lower: true,
    strict: true,
    trim: true,
  });
};

const normalizeEnglishRequirements = (course) => {
  return {
    ielts: cleanString(
      course.englishRequirements?.ielts || course.admissionRequirements?.ielts,
    ),

    toefl: cleanString(
      course.englishRequirements?.toefl || course.admissionRequirements?.toefl,
    ),

    pte: cleanString(
      course.englishRequirements?.pte || course.admissionRequirements?.pte,
    ),

    duolingo: cleanString(
      course.englishRequirements?.duolingo ||
        course.admissionRequirements?.duolingo,
    ),

    other: cleanString(
      course.englishRequirements?.other || course.admissionRequirements?.other,
    ),
  };
};

const normalizeAdmissionRequirements = (course) => {
  return {
    academics: cleanString(course.admissionRequirements?.academics),

    ielts: cleanString(course.admissionRequirements?.ielts),

    toefl: cleanString(course.admissionRequirements?.toefl),

    pte: cleanString(course.admissionRequirements?.pte),

    duolingo: cleanString(course.admissionRequirements?.duolingo),

    centS: cleanString(course.admissionRequirements?.centS),

    sat: cleanString(course.admissionRequirements?.sat),

    imat: cleanString(course.admissionRequirements?.imat),

    other: cleanString(course.admissionRequirements?.other),

    notes: cleanString(course.admissionRequirements?.notes),
  };
};

const normalizeCourse = ({ course, universityId }) => {
  const slug = createCourseSlug(course.name);

  return {
    university: universityId,

    name: cleanString(course.name),

    slug,

    degreeLevel: cleanString(course.degreeLevel).toLowerCase(),

    programmeType: cleanString(
      course.programmeType || course.degreeLevel,
    ).toLowerCase(),

    degreeType: cleanString(course.degreeType),

    fieldOfStudy: cleanString(course.fieldOfStudy),

    duration: cleanString(course.duration),

    studyMode: cleanString(course.studyMode).toLowerCase() || "on-campus",

    language: cleanString(course.language) || "English",

    isEnglishTaught: cleanBoolean(course.isEnglishTaught, true),

    admissionYear: cleanString(course.admissionYear) || "2026/27",

    campus: cleanString(course.campus),

    tuitionFee: cleanString(course.tuitionFee),

    applicationFee: cleanString(course.applicationFee),

    intakes: cleanArray(course.intakes),

    applicationDeadline: cleanString(course.applicationDeadline),

    shortDescription: cleanString(course.shortDescription),

    overview: cleanString(course.overview),

    eligibility: cleanString(course.eligibility),

    academicRequirements: cleanArray(course.academicRequirements),

    englishRequirements: normalizeEnglishRequirements(course),

    admissionRequirements: normalizeAdmissionRequirements(course),

    documentsRequired: cleanArray(course.documentsRequired),

    curriculum: cleanArray(course.curriculum),

    careerOpportunities: cleanArray(course.careerOpportunities),

    scholarships: cleanString(course.scholarships),

    requiresIMAT: cleanBoolean(course.requiresIMAT, false),

    isMedicineProgramme: cleanBoolean(course.isMedicineProgramme, false),

    specialNotes: cleanString(course.specialNotes),

    brochureUrl: cleanString(course.brochureUrl),

    seoTitle: cleanString(course.seoTitle),

    metaDescription: cleanString(course.metaDescription),

    keywords: cleanArray(course.keywords).map((keyword) =>
      keyword.toLowerCase(),
    ),

    isFeatured: cleanBoolean(course.isFeatured, false),

    isActive: cleanBoolean(course.isActive, true),

    displayOrder: cleanNumber(course.displayOrder, 0),
  };
};

const validateCourse = ({ course, universityName }) => {
  if (!course.name) {
    throw new Error(`${universityName}: course name is required`);
  }

  if (!course.slug) {
    throw new Error(
      `${universityName} - ${course.name}: slug could not be generated`,
    );
  }

  const allowedDegreeLevels = [
    "bachelor",
    "master",
    "phd",
    "diploma",
    "certificate",
    "other",
  ];

  if (!allowedDegreeLevels.includes(course.degreeLevel)) {
    throw new Error(
      `${universityName} - ${course.name}: invalid degree level "${course.degreeLevel}"`,
    );
  }

  if (!course.duration) {
    throw new Error(`${universityName} - ${course.name}: duration is required`);
  }
};

/* -------------------------------------------------------------------------- */
/*                                Seed script                                 */
/* -------------------------------------------------------------------------- */

const seedItalianCourses = async () => {
  const summary = {
    sourceCourses: italianCourses.length,
    validCourses: 0,
    missingUniversities: new Set(),
    failedCourses: [],
    matched: 0,
    modified: 0,
    inserted: 0,
  };

  try {
    await connectDb();

    console.log(
      `\n📚 Starting Italian course seed for ${italianCourses.length} records...\n`,
    );

    const universities = await University.find({
      isActive: true,
    })
      .select("_id name slug")
      .lean();

    const universityMap = new Map();

    universities.forEach((university) => {
      universityMap.set(cleanString(university.name).toLowerCase(), university);
    });

    const operations = [];

    for (const sourceCourse of italianCourses) {
      try {
        const universityName = cleanString(sourceCourse.universityName);

        if (!universityName) {
          summary.failedCourses.push({
            course: sourceCourse.name || "Unknown course",

            reason: "University name is missing",
          });

          continue;
        }

        const university = universityMap.get(universityName.toLowerCase());

        if (!university) {
          summary.missingUniversities.add(universityName);

          console.log(`⚠️ University not found: ${universityName}`);

          continue;
        }

        const normalizedCourse = normalizeCourse({
          course: sourceCourse,
          universityId: university._id,
        });

        validateCourse({
          course: normalizedCourse,
          universityName,
        });

        operations.push({
          updateOne: {
            filter: {
              university: university._id,

              slug: normalizedCourse.slug,
            },

            update: {
              $set: normalizedCourse,

              $setOnInsert: {
                createdBy: null,
              },
            },

            upsert: true,
          },
        });

        summary.validCourses += 1;
      } catch (error) {
        summary.failedCourses.push({
          course: sourceCourse.name || "Unknown course",

          university: sourceCourse.universityName || "Unknown university",

          reason: error.message,
        });

        console.error(
          `❌ Invalid course: ${sourceCourse.name || "Unknown course"}`,
        );

        console.error(error.message);
      }
    }

    if (!operations.length) {
      throw new Error("No valid course records were prepared for import");
    }

    console.log(`\n💾 Upserting ${operations.length} course records...\n`);

    const result = await Course.bulkWrite(operations, {
      ordered: false,
    });

    summary.matched = result.matchedCount || 0;

    summary.modified = result.modifiedCount || 0;

    summary.inserted = result.upsertedCount || 0;

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("✅ Italian course seed completed");

    console.log(`📘 Source records        : ${summary.sourceCourses}`);

    console.log(`✅ Valid records         : ${summary.validCourses}`);

    console.log(`🔎 Existing matched      : ${summary.matched}`);

    console.log(`✏️ Existing modified     : ${summary.modified}`);

    console.log(`➕ New records inserted  : ${summary.inserted}`);

    console.log(
      `🏛️ Missing universities : ${summary.missingUniversities.size}`,
    );

    console.log(`❌ Invalid/failed records: ${summary.failedCourses.length}`);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (summary.missingUniversities.size) {
      console.log("\nMissing universities:");

      Array.from(summary.missingUniversities)
        .sort()
        .forEach((name) => {
          console.log(`- ${name}`);
        });
    }

    if (summary.failedCourses.length) {
      console.log("\nFailed course records:");

      summary.failedCourses.slice(0, 20).forEach((item) => {
        console.log(
          `- ${item.university || ""} / ${item.course}: ${item.reason}`,
        );
      });

      if (summary.failedCourses.length > 20) {
        console.log(`...and ${summary.failedCourses.length - 20} more`);
      }
    }
  } catch (error) {
    console.error("\n❌ Italian course seed failed");

    console.error(error);

    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    console.log("\n✅ MongoDB connection closed");
  }
};

await seedItalianCourses();
