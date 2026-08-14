import mongoose from "mongoose";

import Enquiry from "../models/Enquiry.js";
import University from "../models/University.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendEmail from "../utils/sendEmail.js";
import SiteSettings from "../models/SiteSettings.js";

const validStatuses = [
  "new",
  "contacted",
  "follow_up",
  "qualified",
  "converted",
  "closed",
  "spam",
];

const validPriorities = ["low", "medium", "high"];

const validEnquiryTypes = [
  "general",
  "admission",
  "university",
  "course",
  "visa",
  "scholarship",
  "partnership",
  "other",
];

const validSources = [
  "website",
  "university_page",
  "course_page",
  "blog",
  "contact_page",
  "other",
];

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "";
};

const validateRelatedRecords = async ({
  universityInterested,
  courseInterested,
}) => {
  let university = null;
  let course = null;

  if (universityInterested) {
    if (!mongoose.isValidObjectId(universityInterested)) {
      throw new ApiError(400, "Invalid university ID");
    }

    university = await University.findOne({
      _id: universityInterested,
      isActive: true,
    }).select("name slug country");

    if (!university) {
      throw new ApiError(404, "University not found");
    }
  }

  if (courseInterested) {
    if (!mongoose.isValidObjectId(courseInterested)) {
      throw new ApiError(400, "Invalid course ID");
    }

    course = await Course.findOne({
      _id: courseInterested,
      isActive: true,
    })
      .populate("university", "name slug country")
      .select("name slug university degreeLevel");

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (
      universityInterested &&
      course.university?._id.toString() !== universityInterested.toString()
    ) {
      throw new ApiError(
        400,
        "Selected course does not belong to the selected university",
      );
    }
  }

  return {
    university,
    course,
  };
};

const sendEnquiryEmails = async ({ enquiry, university, course }) => {
  const universityName =
    university?.name || course?.university?.name || "Not selected";

  const courseName = course?.name || "Not selected";

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#10213d;">
      <h2 style="color:#174a96;">New European Dreams Enquiry</h2>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>Name</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(enquiry.name)}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>Email</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(enquiry.email)}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>Phone</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(enquiry.phone)}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>Subject</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(enquiry.subject || "Not provided")}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>Enquiry Type</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(enquiry.enquiryType || "admission")}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>Country</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(enquiry.countryInterested || "Not provided")}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>University</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(universityName)}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>Course</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(courseName)}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>Qualification</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(enquiry.currentQualification || "Not provided")}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>Preferred Intake</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(enquiry.preferredIntake || "Not provided")}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dfe7f1;"><strong>Source</strong></td>
          <td style="padding:8px;border:1px solid #dfe7f1;">${escapeHtml(enquiry.source)}</td>
        </tr>
      </table>

      <h3>Message</h3>
      <p style="white-space:pre-line;">${escapeHtml(enquiry.message || "No message provided")}</p>
    </div>
  `;

  const studentHtml = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#10213d;">
      <h2 style="color:#174a96;">Thank you for contacting European Dreams</h2>

      <p>Hello ${escapeHtml(enquiry.name)},</p>

      <p>
        We have received your study-abroad enquiry.
        Our counsellor will contact you shortly.
      </p>

      <p><strong>Your enquiry details:</strong></p>

      <ul>
        <li>Country: ${escapeHtml(enquiry.countryInterested || "Not selected")}</li>
        <li>University: ${escapeHtml(universityName)}</li>
        <li>Course: ${escapeHtml(courseName)}</li>
        <li>Preferred intake: ${escapeHtml(enquiry.preferredIntake || "Not provided")}</li>
      </ul>

      <p>
        Regards,<br />
        <strong>European Dreams Team</strong>
      </p>
    </div>
  `;

  const emailResults = {
    adminSent: false,
    studentSent: false,
  };
  let adminEmail =
    process.env.ENQUIRY_RECEIVER_EMAIL || process.env.ADMIN_EMAIL || "";

  try {
    const settings = await SiteSettings.findOne()
      .select("enquiryNotificationEmail primaryEmail")
      .lean();

    adminEmail =
      settings?.enquiryNotificationEmail ||
      settings?.primaryEmail ||
      process.env.ENQUIRY_RECEIVER_EMAIL ||
      process.env.ADMIN_EMAIL ||
      "";
  } catch (error) {
    console.error("Could not load enquiry notification email:", error.message);
  }

  if (adminEmail) {
    try {
      await sendEmail({
        to: adminEmail,
        replyTo: enquiry.email,
        subject: `New ${enquiry.enquiryType} enquiry: ${enquiry.name}`,
        html: adminHtml,
        text: `New enquiry received from ${enquiry.name}, ${enquiry.email}, ${enquiry.phone}`,
      });

      emailResults.adminSent = true;
    } catch (error) {
      console.error("Admin enquiry email failed:", error.message);
    }
  }

  try {
    await sendEmail({
      to: enquiry.email,
      subject: "We received your European Dreams enquiry",
      html: studentHtml,
      text: `Hello ${enquiry.name}, we have received your enquiry. Our counsellor will contact you shortly.`,
    });

    emailResults.studentSent = true;
  } catch (error) {
    console.error("Student confirmation email failed:", error.message);
  }

  return emailResults;
};

/*
 * Public
 * POST /api/enquiries
 */
const sanitizeTrackingValue = (value, maxLength = 500) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
};

/*
 * Public
 * POST /api/enquiries
 */
export const createEnquiry = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      enquiryType,
      universityInterested,
      courseInterested,
      currentQualification,
      preferredIntake,
      message,
      source,
      pageUrl,
      attribution = {},
      consent = {},
    } = req.body;

    if (!name?.trim()) {
      throw new ApiError(400, "Name is required");
    }

    if (!email?.trim()) {
      throw new ApiError(400, "Email is required");
    }

    if (!phone?.trim()) {
      throw new ApiError(400, "Phone number is required");
    }

    if (consent.contact !== true) {
      throw new ApiError(400, "Please provide consent to be contacted");
    }

    if (enquiryType && !validEnquiryTypes.includes(enquiryType)) {
      throw new ApiError(400, "Invalid enquiry type");
    }

    if (source && !validSources.includes(source)) {
      throw new ApiError(400, "Invalid enquiry source");
    }

    const { university, course } = await validateRelatedRecords({
      universityInterested,
      courseInterested,
    });

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      subject: subject?.trim() || "",
      enquiryType: enquiryType || "admission",
      countryInterested: "Italy",

      universityInterested:
        university?._id ||
        course?.university?._id ||
        course?.university ||
        null,

      courseInterested: course?._id || null,

      currentQualification: currentQualification?.trim() || "",
      preferredIntake: preferredIntake?.trim() || "",
      message: message?.trim() || "",
      source: source || "website",
      pageUrl: sanitizeTrackingValue(pageUrl, 1000),

      attribution: {
        gclid: sanitizeTrackingValue(attribution.gclid, 500),
        gbraid: sanitizeTrackingValue(attribution.gbraid, 500),
        wbraid: sanitizeTrackingValue(attribution.wbraid, 500),
        utmSource: sanitizeTrackingValue(attribution.utmSource, 200),
        utmMedium: sanitizeTrackingValue(attribution.utmMedium, 200),
        utmCampaign: sanitizeTrackingValue(attribution.utmCampaign, 300),
        utmTerm: sanitizeTrackingValue(attribution.utmTerm, 300),
        utmContent: sanitizeTrackingValue(attribution.utmContent, 300),
        landingPage: sanitizeTrackingValue(attribution.landingPage, 1500),
        referrer: sanitizeTrackingValue(attribution.referrer, 1500),
      },

      consent: {
        contact: true,
        capturedAt: new Date(),
      },

      ipAddress: sanitizeTrackingValue(getClientIp(req), 100),
      userAgent: sanitizeTrackingValue(req.headers["user-agent"], 1000),
    });

    const emailResults = await sendEnquiryEmails({
      enquiry,
      university,
      course,
    });

    enquiry.emailNotificationSent = emailResults.adminSent;
    enquiry.confirmationEmailSent = emailResults.studentSent;

    await enquiry.save({
      validateBeforeSave: false,
    });

    res.status(201).json(
      new ApiResponse(
        201,
        {
          enquiryId: enquiry._id,
        },
        "Enquiry submitted successfully. Our counsellor will contact you shortly.",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * GET /api/enquiries
 */
export const getEnquiries = async (req, res, next) => {
  try {
    const {
      search = "",
      status = "",
      priority = "",
      enquiryType = "",
      source = "",
      assignedTo = "",
      dateFrom = "",
      dateTo = "",
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid enquiry status");
      }

      filter.status = status;
    }

    if (priority) {
      if (!validPriorities.includes(priority)) {
        throw new ApiError(400, "Invalid enquiry priority");
      }

      filter.priority = priority;
    }

    if (enquiryType) {
      if (!validEnquiryTypes.includes(enquiryType)) {
        throw new ApiError(400, "Invalid enquiry type");
      }

      filter.enquiryType = enquiryType;
    }

    if (source) {
      if (!validSources.includes(source)) {
        throw new ApiError(400, "Invalid enquiry source");
      }

      filter.source = source;
    }

    if (assignedTo) {
      if (!mongoose.isValidObjectId(assignedTo)) {
        throw new ApiError(400, "Invalid assigned user ID");
      }

      filter.assignedTo = assignedTo;
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};

      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }

      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter)
        .populate("universityInterested", "name slug country city")
        .populate("courseInterested", "name slug degreeLevel")
        .populate("assignedTo", "name email role")
        .populate("updatedBy", "name email")
        .sort({
          createdAt: -1,
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      Enquiry.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          enquiries,
          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalItems: total,
            limit: limitNumber,
          },
        },
        "Enquiries fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * GET /api/enquiries/:id
 */
export const getEnquiryById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid enquiry ID");
    }

    const enquiry = await Enquiry.findById(req.params.id)
      .populate("universityInterested", "name slug country city logo")
      .populate("courseInterested", "name slug degreeLevel duration")
      .populate("assignedTo", "name email role")
      .populate("updatedBy", "name email");

    if (!enquiry) {
      throw new ApiError(404, "Enquiry not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          enquiry,
        },
        "Enquiry fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * PUT /api/enquiries/:id
 */
export const updateEnquiry = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid enquiry ID");
    }

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      throw new ApiError(404, "Enquiry not found");
    }

    const { status, priority, assignedTo, adminNotes, followUpDate } = req.body;

    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid enquiry status");
      }

      enquiry.status = status;

      if (status === "contacted" && !enquiry.contactedAt) {
        enquiry.contactedAt = new Date();
      }
    }

    if (priority !== undefined) {
      if (!validPriorities.includes(priority)) {
        throw new ApiError(400, "Invalid priority");
      }

      enquiry.priority = priority;
    }

    if (assignedTo !== undefined) {
      if (!assignedTo) {
        enquiry.assignedTo = null;
      } else {
        if (!mongoose.isValidObjectId(assignedTo)) {
          throw new ApiError(400, "Invalid assigned user ID");
        }

        const assignedUser = await User.findOne({
          _id: assignedTo,
          isActive: true,
        });

        if (!assignedUser) {
          throw new ApiError(404, "Assigned user not found");
        }

        enquiry.assignedTo = assignedTo;
      }
    }

    if (adminNotes !== undefined) {
      enquiry.adminNotes = adminNotes;
    }

    if (followUpDate !== undefined) {
      enquiry.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }

    enquiry.updatedBy = req.user._id;

    await enquiry.save();

    const populatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate("universityInterested", "name slug country city")
      .populate("courseInterested", "name slug degreeLevel")
      .populate("assignedTo", "name email role")
      .populate("updatedBy", "name email");

    res.status(200).json(
      new ApiResponse(
        200,
        {
          enquiry: populatedEnquiry,
        },
        "Enquiry updated successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * DELETE /api/enquiries/:id
 */
export const deleteEnquiry = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid enquiry ID");
    }

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      throw new ApiError(404, "Enquiry not found");
    }

    await enquiry.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Enquiry deleted successfully"));
  } catch (error) {
    next(error);
  }
};
