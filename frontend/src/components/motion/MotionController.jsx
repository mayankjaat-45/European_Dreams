"use client";

import { useEffect, useState } from "react";

export default function MotionController() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("website-loaded");

    if (hasLoaded) {
      setShowLoader(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowLoader(false);
      sessionStorage.setItem("website-loaded", "true");
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(
        "[data-reveal]:not(.is-visible)",
      );

      elements.forEach((element) => observer.observe(element));
    };

    observeElements();

    const mutationObserver = new MutationObserver(observeElements);

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  if (!showLoader) {
    return null;
  }

  return (
    <div
      className="website-loader"
      role="status"
      aria-label="Loading European Dreams"
    >
      <div className="website-loader__content">
        <div className="website-loader__logo">
          <span>European</span>
          <span>Dreams</span>
        </div>

        <div className="website-loader__line">
          <span />
        </div>

        <p>Building your path to Europe</p>
      </div>
    </div>
  );
}
