import React, { useState } from "react";
import "./LearningView.css";
import {
  FaCheckCircle,
  FaLightbulb,
  FaArrowLeft,
  FaArrowRight,
  FaFlag,
} from "react-icons/fa";

const modulesData = [
  {
    title: "1. Introduction",
    color: "#A7F3D0",
    concepts: [
      { id: 1, title: "Welcome to the Course", understood: true },
      { id: 2, title: "How This Works", understood: false },
    ],
  },
  {
    title: "2. Core Concepts",
    color: "#FDE68A",
    concepts: [
      { id: 3, title: "Understanding VPCs", understood: false },
      { id: 4, title: "Subnets Explained", understood: false },
    ],
  },
];

const slidesData = [
  {
    id: 1,
    title: "Welcome to the Course",
    explanation:
      "This course will guide you through structured, bite-sized lessons designed for easy learning.",
    example: "Example: You'll learn using real-world cloud setups and diagrams.",
    tip: "Take notes as you go to strengthen your understanding!",
  },
  {
    id: 2,
    title: "How This Works",
    explanation:
      "Each concept is presented like a slide with clear examples and key takeaways.",
    example: "Example: Visuals, code snippets, and stories for every topic.",
    tip: "You can mark topics as understood and track your progress anytime.",
  },
  {
    id: 3,
    title: "Understanding VPCs",
    explanation:
      "A Virtual Private Cloud (VPC) is an isolated network environment in the cloud.",
    example:
      "Example: AWS VPC allows you to define subnets, route tables, and gateways.",
    tip: "Think of a VPC as your personal data center in the cloud!",
  },
];

const LearningView = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [understood, setUnderstood] = useState([]);

  const totalSlides = slidesData.length;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) setCurrentSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleMarkUnderstood = () => {
    if (!understood.includes(currentSlide)) {
      setUnderstood([...understood, currentSlide]);
    }
  };

  return (
    <div className="learning-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <h3>Modules</h3>
        {modulesData.map((module, mIdx) => (
          <div key={mIdx} className="module">
            <div className="module-title" style={{ background: module.color }}>
              {module.title}
            </div>
            <ul>
              {module.concepts.map((concept) => (
                <li
                  key={concept.id}
                  className={`concept ${
                    understood.includes(concept.id - 1) ? "done" : ""
                  }`}
                >
                  {concept.title}{" "}
                  {understood.includes(concept.id - 1) && (
                    <FaCheckCircle className="check-icon" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* ===== Main Slide Area ===== */}
      <main className="slide-area">
        <div className="slide-header">
          <h2>
            {slidesData[currentSlide].title}{" "}
            <span className="slide-count">
              ({currentSlide + 1}/{totalSlides})
            </span>
          </h2>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="slide-body">
          <p className="explanation">{slidesData[currentSlide].explanation}</p>
          <div className="example-box">
            <strong>Example:</strong> {slidesData[currentSlide].example}
          </div>
          <div className="tip-box">
            <FaLightbulb className="tip-icon" /> {slidesData[currentSlide].tip}
          </div>
        </div>

        {/* ===== Bottom Navigation ===== */}
        <div className="slide-footer">
          <button
            className="nav-btn"
            onClick={handlePrev}
            disabled={currentSlide === 0}
          >
            <FaArrowLeft /> Previous
          </button>

          <button className="understood-btn" onClick={handleMarkUnderstood}>
            <FaCheckCircle /> Mark as Understood
          </button>

          <button
            className="nav-btn"
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
          >
            Next <FaArrowRight />
          </button>

          <button className="report-btn">
            <FaFlag /> Report Issue
          </button>
        </div>
      </main>
    </div>
  );
};

export default LearningView;
