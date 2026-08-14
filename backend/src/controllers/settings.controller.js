import SiteSettings from "../models/SiteSettings.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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

const parseNumber = (value, fieldName) => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    throw new ApiError(400, `${fieldName} must be a valid non-negative number`);
  }

  return parsedValue;
};

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create({
      websiteName: "European Dreams",

      tagline: "Your journey to study in Italy starts here.",

      /*
       * This is the consultancy office country,
       * not the study destination.
       */
      country: "India",

      footerDescription:
        "European Dreams provides guidance for studying in Italy, including university selection, English-taught courses, scholarships, applications and student visas.",

      websiteStats: {
        partnerUniversities: 200,
        availableCourses: 2000,
        europeanCountries: 28,
        studentsGuided: 5000,
        showPlusSign: true,
      },

      seo: {
        defaultTitle: "European Dreams | Study in Italy",

        defaultDescription:
          "Study in Italy with leading universities, English-taught courses, scholarships, admission guidance and student visa support.",

        defaultKeywords: [
          "study in Italy",
          "Italian universities",
          "English courses in Italy",
          "Italy scholarships",
          "Italy student visa",
          "medicine in Italy",
        ],

        robotsIndex: true,
        robotsFollow: true,
      },
    });
  }

  return settings;
};

/*
 * Public
 * GET /api/settings
 */
export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    const publicSettings = {
      websiteName: settings.websiteName,

      tagline: settings.tagline,

      logo: settings.logo,

      darkLogo: settings.darkLogo,

      favicon: settings.favicon,

      websiteStats: {
        partnerUniversities: settings.websiteStats?.partnerUniversities ?? 200,

        availableCourses: settings.websiteStats?.availableCourses ?? 2000,

        europeanCountries: settings.websiteStats?.europeanCountries ?? 28,

        studentsGuided: settings.websiteStats?.studentsGuided ?? 5000,

        showPlusSign: settings.websiteStats?.showPlusSign ?? true,
      },

      primaryEmail: settings.primaryEmail,

      secondaryEmail: settings.secondaryEmail,

      primaryPhone: settings.primaryPhone,

      secondaryPhone: settings.secondaryPhone,

      whatsappNumber: settings.whatsappNumber,

      /*
       * Business office address.
       */
      address: settings.address,

      city: settings.city,

      state: settings.state,

      country: settings.country,

      postalCode: settings.postalCode,

      googleMapUrl: settings.googleMapUrl,

      googleMapEmbedUrl: settings.googleMapEmbedUrl,

      footerDescription: settings.footerDescription,

      copyrightText: settings.copyrightText,

      socialLinks: settings.socialLinks,

      seo: settings.seo,

      analytics: settings.analytics,

      businessHours: settings.businessHours,

      maintenanceMode: settings.maintenanceMode,

      maintenanceMessage: settings.maintenanceMessage,
    };

    res.status(200).json(
      new ApiResponse(
        200,
        {
          settings: publicSettings,
        },
        "Website settings fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * GET /api/settings/admin
 */
export const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    await settings.populate("updatedBy", "name email");

    res.status(200).json(
      new ApiResponse(
        200,
        {
          settings,
        },
        "Admin settings fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * PUT /api/settings
 */
export const updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    const stringFields = [
      "websiteName",
      "tagline",

      "logo",
      "logoPublicId",

      "darkLogo",
      "darkLogoPublicId",

      "favicon",
      "faviconPublicId",

      "primaryEmail",
      "secondaryEmail",

      "primaryPhone",
      "secondaryPhone",

      "whatsappNumber",

      "address",
      "city",
      "state",
      "country",
      "postalCode",

      "googleMapUrl",
      "googleMapEmbedUrl",

      "footerDescription",
      "copyrightText",

      "maintenanceMessage",
      "enquiryNotificationEmail",
    ];

    stringFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = String(req.body[field] ?? "").trim();
      }
    });

    /*
     * Italy-focused website statistics.
     */
    if (req.body.websiteStats !== undefined) {
      const stats = req.body.websiteStats || {};

      if (!settings.websiteStats) {
        settings.websiteStats = {};
      }

      const numberFields = [
        "partnerUniversities",
        "availableCourses",
        "europeanCountries",
        "studentsGuided",
      ];

      numberFields.forEach((field) => {
        if (stats[field] !== undefined) {
          settings.websiteStats[field] = parseNumber(stats[field], field);
        }
      });

      if (stats.showPlusSign !== undefined) {
        const plusSignValue = parseBoolean(stats.showPlusSign);

        if (plusSignValue === undefined) {
          throw new ApiError(400, "showPlusSign must be true or false");
        }

        settings.websiteStats.showPlusSign = plusSignValue;
      }
    }

    if (req.body.socialLinks !== undefined) {
      const socialLinks = req.body.socialLinks || {};

      settings.socialLinks = {
        facebook: socialLinks.facebook ?? settings.socialLinks?.facebook ?? "",

        instagram:
          socialLinks.instagram ?? settings.socialLinks?.instagram ?? "",

        youtube: socialLinks.youtube ?? settings.socialLinks?.youtube ?? "",

        linkedin: socialLinks.linkedin ?? settings.socialLinks?.linkedin ?? "",

        twitter: socialLinks.twitter ?? settings.socialLinks?.twitter ?? "",
      };
    }

    if (req.body.seo !== undefined) {
      const seo = req.body.seo || {};

      const robotsIndex =
        seo.robotsIndex !== undefined
          ? parseBoolean(seo.robotsIndex)
          : (settings.seo?.robotsIndex ?? true);

      const robotsFollow =
        seo.robotsFollow !== undefined
          ? parseBoolean(seo.robotsFollow)
          : (settings.seo?.robotsFollow ?? true);

      if (seo.robotsIndex !== undefined && robotsIndex === undefined) {
        throw new ApiError(400, "robotsIndex must be true or false");
      }

      if (seo.robotsFollow !== undefined && robotsFollow === undefined) {
        throw new ApiError(400, "robotsFollow must be true or false");
      }

      settings.seo = {
        defaultTitle:
          seo.defaultTitle ??
          settings.seo?.defaultTitle ??
          "European Dreams | Study in Italy",

        defaultDescription:
          seo.defaultDescription ??
          settings.seo?.defaultDescription ??
          "Study in Italy with leading universities, English-taught courses, scholarships, admission guidance and student visa support.",

        defaultKeywords:
          seo.defaultKeywords !== undefined
            ? parseArray(seo.defaultKeywords)
            : settings.seo?.defaultKeywords || [],

        ogImage: seo.ogImage ?? settings.seo?.ogImage ?? "",

        canonicalUrl: seo.canonicalUrl ?? settings.seo?.canonicalUrl ?? "",

        robotsIndex,
        robotsFollow,
      };
    }

    if (req.body.analytics !== undefined) {
      const analytics = req.body.analytics || {};

      settings.analytics = {
        googleAnalyticsId:
          analytics.googleAnalyticsId ??
          settings.analytics?.googleAnalyticsId ??
          "",

        googleTagManagerId:
          analytics.googleTagManagerId ??
          settings.analytics?.googleTagManagerId ??
          "",

        metaPixelId:
          analytics.metaPixelId ?? settings.analytics?.metaPixelId ?? "",
      };
    }

    if (req.body.businessHours !== undefined) {
      const businessHours = req.body.businessHours || {};

      settings.businessHours = {
        mondayToSaturday:
          businessHours.mondayToSaturday ??
          settings.businessHours?.mondayToSaturday ??
          "",

        sunday: businessHours.sunday ?? settings.businessHours?.sunday ?? "",
      };
    }

    if (req.body.maintenanceMode !== undefined) {
      const maintenanceValue = parseBoolean(req.body.maintenanceMode);

      if (maintenanceValue === undefined) {
        throw new ApiError(400, "maintenanceMode must be true or false");
      }

      settings.maintenanceMode = maintenanceValue;
    }

    settings.updatedBy = req.user?._id || null;

    await settings.save();

    await settings.populate("updatedBy", "name email");

    res.status(200).json(
      new ApiResponse(
        200,
        {
          settings,
        },
        "Website settings updated successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};
