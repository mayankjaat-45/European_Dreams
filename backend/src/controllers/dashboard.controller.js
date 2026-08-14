import University from "../models/University.js";
import Course from "../models/Course.js";
import Blog from "../models/Blog.js";
import Enquiry from "../models/Enquiry.js";

import ApiResponse from "../utils/ApiResponse.js";

const getStartOfDay = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  return start;
};

const getEndOfDay = (date = new Date()) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return end;
};

const getLastSevenDays = () => {
  const days = [];

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);

    days.push({
      date,
      start: getStartOfDay(date),
      end: getEndOfDay(date),
    });
  }

  return days;
};

/*
 * Admin
 * GET /api/dashboard/stats
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    const [
      totalUniversities,
      activeUniversities,
      featuredUniversities,

      totalCourses,
      activeCourses,
      featuredCourses,

      totalBlogs,
      publishedBlogs,
      draftBlogs,
      featuredBlogs,

      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      followUpEnquiries,
      qualifiedEnquiries,
      convertedEnquiries,
      closedEnquiries,
      todayEnquiries,
    ] = await Promise.all([
      University.countDocuments(),
      University.countDocuments({
        isActive: true,
      }),
      University.countDocuments({
        isFeatured: true,
        isActive: true,
      }),

      Course.countDocuments(),
      Course.countDocuments({
        isActive: true,
      }),
      Course.countDocuments({
        isFeatured: true,
        isActive: true,
      }),

      Blog.countDocuments(),
      Blog.countDocuments({
        status: "published",
        isActive: true,
      }),
      Blog.countDocuments({
        status: "draft",
      }),
      Blog.countDocuments({
        isFeatured: true,
        isActive: true,
      }),

      Enquiry.countDocuments(),
      Enquiry.countDocuments({
        status: "new",
      }),
      Enquiry.countDocuments({
        status: "contacted",
      }),
      Enquiry.countDocuments({
        status: "follow_up",
      }),
      Enquiry.countDocuments({
        status: "qualified",
      }),
      Enquiry.countDocuments({
        status: "converted",
      }),
      Enquiry.countDocuments({
        status: "closed",
      }),
      Enquiry.countDocuments({
        createdAt: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      }),
    ]);

    const recentEnquiries = await Enquiry.find()
      .populate("universityInterested", "name slug country city")
      .populate("courseInterested", "name slug degreeLevel")
      .populate("assignedTo", "name email role")
      .sort({
        createdAt: -1,
      })
      .limit(8)
      .lean();

    const responseRate =
      totalEnquiries > 0
        ? Math.round(
            ((contactedEnquiries +
              followUpEnquiries +
              qualifiedEnquiries +
              convertedEnquiries +
              closedEnquiries) /
              totalEnquiries) *
              100,
          )
        : 0;

    const conversionRate =
      totalEnquiries > 0
        ? Math.round((convertedEnquiries / totalEnquiries) * 100)
        : 0;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          overview: {
            universities: {
              total: totalUniversities,
              active: activeUniversities,
              featured: featuredUniversities,
            },

            courses: {
              total: totalCourses,
              active: activeCourses,
              featured: featuredCourses,
            },

            blogs: {
              total: totalBlogs,
              published: publishedBlogs,
              draft: draftBlogs,
              featured: featuredBlogs,
            },

            enquiries: {
              total: totalEnquiries,
              today: todayEnquiries,
              new: newEnquiries,
              contacted: contactedEnquiries,
              followUp: followUpEnquiries,
              qualified: qualifiedEnquiries,
              converted: convertedEnquiries,
              closed: closedEnquiries,
            },
          },

          performance: {
            responseRate,
            conversionRate,
          },

          recentEnquiries,
        },
        "Dashboard statistics fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * GET /api/dashboard/enquiry-chart
 */
export const getEnquiryChart = async (req, res, next) => {
  try {
    const days = getLastSevenDays();

    const chartData = await Promise.all(
      days.map(async ({ date, start, end }) => {
        const count = await Enquiry.countDocuments({
          createdAt: {
            $gte: start,
            $lte: end,
          },
        });

        return {
          date: start.toISOString().split("T")[0],

          day: new Intl.DateTimeFormat("en-IN", {
            weekday: "short",
          }).format(date),

          count,
        };
      }),
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          chartData,
        },
        "Enquiry chart data fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * GET /api/dashboard/enquiry-status
 */
export const getEnquiryStatusSummary = async (req, res, next) => {
  try {
    const statuses = [
      "new",
      "contacted",
      "follow_up",
      "qualified",
      "converted",
      "closed",
      "spam",
    ];

    const statusSummary = await Enquiry.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const mappedStatus = statuses.map((status) => {
      const item = statusSummary.find((entry) => entry._id === status);

      return {
        status,
        count: item?.count || 0,
      };
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          statuses: mappedStatus,
        },
        "Enquiry status summary fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * GET /api/dashboard/upcoming-follow-ups
 */
export const getUpcomingFollowUps = async (req, res, next) => {
  try {
    const now = new Date();

    const nextSevenDays = new Date();

    nextSevenDays.setDate(nextSevenDays.getDate() + 7);

    nextSevenDays.setHours(23, 59, 59, 999);

    const followUps = await Enquiry.find({
      followUpDate: {
        $gte: now,
        $lte: nextSevenDays,
      },

      status: {
        $in: ["contacted", "follow_up", "qualified"],
      },
    })
      .populate("universityInterested", "name slug country city")
      .populate("courseInterested", "name slug degreeLevel")
      .populate("assignedTo", "name email role")
      .sort({
        followUpDate: 1,
      })
      .limit(20)
      .lean();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          followUps,
        },
        "Upcoming follow-ups fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};
