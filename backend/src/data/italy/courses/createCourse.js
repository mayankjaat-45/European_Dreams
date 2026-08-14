const DEFAULT_NOTES =
  "Programme availability and admission requirements are indicative. Confirm the latest details on the official university website before applying.";

const inferFieldOfStudy = (name = "") => {
  const value = name.toLowerCase();

  const rules = [
    [["artificial intelligence", "data science", "computer", "cyber", "informatics", "digital"], "Computer Science and Data"],
    [["medicine", "medical", "health", "nursing", "pharmacy", "biomedical", "biotechnology", "biotech"], "Health and Life Sciences"],
    [["engineering", "electronics", "electrical", "mechanical", "civil", "telecommunication", "automation", "mechatronics"], "Engineering"],
    [["economics", "finance", "business", "management", "marketing", "entrepreneurship", "accounting"], "Business and Economics"],
    [["architecture", "design", "urban", "built environment", "landscape"], "Architecture and Design"],
    [["environment", "sustainability", "climate", "earth", "geology", "geophysics", "marine", "agriculture", "food"], "Environment and Sustainability"],
    [["law", "politics", "international relations", "governance", "human rights"], "Law and Social Sciences"],
    [["physics", "mathematics", "chemistry", "materials", "biology", "genomics"], "Natural Sciences"],
    [["language", "literature", "humanities", "history", "philosophy", "culture"], "Humanities"],
  ];

  for (const [keywords, field] of rules) {
    if (keywords.some((keyword) => value.includes(keyword))) {
      return field;
    }
  }

  return "Interdisciplinary Studies";
};

const getSpecialProgramme = (name = "", degreeLevel = "") => {
  const value = name.toLowerCase();

  if (value.includes("medicine and surgery")) {
    return {
      degreeLevel: "master",
      programmeType: "single-cycle-master",
      degreeType: "Single-cycle Master's Degree",
      duration: "6 Years",
      requiresIMAT: true,
      isMedicineProgramme: true,
    };
  }

  if (value.includes("dental medicine")) {
    return {
      degreeLevel: "master",
      programmeType: "single-cycle-master",
      degreeType: "Single-cycle Master's Degree",
      duration: "6 Years",
      requiresIMAT: false,
      isMedicineProgramme: false,
    };
  }

  if (value.includes("pharmacy") && value.includes("single-cycle")) {
    return {
      degreeLevel: "master",
      programmeType: "single-cycle-master",
      degreeType: "Single-cycle Master's Degree",
      duration: "5 Years",
      requiresIMAT: false,
      isMedicineProgramme: false,
    };
  }

  return {
    degreeLevel,
    programmeType: degreeLevel,
    degreeType:
      degreeLevel === "bachelor"
        ? "Bachelor's Degree"
        : degreeLevel === "master"
          ? "Master's Degree"
          : "",
    duration:
      degreeLevel === "bachelor"
        ? "3 Years"
        : degreeLevel === "master"
          ? "2 Years"
          : "To be confirmed",
    requiresIMAT: false,
    isMedicineProgramme: false,
  };
};

const createCourse = ({
  universityName,
  name,
  degreeLevel,
  academics = "",
  ielts = "",
  pte = "",
  centS = "",
  sat = "",
  isFeatured = false,
  displayOrder = 0,
}) => {
  const special = getSpecialProgramme(name, degreeLevel);

  return {
    universityName,
    name,

    degreeLevel: special.degreeLevel,
    programmeType: special.programmeType,
    degreeType: special.degreeType,
    fieldOfStudy: inferFieldOfStudy(name),
    duration: special.duration,

    studyMode: "on-campus",
    language: "English",
    isEnglishTaught: true,
    admissionYear: "2026/27",
    campus: "",

    tuitionFee: "",
    applicationFee: "",
    intakes: [],
    applicationDeadline: "",

    shortDescription: `Study ${name} in English at ${universityName}.`,
    overview: `${name} is an English-taught programme offered by ${universityName} in Italy.`,

    eligibility:
      "Eligibility depends on the applicant's academic background and programme-specific admission requirements.",

    academicRequirements: academics ? [academics] : [],

    admissionRequirements: {
      academics,
      ielts,
      toefl: "",
      pte,
      duolingo: "",
      centS:
        degreeLevel === "bachelor"
          ? centS
          : "",
      sat:
        degreeLevel === "bachelor"
          ? sat
          : "",
      imat: special.requiresIMAT
        ? "IMAT is typically required for admission."
        : "",
      other: "",
      notes: DEFAULT_NOTES,
    },

    documentsRequired: [],
    curriculum: [],
    careerOpportunities: [],

    scholarships:
      "Scholarship availability should be confirmed with the university and the relevant regional scholarship authority.",

    requiresIMAT: special.requiresIMAT,
    isMedicineProgramme: special.isMedicineProgramme,
    specialNotes: "",

    brochureUrl: "",

    seoTitle: `${name} at ${universityName}`,
    metaDescription: `Explore ${name} at ${universityName}, including admission requirements, duration and study opportunities in Italy.`,

    keywords: [
      name.toLowerCase(),
      universityName.toLowerCase(),
      "study in italy",
      "english courses in italy",
    ],

    isFeatured,
    isActive: true,
    displayOrder,
  };
};

const createUniversityCourses = ({
  universityName,
  requirements = {},
  bachelors = [],
  masters = [],
  featuredCourses = [],
}) => {
  let displayOrder = 1;

  const makeCourse = (name, degreeLevel) => {
    const course = createCourse({
      universityName,
      name,
      degreeLevel,
      academics: requirements.academics || "",
      ielts: requirements.ielts || "",
      pte: requirements.pte || "",
      centS: requirements.centS || "",
      sat: requirements.sat || "",
      isFeatured: featuredCourses.includes(name),
      displayOrder,
    });

    displayOrder += 1;

    return course;
  };

  return [
    ...bachelors.map((name) => makeCourse(name, "bachelor")),
    ...masters.map((name) => makeCourse(name, "master")),
  ];
};

export { createCourse, createUniversityCourses };
export default createCourse;
