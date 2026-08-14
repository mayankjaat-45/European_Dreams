import mongoose from "mongoose";

import Testimonial from "../models/Testimonial.js";
import University from "../models/University.js";
import Course from "../models/Course.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const allowedVisaJurisdictions = [
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Kolkata",
  "Not specified",
];

const parseBoolean = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
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

const partialRegex = (value = "") => {
  return new RegExp(escapeRegex(String(value).trim()), "i");
};

const normalizeOptionalId = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || null;
};

const normalizeVisaJurisdiction = (value, fallback = "Not specified") => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const normalizedValue = String(value).trim();

  if (!allowedVisaJurisdictions.includes(normalizedValue)) {
    throw new ApiError(
      400,
      `Invalid visa jurisdiction. Allowed values: ${allowedVisaJurisdictions.join(
        ", ",
      )}`,
    );
  }

  return normalizedValue;
};

const validateScholarshipData = ({
  scholarshipReceived,
  scholarshipDetails,
}) => {
  if (
    scholarshipReceived === false &&
    String(scholarshipDetails || "").trim()
  ) {
    throw new ApiError(
      400,
      "Scholarship details cannot be added when scholarshipReceived is false",
    );
  }
};

const validateRelations = async ({ university, course }) => {
  let universityRecord = null;
  let courseRecord = null;

  const universityId = normalizeOptionalId(university);

  const courseId = normalizeOptionalId(course);

  if (universityId) {
    if (!mongoose.isValidObjectId(universityId)) {
      throw new ApiError(400, "Invalid university ID");
    }

    universityRecord = await University.findById(universityId);

    if (!universityRecord) {
      throw new ApiError(404, "University not found");
    }

    if (!universityRecord.isActive) {
      throw new ApiError(400, "Selected university is inactive");
    }
  }

  if (courseId) {
    if (!mongoose.isValidObjectId(courseId)) {
      throw new ApiError(400, "Invalid course ID");
    }

    courseRecord = await Course.findById(courseId);

    if (!courseRecord) {
      throw new ApiError(404, "Course not found");
    }

    if (!courseRecord.isActive) {
      throw new ApiError(400, "Selected course is inactive");
    }

    if (
      universityRecord &&
      courseRecord.university.toString() !== universityRecord._id.toString()
    ) {
      throw new ApiError(
        400,
        "Selected course does not belong to the selected university",
      );
    }

    if (!universityRecord) {
      universityRecord = await University.findById(courseRecord.university);

      if (!universityRecord) {
        throw new ApiError(
          404,
          "University related to this course was not found",
        );
      }

      if (!universityRecord.isActive) {
        throw new ApiError(
          400,
          "University related to this course is inactive",
        );
      }
    }
  }

  return {
    universityRecord,
    courseRecord,
  };
};

/* -------------------------------------------------------------------------- */
/*                                  Public                                    */
/* -------------------------------------------------------------------------- */

/*
 * GET /api/testimonials
 *
 * Supported filters:
 * search
 * university
 * course
 * featured
 * visaApproved
 * visaJurisdiction
 * scholarshipReceived
 * page
 * limit
 */
export const getTestimonials = async (req, res, next) => {
  try {
    const {
      search = "",
      university = "",
      course = "",
      featured,
      visaApproved,
      visaJurisdiction = "",
      scholarshipReceived,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 12, 1), 100);

    const filter = {
      isActive: true,
      consentToPublish: true,
    };

    if (String(search).trim()) {
      const searchRegex = partialRegex(search);

      filter.$or = mongoose.trusted([
        {
          studentName: searchRegex,
        },
        {
          review: searchRegex,
        },
        {
          shortReview: searchRegex,
        },
        {
          result: searchRegex,
        },
        {
          qualification: searchRegex,
        },
        {
          studentCity: searchRegex,
        },
        {
          visaJurisdiction: searchRegex,
        },
      ]);
    }

    if (university) {
      if (!mongoose.isValidObjectId(university)) {
        throw new ApiError(400, "Invalid university ID");
      }

      filter.university = university;
    }

    if (course) {
      if (!mongoose.isValidObjectId(course)) {
        throw new ApiError(400, "Invalid course ID");
      }

      filter.course = course;
    }

    const featuredValue = parseBoolean(featured);

    if (featuredValue !== undefined) {
      filter.isFeatured = featuredValue;
    }

    const visaValue = parseBoolean(visaApproved);

    if (visaValue !== undefined) {
      filter.visaApproved = visaValue;
    }

    if (String(visaJurisdiction).trim()) {
      filter.visaJurisdiction = normalizeVisaJurisdiction(visaJurisdiction);
    }

    const scholarshipValue = parseBoolean(scholarshipReceived);

    if (scholarshipValue !== undefined) {
      filter.scholarshipReceived = scholarshipValue;
    }

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter)
        .populate(
          "university",
          "name slug country city region regionGroup heroImage",
        )
        .populate(
          "course",
          "name slug degreeLevel programmeType duration fieldOfStudy",
        )
        .sort({ updatedAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean(),

      Testimonial.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          testimonials,

          pagination: {
            currentPage: pageNumber,

            totalPages: Math.ceil(total / limitNumber),

            totalItems: total,

            limit: limitNumber,
          },
        },
        "Testimonials fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Admin                                    */
/* -------------------------------------------------------------------------- */

/*
 * GET /api/testimonials/admin/all
 */
export const getAdminTestimonials = async (req, res, next) => {
  try {
    const {
      search = "",
      status = "all",
      university = "",
      course = "",
      featured,
      visaApproved,
      visaJurisdiction = "",
      scholarshipReceived,
      consentToPublish,
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
          studentName: searchRegex,
        },
        {
          review: searchRegex,
        },
        {
          shortReview: searchRegex,
        },
        {
          result: searchRegex,
        },
        {
          qualification: searchRegex,
        },
        {
          studentCity: searchRegex,
        },
        {
          visaJurisdiction: searchRegex,
        },
      ]);
    }

    if (university) {
      if (!mongoose.isValidObjectId(university)) {
        throw new ApiError(400, "Invalid university ID");
      }

      filter.university = university;
    }

    if (course) {
      if (!mongoose.isValidObjectId(course)) {
        throw new ApiError(400, "Invalid course ID");
      }

      filter.course = course;
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

    const visaValue = parseBoolean(visaApproved);

    if (visaValue !== undefined) {
      filter.visaApproved = visaValue;
    }

    if (String(visaJurisdiction).trim()) {
      filter.visaJurisdiction = normalizeVisaJurisdiction(visaJurisdiction);
    }

    const scholarshipValue = parseBoolean(scholarshipReceived);

    if (scholarshipValue !== undefined) {
      filter.scholarshipReceived = scholarshipValue;
    }

    const consentValue = parseBoolean(consentToPublish);

    if (consentValue !== undefined) {
      filter.consentToPublish = consentValue;
    }

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter)
        .populate(
          "university",
          "name slug country city region regionGroup heroImage",
        )
        .populate(
          "course",
          "name slug degreeLevel programmeType duration fieldOfStudy",
        )
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .sort({
          updatedAt: -1,
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      Testimonial.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          testimonials,

          pagination: {
            currentPage: pageNumber,

            totalPages: Math.ceil(total / limitNumber),

            totalItems: total,

            limit: limitNumber,
          },
        },
        "Admin testimonials fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              Admin details                                 */
/* -------------------------------------------------------------------------- */

/*
 * GET /api/testimonials/admin/:id
 */
export const getTestimonialById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid testimonial ID");
    }

    const testimonial = await Testimonial.findById(req.params.id)
      .populate(
        "university",
        "name slug country city region regionGroup heroImage",
      )
      .populate(
        "course",
        "name slug degreeLevel programmeType duration fieldOfStudy",
      )
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!testimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          testimonial,
        },
        "Testimonial fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              Create testimonial                            */
/* -------------------------------------------------------------------------- */

/*
 * POST /api/testimonials
 */
export const createTestimonial = async (req, res, next) => {
  try {
    const {
      studentName,
      university,
      course,
      qualification,
      intake,
      review,
      shortReview,
      rating,
      result,
      admissionYear,
      studentCity,
      visaApproved,
      visaJurisdiction,
      scholarshipReceived,
      scholarshipDetails,
      consentToPublish,
      isFeatured,
      isActive,
      displayOrder,
    } = req.body;

    if (!studentName?.trim()) {
      throw new ApiError(400, "Student name is required");
    }

    if (!review?.trim()) {
      throw new ApiError(400, "Testimonial review is required");
    }

    const relations = await validateRelations({
      university,
      course,
    });

    const ratingValue = rating !== undefined ? Number(rating) : 5;

    if (!Number.isFinite(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }

    const visaApprovedValue = parseBoolean(visaApproved) ?? false;

    const visaJurisdictionValue = normalizeVisaJurisdiction(visaJurisdiction);

    const scholarshipReceivedValue = parseBoolean(scholarshipReceived) ?? false;

    const scholarshipDetailsValue = String(scholarshipDetails || "").trim();

    const consentToPublishValue = parseBoolean(consentToPublish) ?? false;

    let isFeaturedValue = parseBoolean(isFeatured) ?? false;

    if (!consentToPublishValue) {
      isFeaturedValue = false;
    }

    validateScholarshipData({
      scholarshipReceived: scholarshipReceivedValue,

      scholarshipDetails: scholarshipDetailsValue,
    });

    const testimonial = await Testimonial.create({
      studentName: studentName.trim(),

      university: relations.universityRecord?._id || null,

      course: relations.courseRecord?._id || null,

      qualification: String(qualification || "").trim(),

      intake: String(intake || "").trim(),

      review: review.trim(),

      shortReview: String(shortReview || "").trim(),

      rating: ratingValue,

      result: String(result || "").trim(),

      admissionYear: String(admissionYear || "").trim(),

      studentCity: String(studentCity || "").trim(),

      visaApproved: visaApprovedValue,

      visaJurisdiction: visaJurisdictionValue,

      scholarshipReceived: scholarshipReceivedValue,

      scholarshipDetails: scholarshipDetailsValue,

      consentToPublish: consentToPublishValue,

      isFeatured: isFeaturedValue,

      isActive: parseBoolean(isActive) ?? true,

      displayOrder: Math.max(parseNumber(displayOrder, 0), 0),

      createdBy: req.user?._id || null,

      updatedBy: req.user?._id || null,
    });

    const populatedTestimonial = await Testimonial.findById(testimonial._id)
      .populate(
        "university",
        "name slug country city region regionGroup heroImage",
      )
      .populate(
        "course",
        "name slug degreeLevel programmeType duration fieldOfStudy",
      );

    res.status(201).json(
      new ApiResponse(
        201,
        {
          testimonial: populatedTestimonial,
        },
        "Testimonial created successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              Update testimonial                            */
/* -------------------------------------------------------------------------- */

/*
 * PUT /api/testimonials/:id
 */
export const updateTestimonial = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid testimonial ID");
    }

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    if (req.body.university !== undefined || req.body.course !== undefined) {
      const universityId =
        req.body.university !== undefined
          ? normalizeOptionalId(req.body.university)
          : testimonial.university?.toString() || null;

      const existingCourseId =
        req.body.course !== undefined
          ? normalizeOptionalId(req.body.course)
          : testimonial.course?.toString() || null;

      const courseId =
        req.body.university !== undefined && req.body.course === undefined
          ? null
          : existingCourseId;

      const relations = await validateRelations({
        university: universityId,

        course: courseId,
      });

      testimonial.university = relations.universityRecord?._id || null;

      testimonial.course = relations.courseRecord?._id || null;
    }

    const stringFields = [
      "studentName",
      "qualification",
      "intake",
      "review",
      "shortReview",
      "result",
      "admissionYear",
      "studentCity",
      "scholarshipDetails",
    ];

    stringFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        testimonial[field] = String(req.body[field] ?? "").trim();
      }
    });

    if (req.body.visaJurisdiction !== undefined) {
      testimonial.visaJurisdiction = normalizeVisaJurisdiction(
        req.body.visaJurisdiction,
      );
    }

    if (!testimonial.studentName?.trim()) {
      throw new ApiError(400, "Student name is required");
    }

    if (!testimonial.review?.trim()) {
      throw new ApiError(400, "Testimonial review is required");
    }

    if (req.body.rating !== undefined) {
      const ratingValue = Number(req.body.rating);

      if (!Number.isFinite(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5");
      }

      testimonial.rating = ratingValue;
    }

    const booleanFields = [
      "visaApproved",
      "scholarshipReceived",
      "consentToPublish",
      "isFeatured",
      "isActive",
    ];

    booleanFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        const parsedValue = parseBoolean(req.body[field]);

        if (parsedValue === undefined) {
          throw new ApiError(400, `${field} must be true or false`);
        }

        testimonial[field] = parsedValue;
      }
    });

    if (!testimonial.consentToPublish) {
      testimonial.isFeatured = false;
    }

    validateScholarshipData({
      scholarshipReceived: testimonial.scholarshipReceived,

      scholarshipDetails: testimonial.scholarshipDetails,
    });

    if (req.body.displayOrder !== undefined) {
      testimonial.displayOrder = Math.max(
        parseNumber(req.body.displayOrder, 0),
        0,
      );
    }

    testimonial.updatedBy = req.user?._id || null;

    await testimonial.save();

    const populatedTestimonial = await Testimonial.findById(testimonial._id)
      .populate(
        "university",
        "name slug country city region regionGroup heroImage",
      )
      .populate(
        "course",
        "name slug degreeLevel programmeType duration fieldOfStudy",
      )
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    res.status(200).json(
      new ApiResponse(
        200,
        {
          testimonial: populatedTestimonial,
        },
        "Testimonial updated successfully",
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
 * PATCH /api/testimonials/:id/status
 */
export const updateTestimonialStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid testimonial ID");
    }

    const activeValue = parseBoolean(req.body.isActive);

    if (activeValue === undefined) {
      throw new ApiError(400, "A valid isActive value is required");
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        isActive: activeValue,

        updatedBy: req.user?._id || null,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate(
        "university",
        "name slug country city region regionGroup heroImage",
      )
      .populate(
        "course",
        "name slug degreeLevel programmeType duration fieldOfStudy",
      );

    if (!testimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          testimonial,
        },
        `Testimonial ${
          testimonial.isActive ? "activated" : "deactivated"
        } successfully`,
      ),
    );
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                             Delete testimonial                             */
/* -------------------------------------------------------------------------- */

/*
 * DELETE /api/testimonials/:id
 */
export const deleteTestimonial = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid testimonial ID");
    }

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    await testimonial.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Testimonial deleted successfully"));
  } catch (error) {
    next(error);
  }
};
