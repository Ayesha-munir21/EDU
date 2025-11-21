import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import "./ExamPlayer.css";

const API_BASE_URL = "https://ceretification-app.onrender.com";

const ExamPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Get exam details from navigation state
  const { examId, trackName, trackId, examTitle } = location.state || {};

  // State Management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [attemptId, setAttemptId] = useState(null);

  // Timer State
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const timerRef = useRef(null);

  // 1. Start Exam Attempt on Mount (Timezone Fix Included)
  useEffect(() => {
    if (!examId || !user) return;

    const startAttempt = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/api/exams/${examId}/attempts`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setAttemptId(data.attemptId);
          setQuestions(data.questions);

          // TIMEZONE FIX: Force UTC Parsing
          if (data.expiresAt) {
            let expiresString = data.expiresAt;
            if (!expiresString.endsWith("Z") && !expiresString.includes("+")) {
              expiresString += "Z";
            }
            const expiresAtMs = new Date(expiresString).getTime();
            setExpiryTimestamp(expiresAtMs);

            const now = Date.now();
            const remaining = Math.floor((expiresAtMs - now) / 1000);
            setTimeLeft(remaining > 0 ? remaining : 0);
          }

        } else {
          alert("Could not start exam.");
          navigate("/exam-catalog", { state: { trackId, trackName } });
        }
      } catch (error) {
        console.error("Error starting exam:", error);
      } finally {
        setLoading(false);
      }
    };

    startAttempt();

    // Cleanup
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examId, user, navigate, trackId, trackName]);

  // 2. Timer Logic
  useEffect(() => {
    if (!expiryTimestamp) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((expiryTimestamp - now) / 1000);

      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(timerRef.current);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [expiryTimestamp]);

  // Helper: Format Time
  const formatTime = (seconds) => {
    if (!seconds || seconds < 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 3. Background Save
  const saveAnswersToBackend = async () => {
    if (!attemptId) return;

    const payload = Object.entries(answers).map(([qId, selectedIds]) => ({
      questionId: qId,
      selectedOptionIds: selectedIds
    }));

    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`${API_BASE_URL}/api/exams/attempts/${attemptId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error("Background save failed", error);
    }
  };

  // Handlers
  const handleOptionSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: [optionId] }));
  };

  const handleNext = () => {
    saveAnswersToBackend();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    saveAnswersToBackend();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleFlag = () => {
    const currentQ = questions[currentQuestionIndex];
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQ.id)) newFlagged.delete(currentQ.id);
    else newFlagged.add(currentQ.id);
    setFlagged(newFlagged);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowModal(false);
    await saveAnswersToBackend();

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/exams/attempts/${attemptId}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/exam-results", { 
            state: { 
                score: data.score, 
                attemptId: attemptId, 
                trackId: trackId,
                trackName: trackName,
                examId: examId,
                // PASS NEXT EXAM DATA
                nextExam: data.nextExam 
            } 
        });
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Network error during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Exam...</div>;
  if (questions.length === 0) return <div style={{padding: '50px', textAlign: 'center'}}>No questions found.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const currentSelected = answers[currentQuestion.id] || [];

  return (
    <>
      <div className="exam-player">
        <div className="top-bar">
          <h2 className="exam-title">{trackName} — {examTitle || `Exam`}</h2>
          
          <div className="timer" style={{ color: timeLeft < 300 ? 'red' : 'inherit', fontWeight: 'bold' }}>
             ⏱ {formatTime(timeLeft)} left
          </div>
          
          <div className="question-counter">Q {currentQuestionIndex + 1}/{questions.length}</div>
          
          <button className="submit-btn" onClick={() => setShowModal(true)} disabled={isSubmitting}>
             {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        <div className="main-body">
          <div className="question-area">
            <h2 className="question-text">{currentQuestion.stem || currentQuestion.question}</h2>

            <div className="options">
              {currentQuestion.options.map((opt, idx) => (
                  <label key={opt.id}>
                      <input 
                        type="radio" 
                        name={`q_${currentQuestion.id}`} 
                        value={opt.id}
                        checked={currentSelected.includes(opt.id)}
                        onChange={() => handleOptionSelect(currentQuestion.id, opt.id)}
                      /> 
                      {opt.text}
                  </label>
              ))}
            </div>

            <div className="controls">
              <button 
                className={`flag-btn ${flagged.has(currentQuestion.id) ? 'active-flag' : ''}`} 
                onClick={toggleFlag}
              >
                {flagged.has(currentQuestion.id) ? "🚩 Flagged" : "🚩 Flag Question"}
              </button>
              
              <div className="nav-buttons">
                <button className="prev-btn" onClick={handlePrev} disabled={currentQuestionIndex === 0}>Previous</button>
                <button className="next-btn" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
              </div>
            </div>
          </div>

          {/* Right: Question Map */}
          <div className="right-panel">
            <h3>Question Map</h3>
            <div className="map-grid">
              {questions.map((q, i) => {
                const isAnswered = answers[q.id] && answers[q.id].length > 0;
                const isFlagged = flagged.has(q.id);
                const isCurrent = i === currentQuestionIndex;
                
                let className = "map-btn";
                if (isCurrent) className += " current";
                else if (isFlagged) className += " flagged";
                else if (isAnswered) className += " answered";

                return (
                    <button 
                        key={q.id} 
                        className={className}
                        onClick={() => { saveAnswersToBackend(); setCurrentQuestionIndex(i); }}
                    >
                        {i + 1}
                    </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Submit Exam?</h2>
            <p>Are you sure you want to submit?</p>
            <div className="modal-buttons">
              <button className="yes-btn" onClick={confirmSubmit} disabled={isSubmitting}>Yes, Submit</button>
              <button className="no-btn" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamPlayer;
