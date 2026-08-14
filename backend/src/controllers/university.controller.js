import mongoose from "mongoose";

import University from "../models/University.js";
import Course from "../models/Course.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
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

const parseGallery = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return {
          url: item.trim(),
          publicId: "",
          alt: "",
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        url: String(item.url || "").trim(),
        publicId: String(item.publicId || "").trim(),
        alt: String(item.alt || "").trim(),
      };
    })
    .filter((item) => item?.url);
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

const parseNumber = (value, fallback = undefined) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const normalizeAdmissionRequirements = (value = {}) => {
  if (!value || typeof value !== "object") {
    return {
      academics: "",
      ielts: "",
      pte: "",
      centS: "",
      sat: "",
      imat: "",
      notes: "",
    };
  }

  return {
    academics: String(value.academics || "").trim(),
    ielts: String(value.ielts || "").trim(),
    pte: String(value.pte || "").trim(),
    centS: String(value.centS || "").trim(),
    sat: String(value.sat || "").trim(),
    imat: String(value.imat || "").trim(),
    notes: String(value.notes || "").trim(),
  };
};

/* -------------------------------------------------------------------------- */
/*                              Public listing                                */
/* -------------------------------------------------------------------------- */

/*
 * GET /api/universities
 */
export const getUniversities = async (req, res, next) => {
  try {
    const {
      search = "",
      city = "",
      region = "",
      regionGroup = "",
      universityType = "",
      featured,
      medicine,
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
        { name: searchRegex },
        { city: searchRegex },
        { region: searchRegex },
        { regionGroup: searchRegex },
        { shortDescription: searchRegex },
        { overview: searchRegex },
      ]);
    }

    if (String(city).trim()) {
      filter.city = partialRegex(city);
    }

    if (String(region).trim()) {
      filter.region = exactRegex(region);
    }

    if (String(regionGroup).trim()) {
      filter.regionGroup = exactRegex(regionGroup);
    }

    if (String(universityType).trim()) {
      filter.universityType = exactRegex(universityType);
    }

    const featuredValue = parseBoolean(featured);

    if (featuredValue !== undefined) {
      filter.isFeatured = featuredValue;
    }

    const medicineValue = parseBoolean(medicine);

    if (medicineValue !== undefined) {
      filter.offersMedicineInEnglish = medicineValue;
    }

    const allowedSortFields = [
      "name",
      "createdAt",
      "updatedAt",
      "displayOrder",
      "establishedYear",
      "bachelorsCount",
      "mastersCount",
      "totalEnglishCourses",
    ];

    const sortField = allowedSortFields.includes(sort) ? sort : "displayOrder";

    const sortDirection = order === "desc" ? -1 : 1;

    const [universities, total] = await Promise.all([
      University.find(filter)
        .select(
          [
            "name",
            "slug",
            "country",
            "city",
            "region",
            "regionGroup",
            "universityType",
            "establishedYear",
            "ranking",
            "heroImage",
            "shortDescription",
            "bachelorsCount",
            "mastersCount",
            "totalEnglishCourses",
            "offersMedicineInEnglish",
            "isFeatured",
            "displayOrder",
          ].join(" "),
        )
        .sort({
          [sortField]: sortDirection,
          name: 1,
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean(),

      University.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          universities,
          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalItems: total,
            limit: limitNumber,
          },
        },
        "Universities fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                               Admin listing                                */
/* -------------------------------------------------------------------------- */

/*
 * GET /api/universities/admin/all
 */
export const getAdminUniversities = async (req, res, next) => {
  try {
    const {
      search = "",
      status = "all",
      city = "",
      region = "",
      regionGroup = "",
      universityType = "",
      featured,
      medicine,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const filter = {};

    if (String(search).trim()) {
      const searchRegex = partialRegex(search);

      filter.$or = mongoose.trusted([
        { name: searchRegex },
        { slug: searchRegex },
        { city: searchRegex },
        { region: searchRegex },
        { regionGroup: searchRegex },
      ]);
    }

    if (String(city).trim()) {
      filter.city = partialRegex(city);
    }

    if (String(region).trim()) {
      filter.region = exactRegex(region);
    }

    if (String(regionGroup).trim()) {
      filter.regionGroup = exactRegex(regionGroup);
    }

    if (String(universityType).trim()) {
      filter.universityType = exactRegex(universityType);
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
      filter.offersMedicineInEnglish = medicineValue;
    }

    const [universities, total] = await Promise.all([
      University.find(filter)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      University.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          universities,
          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalItems: total,
            limit: limitNumber,
          },
        },
        "Admin universities fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              Public details                                */
/* -------------------------------------------------------------------------- */

/*
 * Public
 * GET /api/universities/:slug
 */
export const getUniversityBySlug = async (req, res, next) => {
  try {
    const slug = String(req.params.slug || "")
      .trim()
      .toLowerCase();

    if (!slug) {
      throw new ApiError(400, "University slug is required");
    }

    const university = await University.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!university) {
      throw new ApiError(404, "University not found");
    }

    const courses = await Course.find({
      university: university._id,
      isActive: true,
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
          "studyMode",
          "language",
          "isEnglishTaught",
          "tuitionFee",
          "applicationFee",
          "intakes",
          "applicationDeadline",
          "admissionYear",
          "campus",
          "shortDescription",
          "isFeatured",
          "requiresIMAT",
          "isMedicineProgramme",
          "displayOrder",
        ].join(" "),
      )
      .sort({
        degreeLevel: 1,
        displayOrder: 1,
        name: 1,
      })
      .lean();

    const bachelors = [];
    const masters = [];
    const singleCycleMasters = [];
    const phdCourses = [];
    const otherCourses = [];

    courses.forEach((course) => {
      if (course.programmeType === "single-cycle-master") {
        singleCycleMasters.push(course);
        return;
      }

      if (course.degreeLevel === "bachelor") {
        bachelors.push(course);
        return;
      }

      if (course.degreeLevel === "master") {
        masters.push(course);
        return;
      }

      if (course.degreeLevel === "phd") {
        phdCourses.push(course);
        return;
      }

      otherCourses.push(course);
    });

    const medicineCourses = courses.filter(
      (course) =>
        course.isMedicineProgramme === true || course.requiresIMAT === true,
    );

    const featuredCourses = courses.filter(
      (course) => course.isFeatured === true,
    );

    const actualBachelors = bachelors.length + singleCycleMasters.length;

    const actualMasters = masters.length;

    const actualTotalCourses = courses.length;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          university,

          courses,

          groupedCourses: {
            bachelors,
            masters,
            singleCycleMasters,
            phdCourses,
            otherCourses,
          },

          featuredCourses,

          medicineCourses,

          totals: {
            courses: actualTotalCourses,

            bachelors: bachelors.length,

            masters: masters.length,

            singleCycleMasters: singleCycleMasters.length,

            phdCourses: phdCourses.length,

            otherCourses: otherCourses.length,

            medicineCourses: medicineCourses.length,

            /*
             * Kept separately for reference because these
             * values were originally imported from the brochure.
             */
            brochure: {
              total: university.totalEnglishCourses || 0,

              bachelors: university.bachelorsCount || 0,

              masters: university.mastersCount || 0,
            },

            /*
             * This combines ordinary Bachelor's programmes
             * with single-cycle degrees that appeared in the
             * brochure's Bachelor's column.
             */
            brochureStyleBachelors: actualBachelors,

            databaseMasters: actualMasters,
          },
        },
        "University fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                               Admin details                                */
/* -------------------------------------------------------------------------- */

/*
 * GET /api/universities/admin/:id
 */
export const getUniversityById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid university ID");
    }

    const university = await University.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!university) {
      throw new ApiError(404, "University not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          university,
        },
        "University fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              Create university                             */
/* -------------------------------------------------------------------------- */

/*
 * POST /api/universities
 */
export const createUniversity = async (req, res, next) => {
  try {
    const {
      name,
      city,
      region,
      regionGroup,
      universityType,
      establishedYear,
      ranking,

      heroImage,
      heroImagePublicId,
      gallery,

      shortDescription,
      overview,
      whyChoose,
      scholarships,
      eligibility,
      admissionRequirements,
      applicationFee,
      tuitionFeeRange,
      intakes,
      applicationDeadline,
      languageRequirements,
      campusLife,
      accommodation,
      officialWebsite,
      brochureUrl,
      bachelorsCount,
      mastersCount,
      offersMedicineInEnglish,
      seoTitle,
      metaDescription,
      keywords,
      isFeatured,
      isActive,
      displayOrder,
    } = req.body;

    if (!name?.trim()) {
      throw new ApiError(400, "University name is required");
    }

    if (!region?.trim()) {
      throw new ApiError(400, "Italian region is required");
    }

    if (!regionGroup?.trim()) {
      throw new ApiError(400, "Region group is required");
    }

    const existingUniversity = await University.findOne({
      name: exactRegex(name),
    });

    if (existingUniversity) {
      throw new ApiError(409, "A university with this name already exists");
    }

    const university = await University.create({
      name: name.trim(),
      country: "Italy",

      city: String(city || "").trim(),
      region: region.trim(),
      regionGroup: regionGroup.trim(),

      universityType: String(universityType || "public")
        .trim()
        .toLowerCase(),

      establishedYear: parseNumber(establishedYear, null),
      ranking: String(ranking || "").trim(),

      heroImage: String(heroImage || "").trim(),
      heroImagePublicId: String(heroImagePublicId || "").trim(),
      gallery: parseGallery(gallery) || [],

      shortDescription: String(shortDescription || "").trim(),
      overview: String(overview || "").trim(),

      whyChoose: parseArray(whyChoose) || [],

      scholarships: String(scholarships || "").trim(),
      eligibility: String(eligibility || "").trim(),

      admissionRequirements: normalizeAdmissionRequirements(
        admissionRequirements,
      ),

      applicationFee: String(applicationFee || "").trim(),
      tuitionFeeRange: String(tuitionFeeRange || "").trim(),

      intakes: parseArray(intakes) || [],

      applicationDeadline: String(applicationDeadline || "").trim(),
      languageRequirements: String(languageRequirements || "").trim(),

      campusLife: String(campusLife || "").trim(),
      accommodation: String(accommodation || "").trim(),

      officialWebsite: String(officialWebsite || "").trim(),
      brochureUrl: String(brochureUrl || "").trim(),

      bachelorsCount: Math.max(parseNumber(bachelorsCount, 0), 0),
      mastersCount: Math.max(parseNumber(mastersCount, 0), 0),

      offersMedicineInEnglish: parseBoolean(offersMedicineInEnglish) ?? false,

      seoTitle: String(seoTitle || "").trim(),
      metaDescription: String(metaDescription || "").trim(),

      keywords: parseArray(keywords) || [],

      isFeatured: parseBoolean(isFeatured) ?? false,
      isActive: parseBoolean(isActive) ?? true,

      displayOrder: Math.max(parseNumber(displayOrder, 0), 0),

      createdBy: req.user?._id || null,
      updatedBy: req.user?._id || null,
    });

    res.status(201).json(
      new ApiResponse(
        201,
        {
          university,
        },
        "University created successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              Update university                             */
/* -------------------------------------------------------------------------- */

/*
 * PUT /api/universities/:id
 */
export const updateUniversity = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid university ID");
    }

    const university = await University.findById(req.params.id);

    if (!university) {
      throw new ApiError(404, "University not found");
    }

    if (req.body.name?.trim()) {
      const duplicateUniversity = await University.findOne({
        _id: mongoose.trusted({
          $ne: university._id,
        }),

        name: exactRegex(req.body.name),
      });

      if (duplicateUniversity) {
        throw new ApiError(409, "A university with this name already exists");
      }

      university.name = req.body.name.trim();
    }

    if (req.body.region !== undefined) {
      if (!String(req.body.region).trim()) {
        throw new ApiError(400, "Italian region is required");
      }

      university.region = String(req.body.region).trim();
    }

    if (req.body.regionGroup !== undefined) {
      if (!String(req.body.regionGroup).trim()) {
        throw new ApiError(400, "Region group is required");
      }

      university.regionGroup = String(req.body.regionGroup).trim();
    }

    const stringFields = [
      "city",
      "universityType",
      "ranking",

      "heroImage",
      "heroImagePublicId",

      "shortDescription",
      "overview",
      "scholarships",
      "eligibility",
      "applicationFee",
      "tuitionFeeRange",
      "applicationDeadline",
      "languageRequirements",
      "campusLife",
      "accommodation",
      "officialWebsite",
      "brochureUrl",
      "seoTitle",
      "metaDescription",
    ];

    stringFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        university[field] = String(req.body[field] ?? "").trim();
      }
    });

    const arrayFields = ["whyChoose", "intakes", "keywords"];

    arrayFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        university[field] = parseArray(req.body[field]) || [];
      }
    });

    if (req.body.gallery !== undefined) {
      university.gallery = parseGallery(req.body.gallery) || [];
    }

    if (req.body.admissionRequirements !== undefined) {
      university.admissionRequirements = normalizeAdmissionRequirements(
        req.body.admissionRequirements,
      );
    }

    if (req.body.establishedYear !== undefined) {
      university.establishedYear =
        req.body.establishedYear === ""
          ? null
          : parseNumber(req.body.establishedYear, null);
    }

    if (req.body.bachelorsCount !== undefined) {
      university.bachelorsCount = Math.max(
        parseNumber(req.body.bachelorsCount, 0),
        0,
      );
    }

    if (req.body.mastersCount !== undefined) {
      university.mastersCount = Math.max(
        parseNumber(req.body.mastersCount, 0),
        0,
      );
    }

    if (req.body.offersMedicineInEnglish !== undefined) {
      const medicineValue = parseBoolean(req.body.offersMedicineInEnglish);

      if (medicineValue === undefined) {
        throw new ApiError(
          400,
          "offersMedicineInEnglish must be true or false",
        );
      }

      university.offersMedicineInEnglish = medicineValue;
    }

    if (req.body.isFeatured !== undefined) {
      const featuredValue = parseBoolean(req.body.isFeatured);

      if (featuredValue === undefined) {
        throw new ApiError(400, "isFeatured must be true or false");
      }

      university.isFeatured = featuredValue;
    }

    if (req.body.isActive !== undefined) {
      const activeValue = parseBoolean(req.body.isActive);

      if (activeValue === undefined) {
        throw new ApiError(400, "isActive must be true or false");
      }

      university.isActive = activeValue;
    }

    if (req.body.displayOrder !== undefined) {
      university.displayOrder = Math.max(
        parseNumber(req.body.displayOrder, 0),
        0,
      );
    }

    university.country = "Italy";
    university.updatedBy = req.user?._id || null;

    await university.save();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          university,
        },
        "University updated successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                            Update active status                            */
/* -------------------------------------------------------------------------- */

/*
 * PATCH /api/universities/:id/status
 */
export const updateUniversityStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid university ID");
    }

    const activeValue = parseBoolean(req.body.isActive);

    if (activeValue === undefined) {
      throw new ApiError(400, "A valid isActive value is required");
    }

    const university = await University.findByIdAndUpdate(
      req.params.id,
      {
        isActive: activeValue,
        updatedBy: req.user?._id || null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!university) {
      throw new ApiError(404, "University not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          university,
        },
        `University ${
          university.isActive ? "activated" : "deactivated"
        } successfully`,
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                             Delete university                              */
/* -------------------------------------------------------------------------- */

/*
 * DELETE /api/universities/:id
 */
export const deleteUniversity = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid university ID");
    }

    const university = await University.findById(req.params.id);

    if (!university) {
      throw new ApiError(404, "University not found");
    }

    const associatedCourses = await Course.countDocuments({
      university: university._id,
    });

    if (associatedCourses > 0) {
      throw new ApiError(
        409,
        `This university has ${associatedCourses} associated course(s). Delete or move those courses before deleting the university.`,
      );
    }

    await university.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "University deleted successfully"));
  } catch (error) {
    next(error);
  }
};
