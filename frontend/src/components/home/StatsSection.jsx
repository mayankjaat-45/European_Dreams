"use client";

import { useEffect, useRef, useState } from "react";
import { getPublicSettings } from "@/services/settings.service";

const fallbackStats = {
  partnerUniversities: 200,
  availableCourses: 2000,
  europeanCountries: 28,
  studentsGuided: 500,
  showPlusSign: true,
};

function AnimatedNumber({ value, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numberRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = numberRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        const targetValue = Number(value || 0);
        const duration = 1400;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Smooth ease-out animation
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          setDisplayValue(Math.floor(targetValue * easedProgress));

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            setDisplayValue(targetValue);
          }
        };

        requestAnimationFrame(updateNumber);
        observer.disconnect();
      },
      {
        threshold: 0.4,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={numberRef}>
      {displayValue.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const [websiteStats, setWebsiteStats] = useState(fallbackStats);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const settings = await getPublicSettings();
        const stats = settings?.websiteStats;

        if (isMounted && stats) {
          setWebsiteStats({
            ...fallbackStats,
            ...stats,
          });
        }
      } catch (error) {
        console.error("Unable to fetch website statistics:", error);
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      value: websiteStats.partnerUniversities,
      label: "Partner Universities",
    },
    {
      value: websiteStats.availableCourses,
      label: "Courses Available",
    },
    {
      value: websiteStats.europeanCountries,
      label: "European Countries",
    },
    {
      value: websiteStats.studentsGuided,
      label: "Students Guided",
    },
  ];

  const suffix = websiteStats.showPlusSign ? "+" : "";

  return (
    <section
      data-reveal
      className="relative overflow-hidden border-y border-border bg-card"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-300 px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              data-reveal="scale"
              data-delay={(index % 4) + 1}
              className="motion-card group relative overflow-hidden rounded-2xl border border-border bg-background px-4 py-7 text-center shadow-sm sm:px-5"
            >
              {/* Animated decorative circle */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 transition-transform duration-500 group-hover:scale-150" />

              <div className="pointer-events-none absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-secondary/8 transition-transform duration-500 group-hover:scale-125" />

              <p
                className={`relative text-3xl font-extrabold tracking-tight sm:text-4xl ${
                  index % 2 === 0 ? "text-primary" : "text-secondary"
                }`}
              >
                <AnimatedNumber value={stat.value} suffix={suffix} />
              </p>

              <p className="relative mt-2 text-sm font-medium leading-6 text-muted sm:text-base">
                {stat.label}
              </p>

              {/* Bottom accent */}
              <span
                className={`absolute inset-x-0 bottom-0 mx-auto h-1 w-0 rounded-full transition-all duration-500 group-hover:w-1/2 ${
                  index % 2 === 0 ? "bg-primary" : "bg-secondary"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
