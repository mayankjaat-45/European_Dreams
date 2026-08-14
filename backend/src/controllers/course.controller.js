import mongoose from "mongoose";

import Course from "../models/Course.js";
import University from "../models/University.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/* -------------------------------------------------------------------------- */
/*                                Helper methods                              */
/* -------------------------------------------------------------------------- */

const parseBoolean = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") return true;
  if (value === "false") return false;

  return undefined;
};

const parseArray = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseNumber = (value, fallback = undefined) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const exactRegex = (value = "") => {
  return new RegExp(`^${escapeRegex(String(value).trim())}$`, "i");
};

const partialRegex = (value = "") => {
  return new RegExp(escapeRegex(String(value).trim()), "i");
};

const slugifyCourseName = (name) => {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const normalizeAdmissionRequirements = (requirements = {}) => {
  if (!requirements || typeof requirements !== "object") {
    return {
      academics: "",
      ielts: "",
      toefl: "",
      pte: "",
      duolingo: "",
      centS: "",
      sat: "",
      imat: "",
      other: "",
      notes: "",
    };
  }

  return {
    academics: String(requirements.academics || "").trim(),

    ielts: String(requirements.ielts || "").trim(),

    toefl: String(requirements.toefl || "").trim(),

    pte: String(requirements.pte || "").trim(),

    duolingo: String(requirements.duolingo || "").trim(),

    centS: String(requirements.centS || "").trim(),

    sat: String(requirements.sat || "").trim(),

    imat: String(requirements.imat || "").trim(),

    other: String(requirements.other || "").trim(),

    notes: String(requirements.notes || "").trim(),
  };
};

const validateUniversity = async (universityId) => {
  if (!mongoose.isValidObjectId(universityId)) {
    throw new ApiError(400, "Invalid university ID");
  }

  const university = await University.findById(universityId);

  if (!university) {
    throw new ApiError(404, "University not found");
  }

  if (!university.isActive) {
    throw new ApiError(400, "Selected university is inactive");
  }

  return university;
};

const resolveUniversityFilter = async ({
  university,
  universitySlug,
  region,
  regionGroup,
  city,
  universityType,
}) => {
  if (university) {
    if (!mongoose.isValidObjectId(university)) {
      throw new ApiError(400, "Invalid university ID");
    }

    const universityRecord = await University.findOne({
      _id: university,
      isActive: true,
    }).select("_id");

    if (!universityRecord) {
      throw new ApiError(404, "University not found");
    }

    return universityRecord._id;
  }

  if (String(universitySlug || "").trim()) {
    const universityRecord = await University.findOne({
      slug: String(universitySlug).trim().toLowerCase(),

      isActive: true,
    }).select("_id");

    if (!universityRecord) {
      throw new ApiError(404, "University not found");
    }

    return universityRecord._id;
  }

  const universityFilter = {
    isActive: true,
  };

  if (String(region || "").trim()) {
    universityFilter.region = exactRegex(region);
  }

  if (String(regionGroup || "").trim()) {
    universityFilter.regionGroup = exactRegex(regionGroup);
  }

  if (String(city || "").trim()) {
    universityFilter.city = partialRegex(city);
  }

  if (String(universityType || "").trim()) {
    universityFilter.universityType = exactRegex(universityType);
  }

  const hasUniversityFilters = region || regionGroup || city || universityType;

  if (!hasUniversityFilters) {
    return null;
  }

  const universities = await University.find(universityFilter).select("_id");

  return mongoose.trusted({
    $in: universities.map((item) => item._id),
  });
};

/* -------------------------------------------------------------------------- */
/*                          Public course listing                             */
/* -------------------------------------------------------------------------- */

/*
 * GET /api/courses
 */
export const getCourses = async (req, res, next) => {
  try {
    const {
      search = "",
      university = "",
      universitySlug = "",

      region = "",
      regionGroup = "",
      city = "",
      universityType = "",

      degreeLevel = "",
      programmeType = "",
      fieldOfStudy = "",
      studyMode = "",
      language = "",
      admissionYear = "",

      featured,
      englishTaught,
      medicine,
      requiresIMAT,

      page = 1,
      limit = 12,
      sort = "displayOrder",
      order = "asc",
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 12, 1), 100);

    const filter = {
      isActive: true,
    };

    if (String(search).trim()) {
      const searchRegex = partialRegex(search);

      filter.$or = mongoose.trusted([
        {
          name: searchRegex,
        },
        {
          fieldOfStudy: searchRegex,
        },
        {
          shortDescription: searchRegex,
        },
        {
          overview: searchRegex,
        },
        {
          degreeType: searchRegex,
        },
      ]);
    }

    const universityFilter = await resolveUniversityFilter({
      university,
      universitySlug,
      region,
      regionGroup,
      city,
      universityType,
    });

    if (universityFilter) {
      filter.university = universityFilter;
    }

    if (String(degreeLevel).trim()) {
      filter.degreeLevel = String(degreeLevel).trim().toLowerCase();
    }

    if (String(programmeType).trim()) {
      filter.programmeType = String(programmeType).trim().toLowerCase();
    }

    if (String(fieldOfStudy).trim()) {
      filter.fieldOfStudy = partialRegex(fieldOfStudy);
    }

    if (String(studyMode).trim()) {
      filter.studyMode = String(studyMode).trim().toLowerCase();
    }

    if (String(language).trim()) {
      filter.language = exactRegex(language);
    }

    if (String(admissionYear).trim()) {
      filter.admissionYear = exactRegex(admissionYear);
    }

    const featuredValue = parseBoolean(featured);

    if (featuredValue !== undefined) {
      filter.isFeatured = featuredValue;
    }

    const englishValue = parseBoolean(englishTaught);

    if (englishValue !== undefined) {
      filter.isEnglishTaught = englishValue;
    }

    const medicineValue = parseBoolean(medicine);

    if (medicineValue !== undefined) {
      filter.isMedicineProgramme = medicineValue;
    }

    const imatValue = parseBoolean(requiresIMAT);

    if (imatValue !== undefined) {
      filter.requiresIMAT = imatValue;
    }

    const allowedSortFields = [
      "name",
      "createdAt",
      "updatedAt",
      "displayOrder",
      "degreeLevel",
      "programmeType",
      "fieldOfStudy",
      "admissionYear",
    ];

    const sortField = allowedSortFields.includes(sort) ? sort : "displayOrder";

    const sortDirection = order === "desc" ? -1 : 1;

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate(
          "university",
          [
            "name",
            "slug",
            "country",
            "city",
            "region",
            "regionGroup",
            "universityType",
            "logo",
            "heroImage",
            "isActive",
          ].join(" "),
        )
        .sort({
          [sortField]: sortDirection,
          name: 1,
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean(),

      Course.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          courses,

          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalItems: total,
            limit: limitNumber,
          },
        },
        "Courses fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                           Public course detail                             */
/* -------------------------------------------------------------------------- */

/*
 * GET /api/courses/:universitySlug/:courseSlug
 */
export const getCourseBySlug = async (req, res, next) => {
  try {
    const universitySlug = decodeURIComponent(req.params.universitySlug || "")
      .trim()
      .toLowerCase();

    const courseSlug = decodeURIComponent(req.params.courseSlug || "")
      .trim()
      .toLowerCase();

    if (!universitySlug) {
      throw new ApiError(400, "University slug is required");
    }

    if (!courseSlug) {
      throw new ApiError(400, "Course slug is required");
    }

    const university = await University.findOne({
      slug: universitySlug,
      isActive: true,
    })
      .select(
        [
          "name",
          "slug",
          "city",
          "country",
          "region",
          "regionGroup",
          "universityType",
          "heroImage",
          "shortDescription",
          "admissionRequirements",
          "officialWebsite",
        ].join(" "),
      )
      .lean();

    if (!university) {
      throw new ApiError(404, "University not found");
    }

    const course = await Course.findOne({
      university: university._id,
      slug: courseSlug,
      isActive: true,
    }).lean();

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    const relatedCourses = await Course.find({
      university: university._id,
      isActive: true,
      _id: {
        $ne: course._id,
      },
      degreeLevel: course.degreeLevel,
    })
      .select(
        [
          "name",
          "slug",
          "degreeLevel",
          "degreeType",
          "programmeType",
          "fieldOfStudy",
          "duration",
          "language",
          "isFeatured",
        ].join(" "),
      )
      .sort({
        isFeatured: -1,
        displayOrder: 1,
        name: 1,
      })
      .limit(6)
      .lean();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          course,
          university,
          relatedCourses,
        },
        "Course fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                            Admin course listing                            */
/* -------------------------------------------------------------------------- */

/*
 * GET /api/courses/admin/all
 */
export const getAdminCourses = async (req, res, next) => {
  try {
    const {
      search = "",
      university = "",
      regionGroup = "",
      status = "all",
      degreeLevel = "",
      programmeType = "",
      fieldOfStudy = "",
      featured,
      medicine,
      requiresIMAT,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const filter = {};

    if (String(search).trim()) {
      const searchRegex = partialRegex(search);

      filter.$or = mongoose.trusted([
        {
          name: searchRegex,
        },
        {
          slug: searchRegex,
        },
        {
          fieldOfStudy: searchRegex,
        },
        {
          shortDescription: searchRegex,
        },
      ]);
    }

    if (university) {
      if (!mongoose.isValidObjectId(university)) {
        throw new ApiError(400, "Invalid university ID");
      }

      filter.university = university;
    } else if (String(regionGroup).trim()) {
      const universityRecords = await University.find({
        regionGroup: exactRegex(regionGroup),
      }).select("_id");

      filter.university = mongoose.trusted({
        $in: universityRecords.map((item) => item._id),
      });
    }

    if (String(degreeLevel).trim()) {
      filter.degreeLevel = String(degreeLevel).trim().toLowerCase();
    }

    if (String(programmeType).trim()) {
      filter.programmeType = String(programmeType).trim().toLowerCase();
    }

    if (String(fieldOfStudy).trim()) {
      filter.fieldOfStudy = partialRegex(fieldOfStudy);
    }

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    const featuredValue = parseBoolean(featured);

    if (featuredValue !== undefined) {
      filter.isFeatured = featuredValue;
    }

    const medicineValue = parseBoolean(medicine);

    if (medicineValue !== undefined) {
      filter.isMedicineProgramme = medicineValue;
    }

    const imatValue = parseBoolean(requiresIMAT);

    if (imatValue !== undefined) {
      filter.requiresIMAT = imatValue;
    }

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate(
          "university",
          [
            "name",
            "slug",
            "country",
            "city",
            "region",
            "regionGroup",
            "logo",
          ].join(" "),
        )
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      Course.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          courses,

          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalItems: total,
            limit: limitNumber,
          },
        },
        "Admin courses fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                            Admin course detail                             */
/* -------------------------------------------------------------------------- */

/*
 * GET /api/courses/admin/:id
 */
export const getCourseById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid course ID");
    }

    const course = await Course.findById(req.params.id)
      .populate(
        "university",
        [
          "name",
          "slug",
          "country",
          "city",
          "region",
          "regionGroup",
          "logo",
          "heroImage",
        ].join(" "),
      )
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          course,
        },
        "Course fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                            Create a course                                 */
/* -------------------------------------------------------------------------- */

/*
 * POST /api/courses
 */
export const createCourse = async (req, res, next) => {
  try {
    const {
      university,
      name,

      degreeLevel,
      programmeType,
      degreeType,
      fieldOfStudy,

      duration,
      studyMode,
      language,
      isEnglishTaught,
      admissionYear,
      campus,

      tuitionFee,
      applicationFee,
      intakes,
      applicationDeadline,

      shortDescription,
      overview,
      eligibility,
      academicRequirements,
      admissionRequirements,

      documentsRequired,
      curriculum,
      careerOpportunities,
      scholarships,

      requiresIMAT,
      isMedicineProgramme,
      specialNotes,

      brochureUrl,
      seoTitle,
      metaDescription,
      keywords,

      isFeatured,
      isActive,
      displayOrder,
    } = req.body;

    if (!university) {
      throw new ApiError(400, "University is required");
    }

    await validateUniversity(university);

    if (!name?.trim()) {
      throw new ApiError(400, "Course name is required");
    }

    if (!degreeLevel) {
      throw new ApiError(400, "Degree level is required");
    }

    const resolvedProgrammeType = programmeType || degreeLevel;

    const temporarySlug = slugifyCourseName(name);

    const duplicateCourse = await Course.findOne({
      university,
      slug: temporarySlug,
    });

    if (duplicateCourse) {
      throw new ApiError(
        409,
        "This course already exists for the selected university",
      );
    }

    const medicineValue = parseBoolean(isMedicineProgramme) ?? false;

    const imatValue = parseBoolean(requiresIMAT) ?? medicineValue;

    const course = await Course.create({
      university,
      name: name.trim(),

      degreeLevel: medicineValue
        ? "master"
        : String(degreeLevel).trim().toLowerCase(),

      programmeType: medicineValue
        ? "single-cycle-master"
        : String(resolvedProgrammeType).trim().toLowerCase(),

      degreeType: String(degreeType || "").trim(),

      fieldOfStudy: String(fieldOfStudy || "").trim(),

      duration: medicineValue
        ? String(duration || "6 Years").trim()
        : String(duration || "To be confirmed").trim(),

      studyMode: studyMode || "on-campus",

      language: String(language || "English").trim(),

      isEnglishTaught: parseBoolean(isEnglishTaught) ?? true,

      admissionYear: String(admissionYear || "2026/27").trim(),

      campus: String(campus || "").trim(),

      tuitionFee: String(tuitionFee || "").trim(),

      applicationFee: String(applicationFee || "").trim(),

      intakes: parseArray(intakes) || [],

      applicationDeadline: String(applicationDeadline || "").trim(),

      shortDescription: String(shortDescription || "").trim(),

      overview: String(overview || "").trim(),

      eligibility: String(eligibility || "").trim(),

      academicRequirements: parseArray(academicRequirements) || [],

      admissionRequirements: normalizeAdmissionRequirements(
        admissionRequirements,
      ),

      documentsRequired: parseArray(documentsRequired) || [],

      curriculum: parseArray(curriculum) || [],

      careerOpportunities: parseArray(careerOpportunities) || [],

      scholarships: String(scholarships || "").trim(),

      requiresIMAT: imatValue,

      isMedicineProgramme: medicineValue,

      specialNotes: String(specialNotes || "").trim(),

      brochureUrl: String(brochureUrl || "").trim(),

      seoTitle: String(seoTitle || "").trim(),

      metaDescription: String(metaDescription || "").trim(),

      keywords: parseArray(keywords) || [],

      isFeatured: parseBoolean(isFeatured) ?? false,

      isActive: parseBoolean(isActive) ?? true,

      displayOrder: Math.max(parseNumber(displayOrder, 0), 0),

      createdBy: req.user?._id || null,

      updatedBy: req.user?._id || null,
    });

    const populatedCourse = await Course.findById(course._id).populate(
      "university",
      ["name", "slug", "country", "city", "region", "regionGroup", "logo"].join(
        " ",
      ),
    );

    res.status(201).json(
      new ApiResponse(
        201,
        {
          course: populatedCourse,
        },
        "Course created successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                            Update a course                                 */
/* -------------------------------------------------------------------------- */

/*
 * PUT /api/courses/:id
 */
export const updateCourse = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid course ID");
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    let universityId = course.university.toString();

    if (req.body.university !== undefined) {
      await validateUniversity(req.body.university);

      universityId = req.body.university;

      course.university = req.body.university;
    }

    const targetName = req.body.name?.trim() || course.name;

    const targetSlug = slugifyCourseName(targetName);

    const duplicateCourse = await Course.findOne({
      _id: mongoose.trusted({
        $ne: course._id,
      }),

      university: universityId,
      slug: targetSlug,
    });

    if (duplicateCourse) {
      throw new ApiError(
        409,
        "This course already exists for the selected university",
      );
    }

    if (req.body.name?.trim()) {
      course.name = req.body.name.trim();
    }

    const stringFields = [
      "degreeLevel",
      "programmeType",
      "degreeType",
      "fieldOfStudy",
      "duration",
      "studyMode",
      "language",
      "admissionYear",
      "campus",
      "tuitionFee",
      "applicationFee",
      "applicationDeadline",
      "shortDescription",
      "overview",
      "eligibility",
      "scholarships",
      "specialNotes",
      "brochureUrl",
      "seoTitle",
      "metaDescription",
    ];

    stringFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = String(req.body[field] ?? "").trim();
      }
    });

    const arrayFields = [
      "intakes",
      "academicRequirements",
      "documentsRequired",
      "curriculum",
      "careerOpportunities",
      "keywords",
    ];

    arrayFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = parseArray(req.body[field]) || [];
      }
    });

    if (req.body.admissionRequirements !== undefined) {
      course.admissionRequirements = normalizeAdmissionRequirements(
        req.body.admissionRequirements,
      );
    }

    if (req.body.isEnglishTaught !== undefined) {
      course.isEnglishTaught = parseBoolean(req.body.isEnglishTaught) ?? false;
    }

    if (req.body.requiresIMAT !== undefined) {
      course.requiresIMAT = parseBoolean(req.body.requiresIMAT) ?? false;
    }

    if (req.body.isMedicineProgramme !== undefined) {
      course.isMedicineProgramme =
        parseBoolean(req.body.isMedicineProgramme) ?? false;
    }

    if (course.isMedicineProgramme || course.requiresIMAT) {
      course.isMedicineProgramme = true;
      course.requiresIMAT = true;
      course.degreeLevel = "master";
      course.programmeType = "single-cycle-master";

      if (!course.duration || course.duration === "To be confirmed") {
        course.duration = "6 Years";
      }
    }

    if (req.body.isFeatured !== undefined) {
      course.isFeatured = parseBoolean(req.body.isFeatured) ?? false;
    }

    if (req.body.isActive !== undefined) {
      course.isActive = parseBoolean(req.body.isActive) ?? false;
    }

    if (req.body.displayOrder !== undefined) {
      course.displayOrder = Math.max(parseNumber(req.body.displayOrder, 0), 0);
    }

    course.updatedBy = req.user?._id || null;

    await course.save();

    const populatedCourse = await Course.findById(course._id).populate(
      "university",
      ["name", "slug", "country", "city", "region", "regionGroup", "logo"].join(
        " ",
      ),
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          course: populatedCourse,
        },
        "Course updated successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                          Update course status                              */
/* -------------------------------------------------------------------------- */

/*
 * PATCH /api/courses/:id/status
 */
export const updateCourseStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid course ID");
    }

    const activeValue = parseBoolean(req.body.isActive);

    if (activeValue === undefined) {
      throw new ApiError(400, "A valid isActive value is required");
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        isActive: activeValue,
        updatedBy: req.user?._id || null,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate(
      "university",
      ["name", "slug", "country", "city", "region", "regionGroup", "logo"].join(
        " ",
      ),
    );

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          course,
        },
        `Course ${course.isActive ? "activated" : "deactivated"} successfully`,
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              Delete course                                 */
/* -------------------------------------------------------------------------- */

/*
 * DELETE /api/courses/:id
 */
export const deleteCourse = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid course ID");
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    await course.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Course deleted successfully"));
  } catch (error) {
    next(error);
  }
};
