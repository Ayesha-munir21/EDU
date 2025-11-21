<<<<<<< HEAD
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { FaArrowRight, FaRedo, FaTrophy } from "react-icons/fa"; 
import "./ExamResults.css";

export const API_BASE_URL = "https://ceretification-app.onrender.com";
const ExamResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Get data passed from ExamPlayer
  const { attemptId, trackId, trackName, nextExam } = location.state || {};

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Results from Backend
  useEffect(() => {
    if (!attemptId) {
      setError("No result data found. Please retake the exam.");
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/api/exams/attempts/${attemptId}/review`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setError("Failed to calculate results.");
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("An error occurred while loading results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId]);

  // --- Helpers to convert IDs back to Text ---
  const getAnswerText = (options, selectedIds) => {
    if (!selectedIds || selectedIds.length === 0) return "Skipped";
    if (!options) return "Unknown";

    const normalizedOptions = options.map((opt, idx) => {
      if (typeof opt === 'string') return { id: String(idx), text: opt };
      return { id: String(opt.id || opt._id || idx), text: opt.text || opt.value };
    });

    const texts = selectedIds.map(id => {
        const match = normalizedOptions.find(o => String(o.id) === String(id));
        return match ? match.text : "Unknown Option";
    });

    return texts.join(", ");
  };
  
  const getCorrectAnswerText = (options, correctIds) => {
    if (!correctIds || !correctIds.length) return "N/A";
    
    const normalizedOptions = options.map((opt, idx) => {
      if (typeof opt === 'string') return { id: String(idx), text: opt };
      return { id: String(opt.id || opt._id || idx), text: opt.text || opt.value };
    });

    const texts = correctIds.map(id => {
        const match = normalizedOptions.find(o => String(o.id) === String(id));
        return match ? match.text : id;
    });

    return texts.join(", ");
  };

  if (loading) return <div className="exam-results-container"><div className="exam-results-card"><h2>Calculating Score...</h2></div></div>;
  
  if (error) return (
    <div className="exam-results-container">
        <div className="exam-results-card">
            <h2>Error</h2>
            <p>{error}</p>
            <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
    </div>
  );

  if (!results) return null;

  const { score, correctCount, totalQuestions, reviewDetails } = results;
  const status = score >= 70 ? "Passed 🎉" : "Needs Improvement 💪";
=======
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ExamResults.css";

const ExamResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, timeTaken } = location.state || { score: 75, timeTaken: "1h 05m" };

  const status = score >= 60 ? "Passed 🎉" : "Needs Improvement 💪";

  // Example questions
  const questions = [
    {
      id: 1,
      question: "What does HTML stand for?",
      yourAnswer: "Hyper Text Makeup Language",
      correctAnswer: "HyperText Markup Language",
      explanation: "HTML defines the structure of web pages using markup elements.",
      isCorrect: false,
    },
    {
      id: 2,
      question: "Which CSS property controls text size?",
      yourAnswer: "font-size",
      correctAnswer: "font-size",
      explanation: "The 'font-size' property defines the size of the text in CSS.",
      isCorrect: true,
    },
    {
      id: 3,
      question: "What is the correct syntax to include JavaScript in HTML?",
      yourAnswer: "<script src='app.js'></script>",
      correctAnswer: "<script src='app.js'></script>",
      explanation: "The script tag is used to include JavaScript files in HTML.",
      isCorrect: true,
    },
  ];
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a

  return (
    <div className="exam-results-container">
      <div className="exam-results-card">
<<<<<<< HEAD
        {/* Header */}
=======
        {/* ===== Header ===== */}
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
        <div className="results-header">
          <h1>🎯 Exam Results</h1>
          <p>Check your performance and learn from your mistakes.</p>
        </div>

<<<<<<< HEAD
        {/* Summary */}
        <div className="summary">
          <div className="summary-box"><h3>Score</h3><p className="score">{score}%</p></div>
          <div className="summary-box"><h3>Status</h3><p className={`status ${score >= 70 ? "passed" : "failed"}`}>{status}</p></div>
          <div className="summary-box"><h3>Result</h3><p className="time">{correctCount} / {totalQuestions} Correct</p></div>
        </div>

        {/* Questions Review */}
        <div className="questions-section">
          <h2>🧠 Question Review</h2>

          {reviewDetails.map((q, index) => (
            <div key={index} className="question-card">
              <h3>{index + 1}. {q.stem}</h3>
              
              <p>
                <strong>Your Answer:</strong>{" "}
                <span className={q.isCorrect ? "correct" : "wrong"}>
                  {getAnswerText(q.options, q.userSelected)} {q.isCorrect ? "✅" : "❌"}
                </span>
              </p>
              
              {!q.isCorrect && (
                <p>
                  <strong>Correct Answer:</strong>{" "}
                  <span className="correct">
                    {getCorrectAnswerText(q.options, q.correctAnswers)}
                  </span>
                </p>
              )}

              {q.explanation && (
                <div className="explanation">
                  <strong>💡 Explanation:</strong> {q.explanation}
                </div>
              )}
=======
        {/* ===== Summary ===== */}
        <div className="summary">
          <div className="summary-box">
            <h3>Score</h3>
            <p className="score">{score}%</p>
          </div>
          <div className="summary-box">
            <h3>Status</h3>
            <p className={`status ${score >= 60 ? "passed" : "failed"}`}>{status}</p>
          </div>
          <div className="summary-box">
            <h3>Time Taken</h3>
            <p className="time">{timeTaken}</p>
          </div>
        </div>

        {/* ===== Questions Review ===== */}
        <div className="questions-section">
          <h2>🧠 Question Review</h2>

          {questions.map((q) => (
            <div key={q.id} className="question-card">
              <h3>{q.id}. {q.question}</h3>
              <p>
                <strong>Your Answer:</strong>{" "}
                <span className={q.isCorrect ? "correct" : "wrong"}>
                  {q.yourAnswer} {q.isCorrect ? "✅" : "❌"}
                </span>
              </p>
              <p>
                <strong>Correct Answer:</strong>{" "}
                <span className="correct">{q.correctAnswer}</span>
              </p>
              <div className="explanation">
                <strong>💡 Explanation:</strong> {q.explanation}
              </div>
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
            </div>
          ))}
        </div>

<<<<<<< HEAD
        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="retake-btn" 
            onClick={() => navigate("/exam-catalog", { state: { trackId, trackName } })}
          >
            <FaRedo style={{marginRight:'8px'}}/> Retake
          </button>
          
          {/* ✅ VIEW PROGRESS BUTTON */}
          <button 
            className="progress-btn" 
            onClick={() => navigate("/progress")}
            style={{
                backgroundColor: '#3B82F6', 
                color: 'white', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '8px', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px'
            }}
          >
            <FaTrophy /> View Progress
          </button>

          {/* ✅ NEXT EXAM BUTTON (Conditional) */}
          {nextExam && (
             <button 
                className="next-exam-btn"
                style={{
                    backgroundColor: '#10B981', 
                    color: 'white', 
                    border: 'none', 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px'
                }}
                onClick={() => navigate("/exam-player", { 
                    state: { 
                        examId: nextExam.id, 
                        trackId, 
                        trackName, 
                        examTitle: nextExam.title 
                    } 
                })}
             >
                Start {nextExam.title} <FaArrowRight />
             </button>
          )}
          
          <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
            Dashboard
=======
        {/* ===== Buttons ===== */}
        <div className="action-buttons">
          <button className="retake-btn" onClick={() => navigate("/exam-player")}>
            Retake Exam
          </button>
          <button onClick={() => navigate("/progress")} className="view-progress-btn">
    🏅 View My Progress
  </button>
          <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
            Return to Dashboard
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
          </button>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ExamResults;
=======
export default ExamResults;
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
