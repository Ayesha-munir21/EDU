<<<<<<< HEAD
import React, { useState, useEffect, useContext } from "react";
=======
import React, { useState } from "react";
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
import "./LearningView.css";
import {
  FaCheckCircle,
  FaLightbulb,
  FaArrowLeft,
  FaArrowRight,
  FaFlag,
} from "react-icons/fa";
<<<<<<< HEAD
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

export const API_BASE_URL = "https://ceretification-app.onrender.com";

const LearningView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Get track info from navigation state
  const { trackId, trackName } = location.state || {};

  const [concepts, setConcepts] = useState([]);
  const [modules, setModules] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [understoodIds, setUnderstoodIds] = useState([]); 
  const [loading, setLoading] = useState(true);

  // ===== 1. FETCH DATA =====
  useEffect(() => {
    if (!trackId || !user) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // A. Fetch Concepts
        const conceptsRes = await fetch(`${API_BASE_URL}/api/tracks/${trackId}/concepts?full=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!conceptsRes.ok) throw new Error("Failed to load concepts");
        
        const conceptsData = await conceptsRes.json();
        setConcepts(conceptsData);

        // B. Organize Concepts into Modules
        const grouped = {};
        conceptsData.forEach(c => {
            const mId = c.moduleId || "General";
            if(!grouped[mId]) grouped[mId] = [];
            grouped[mId].push(c);
        });

        // Transform into array for sidebar
        const moduleList = Object.keys(grouped).map((key, idx) => ({
            title: key === "General" ? "Core Concepts" : `Module ${idx + 1}`,
            color: idx % 2 === 0 ? "#A7F3D0" : "#FDE68A",
            concepts: grouped[key]
        }));
        setModules(moduleList);

        // C. Fetch Progress
        const progRes = await fetch(`${API_BASE_URL}/api/progress/${trackId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        if (progRes.ok) {
            const progData = await progRes.json();
            // Filter only 'understood' statuses
            const understood = progData.conceptStatuses
                ?.filter(s => s.status === 'understood')
                .map(s => s.conceptId) || [];
            setUnderstoodIds(understood);
        }

      } catch (error) {
        console.error("Error loading learning view:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trackId, user]);

  // ===== HELPER: SAFE ID GETTER =====
  // Handles cases where backend sends '_id' vs 'id'
  const getConceptId = (c) => c.id || c._id;

  // Helper: Get current concept object
  const currentConcept = concepts[currentSlideIndex];

  // ===== HANDLERS =====
  
  // ✅ FIX: Robust Click Handler
  const handleSlideClick = (clickedConcept) => {
    const clickedId = getConceptId(clickedConcept);
    
    // Find the index in the main 'concepts' array
    const index = concepts.findIndex((c) => getConceptId(c) === clickedId);
    
    if (index !== -1) {
      setCurrentSlideIndex(index);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < concepts.length - 1) {
        setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
        setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleMarkUnderstood = async () => {
    if (!currentConcept) return;
    const cId = getConceptId(currentConcept);

    // Optimistic UI Update
    if (!understoodIds.includes(cId)) {
        setUnderstoodIds([...understoodIds, cId]);
    }

    try {
        const token = localStorage.getItem("accessToken");
        await fetch(`${API_BASE_URL}/api/progress/concepts/${cId}/mark`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: "understood" })
        });
    } catch (error) {
        console.error("Failed to save progress:", error);
    }
  };

  if (!trackId) return <div style={{padding: "20px"}}>No track selected. Go back to Dashboard.</div>;
  if (loading) return <div style={{padding: "20px", textAlign: "center"}}>Loading Course Content...</div>;
  if (concepts.length === 0) return <div style={{padding: "20px", textAlign: "center"}}>No content available for this track yet.</div>;

  // Safe access to slide content
  const slideContent = currentConcept?.slide || {
    explanation: "Content loading...",
    example: "Please wait...",
    tip: ""
=======
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
  };

  return (
    <div className="learning-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
<<<<<<< HEAD
        <h3>{trackName || "Course Modules"}</h3>
        
        {modules.map((module, mIdx) => (
=======
        <h3>Modules</h3>
        {modulesData.map((module, mIdx) => (
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
          <div key={mIdx} className="module">
            <div className="module-title" style={{ background: module.color }}>
              {module.title}
            </div>
            <ul>
<<<<<<< HEAD
              {module.concepts.map((concept) => {
                const cId = getConceptId(concept);
                const currentId = getConceptId(currentConcept);
                
                const isCurrent = cId === currentId;
                const isDone = understoodIds.includes(cId);

                return (
                    <li
                      key={cId}
                      className={`concept ${isDone ? "done" : ""} ${isCurrent ? "active-concept" : ""}`}
                      // ✅ Use the new robust handler
                      onClick={() => handleSlideClick(concept)}
                      style={{ cursor: 'pointer', fontWeight: isCurrent ? 'bold' : 'normal' }}
                    >
                      {concept.title}
                      {isDone && <FaCheckCircle className="check-icon" />}
                    </li>
                );
              })}
            </ul>
          </div>
        ))}

=======
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
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
        {/* ===== Take Exam Tab ===== */}
        <div className="module">
          <div
            className="module-title"
            style={{ background: '#FECACA', cursor: 'pointer' }}
<<<<<<< HEAD
            onClick={() => navigate('/exam-catalog', { state: { trackId, trackName } })}
=======
            onClick={() => navigate('/exam-catalog', { state: { trackName: 'General Exam' } })}
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
          >
            <b>Take Exam</b>
          </div>
        </div>
<<<<<<< HEAD
        
        <div style={{marginTop: '20px', textAlign: 'center'}}>
            <button onClick={() => navigate('/dashboard')} style={{background:'none', border:'none', color:'#666', textDecoration:'underline', cursor:'pointer'}}>
                Exit to Dashboard
            </button>
        </div>
=======
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
      </aside>

      {/* ===== Main Slide Area ===== */}
      <main className="slide-area">
        <div className="slide-header">
          <h2>
<<<<<<< HEAD
            {currentConcept.title}
            <span className="slide-count">
              ({currentSlideIndex + 1}/{concepts.length})
=======
            {slidesData[currentSlide].title}{" "}
            <span className="slide-count">
              ({currentSlide + 1}/{totalSlides})
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
            </span>
          </h2>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
<<<<<<< HEAD
                width: `${((currentSlideIndex + 1) / concepts.length) * 100}%`,
=======
                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
              }}
            ></div>
          </div>
        </div>

        <div className="slide-body">
<<<<<<< HEAD
          <p className="explanation">{slideContent.explanation}</p>
          
          {slideContent.example && (
             <div className="example-box">
                <strong>Example:</strong> {slideContent.example}
             </div>
          )}
          
          {slideContent.tip && (
              <div className="tip-box">
                <FaLightbulb className="tip-icon" /> {slideContent.tip}
              </div>
          )}
=======
          <p className="explanation">{slidesData[currentSlide].explanation}</p>
          <div className="example-box">
            <strong>Example:</strong> {slidesData[currentSlide].example}
          </div>
          <div className="tip-box">
            <FaLightbulb className="tip-icon" /> {slidesData[currentSlide].tip}
          </div>
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
        </div>

        {/* ===== Bottom Navigation ===== */}
        <div className="slide-footer">
          <button
            className="nav-btn"
            onClick={handlePrev}
<<<<<<< HEAD
            disabled={currentSlideIndex === 0}
=======
            disabled={currentSlide === 0}
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
          >
            <FaArrowLeft /> Previous
          </button>

<<<<<<< HEAD
          <button 
            className={`understood-btn ${understoodIds.includes(getConceptId(currentConcept)) ? 'completed' : ''}`} 
            onClick={handleMarkUnderstood}
            style={{ opacity: understoodIds.includes(getConceptId(currentConcept)) ? 0.6 : 1 }}
          >
            <FaCheckCircle /> 
            {understoodIds.includes(getConceptId(currentConcept)) ? "Understood" : "Mark as Understood"}
=======
          <button className="understood-btn" onClick={handleMarkUnderstood}>
            <FaCheckCircle /> Mark as Understood
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
          </button>

          <button
            className="nav-btn"
            onClick={handleNext}
<<<<<<< HEAD
            disabled={currentSlideIndex === concepts.length - 1}
=======
            disabled={currentSlide === totalSlides - 1}
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
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

<<<<<<< HEAD
export default LearningView;
=======
export default LearningView;
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
