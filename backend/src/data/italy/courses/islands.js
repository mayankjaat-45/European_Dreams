import { createUniversityCourses } from "./createCourse.js";

export const islandsCourses = [
  ...createUniversityCourses({
    universityName: "University of Sassari",
    requirements: {
      academics: "60% in Bachelor's Degree",
      ielts: "6.0",
      pte: "",
      centS: "",
      sat: "",
    },
    bachelors: [],
    masters: [
      "Biotechnology for Human and Animal Health",
      "Innovation Management for Sustainable Tourism",
      "Wildlife Management, Conservation and Control",
    ],
    featuredCourses: [],
  }),

  ...createUniversityCourses({
    universityName: "University of Cagliari",
    requirements: {
      academics: "60% in Bachelor's Degree",
      ielts: "6.0",
      pte: "",
      centS: "",
      sat: "",
    },
    bachelors: [],
    masters: [
      "Computer Engineering, Cybersecurity and Artificial Intelligence",
      "Economics, Finance and Public Policy",
      "Electronic Engineering",
      "Environmental Engineering for Sustainable Development",
      "Innovation Management",
      "International Management",
      "Sustainable Tourism Management",
      "Biomedical Engineering",
      "Physics",
      "Cellular and Molecular Biology",
      "Data Engineering, Artificial Intelligence and Cybersecurity",
    ],
    featuredCourses: [
      "Computer Engineering, Cybersecurity and Artificial Intelligence",
      "Data Engineering, Artificial Intelligence and Cybersecurity",
    ],
  }),

  ...createUniversityCourses({
    universityName: "University of Messina",
    requirements: {
      academics: "70% in Class 12th or Bachelor's Degree",
      ielts: "6.0",
      pte: "",
      centS: "",
      sat: "",
    },
    bachelors: [
      "Business Management",
      "Civil Engineering",
      "Political Science and International Relations",
      "Data Analysis",
      "Marine Sciences",
    ],
    masters: [
      "Banking and Finance",
      "Cognitive Science and Theory of Communication",
      "Computer Engineering",
      "Data Science",
      "Engineering and Computer Science",
      "Geophysical Sciences for Seismic Risk",
      "International Management",
      "Quantitative Methods for Economics and Finance",
      "Safety and Quality of Animal Production",
      "Physics (English curriculum)",
    ],
    featuredCourses: ["Data Science", "Engineering and Computer Science"],
  }),

  ...createUniversityCourses({
    universityName: "University of Palermo",
    requirements: {
      academics: "60% in Class 12th or Bachelor's Degree",
      ielts: "6.0",
      pte: "",
      centS: "25/90",
      sat: "",
    },
    bachelors: [
      "Economics and Finance",
      "Industrial and Information Engineering",
      "Global Studies: History, Politics and Cultures",
    ],
    masters: [
      "Biology (Neurosciences)",
      "Electronics Engineering",
      "Tourism Development and Management",
      "International Relations – International Trade",
      "International Relations – International Studies",
      "Economic and Financial Sciences – Economic and Financial Analysis",
      "Complex Administrations and Organisations Science – Public Management",
      "Mediterranean Food Science and Technology",
      "Business Economic Sciences – Entrepreneurship and Management",
      "Development and Migration Studies",
      "Religions and Cultures",
    ],
    featuredCourses: [],
  }),
];
