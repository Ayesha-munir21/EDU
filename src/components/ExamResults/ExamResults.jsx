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

  return (
    <div className="exam-results-container">
      <div className="exam-results-card">
        {/* ===== Header ===== */}
        <div className="results-header">
          <h1>🎯 Exam Results</h1>
          <p>Check your performance and learn from your mistakes.</p>
        </div>

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
            </div>
          ))}
        </div>

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
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
