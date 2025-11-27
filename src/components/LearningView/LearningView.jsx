import React, { useState, useEffect, useContext } from "react";
import "./LearningView.css";
import {
  FaCheckCircle,
  FaLightbulb,
  FaArrowLeft,
  FaArrowRight,
  FaFlag,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import ReactMarkdown from "react-markdown"; // ✅ Import Markdown Renderer

const API_BASE_URL = "https://ceretification-app.onrender.com"; 

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

  // Helper: Get robust ID (handles _id vs id)
  const getConceptId = (c) => c.id || c._id;
  const currentConcept = concepts[currentSlideIndex];

  // ===== 1. FETCH DATA =====
  useEffect(() => {
    if (!trackId || !user) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // A. Fetch Concepts (Full content)
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

        const moduleList = Object.keys(grouped).map((key, idx) => ({
            title: key === "General" ? "Core Concepts" : `Module ${idx + 1}`,
            color: idx % 2 === 0 ? "#A7F3D0" : "#FDE68A",
            concepts: grouped[key]
        }));
        setModules(moduleList);

        // C. Fetch User Progress
        const progRes = await fetch(`${API_BASE_URL}/api/progress/${trackId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        if (progRes.ok) {
            const progData = await progRes.json();
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


  // ===== HANDLERS =====
  
  // Robust Click Handler for sidebar
  const handleSlideClick = (clickedConcept) => {
    const clickedId = getConceptId(clickedConcept);
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

  const slideContent = currentConcept?.slide || {
    explanation: "Content loading...",
    example: "Please wait...",
    tip: ""
  };

  // Ensure newlines are respected
  const cleanExplanation = slideContent.explanation ? slideContent.explanation.replace(/\\n/g, '\n') : "";
  const cleanExample = slideContent.example ? slideContent.example.replace(/\\n/g, '\n') : "";
  const cleanTip = slideContent.tip ? slideContent.tip.replace(/\\n/g, '\n') : "";

  return (
    <div className="learning-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <h3>{trackName || "Course Modules"}</h3>
        
        {modules.map((module, mIdx) => (
          <div key={mIdx} className="module">
            <div className="module-title" style={{ background: module.color }}>
              {module.title}
            </div>
            <ul>
              {module.concepts.map((concept) => {
                const cId = getConceptId(concept);
                const currentId = getConceptId(currentConcept);
                
                const isCurrent = cId === currentId;
                const isDone = understoodIds.includes(cId);

                return (
                    <li
                      key={cId}
                      className={`concept ${isDone ? "done" : ""} ${isCurrent ? "active-concept" : ""}`}
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

        <div className="module">
          <div
            className="module-title"
            style={{ background: '#FECACA', cursor: 'pointer' }}
            onClick={() => navigate('/exam-catalog', { state: { trackId, trackName } })}
          >
            <b>Take Exam</b>
          </div>
        </div>
        
        <div style={{marginTop: '20px', textAlign: 'center'}}>
            <button onClick={() => navigate('/dashboard')} style={{background:'none', border:'none', color:'#666', textDecoration:'underline', cursor:'pointer'}}>
                Exit to Dashboard
            </button>
        </div>
      </aside>

      {/* ===== Main Slide Area ===== */}
      <main className="slide-area">
        <div className="slide-header">
          <h2>
            {currentConcept.title}
            <span className="slide-count">
              ({currentSlideIndex + 1}/{concepts.length})
            </span>
          </h2>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentSlideIndex + 1) / concepts.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="slide-body">
          {/* ✅ UPDATED: Using ReactMarkdown for proper formatting */}
          <div className="explanation markdown-content">
            <ReactMarkdown>{cleanExplanation}</ReactMarkdown>
          </div>
          
          {cleanExample && (
             <div className="example-box">
                <strong>Example:</strong>
                <div className="markdown-content" style={{marginTop:'5px'}}>
                   <ReactMarkdown>{cleanExample}</ReactMarkdown>
                </div>
             </div>
          )}
          
          {cleanTip && (
              <div className="tip-box">
                <FaLightbulb className="tip-icon" /> 
                <div className="markdown-content">
                   <ReactMarkdown>{cleanTip}</ReactMarkdown>
                </div>
              </div>
          )}
        </div>

        <div className="slide-footer">
          <button
            className="nav-btn"
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
          >
            <FaArrowLeft /> Previous
          </button>

          <button 
            className={`understood-btn ${understoodIds.includes(getConceptId(currentConcept)) ? 'completed' : ''}`} 
            onClick={handleMarkUnderstood}
            style={{ opacity: understoodIds.includes(getConceptId(currentConcept)) ? 0.6 : 1 }}
          >
            <FaCheckCircle /> 
            {understoodIds.includes(getConceptId(currentConcept)) ? "Understood" : "Mark as Understood"}
          </button>

          <button
            className="nav-btn"
            onClick={handleNext}
            disabled={currentSlideIndex === concepts.length - 1}
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
