import ApiError from "../utils/ApiError.js";

const containsDangerousKey = (value) => {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(containsDangerousKey);
  }

  return Object.entries(value).some(([key, nestedValue]) => {
    if (key.startsWith("$") || key.includes(".")) {
      return true;
    }

    return containsDangerousKey(nestedValue);
  });
};

export const rejectDangerousKeys = (req, res, next) => {
  const requestParts = [req.body, req.query, req.params];

  if (requestParts.some(containsDangerousKey)) {
    return next(new ApiError(400, "Request contains unsupported field names"));
  }

  next();
};

export const preventParameterPollution = (req, res, next) => {
  const allowedArrayQueryFields = new Set(["tags", "keywords", "intakes"]);

  for (const [key, value] of Object.entries(req.query)) {
    if (Array.isArray(value) && !allowedArrayQueryFields.has(key)) {
      return next(
        new ApiError(
          400,
          `Multiple values are not allowed for query parameter: ${key}`,
        ),
      );
    }
  }

  next();
};
