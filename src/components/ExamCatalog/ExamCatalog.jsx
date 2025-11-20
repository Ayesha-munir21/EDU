import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaClock, FaClipboardList, FaStar } from "react-icons/fa";
import "./ExamCatalog.css";

const ExamCatalog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackName } = location.state || { trackName: "Sample Track" };

  // Dummy exams
  const exams = [
    {
      id: 1,
      title: `${trackName} Practice Exam 1`,
      duration: "90 minutes",
      questions: 50,
      difficulty: "Medium",
    },
    {
      id: 2,
      title: `${trackName} Practice Exam 2`,
      duration: "60 minutes",
      questions: 40,
      difficulty: "Easy",
    },
    {
      id: 3,
      title: `${trackName} Practice Exam 3`,
      duration: "120 minutes",
      questions: 60,
      difficulty: "Hard",
    },
  ];

  // ✅ Go to ExamPlayer page on Start Exam click
  // ✅ When "Start Exam" is clicked → go to ExamPlayer page
const startExam = (examId) => {
  // navigate directly, state optional
  navigate("/exam-player", {
    state: { examId: examId || 1, trackName: trackName || "Practice Track" },
    replace: false, // ensure proper navigation
  });
};


  return (
    <div className="exam-catalog">
      {/* ===== HEADER BAR ===== */}
      <div className="exam-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
       
      </div>

      {/* ===== PAGE TITLE ===== */}
      <h2 className="section-title">{trackName} - Practice Exams</h2>

      {/* ===== INFO BOX ===== */}
      <div className="exam-info-box">
        <p>🧠 <strong>Note:</strong> These exams mirror the real certification environment.</p>
        <p>✅ Passing Score: <strong>70%</strong> | 💡 You can retake any exam anytime.</p>
        <p>Tip: Stay calm and manage your time — every question counts!</p>
      </div>

      {/* ===== EXAM CARDS ===== */}
      <div className="exam-list">
        {exams.map((exam) => (
          <div key={exam.id} className="exam-card">
            <h3 className="exam-title">{exam.title}</h3>
            <div className="exam-meta">
              <p><FaClock /> Duration: {exam.duration}</p>
              <p><FaClipboardList /> Questions: {exam.questions}</p>
              <p><FaStar /> Difficulty: {exam.difficulty}</p>
            </div>
            <button
              className="start-exam-btn"
              onClick={() => startExam(exam.id)}
            >
              Start Exam
            </button>
          </div>
        ))}
      </div>
      {/* ===== FOOTER ===== */}
      <footer className="exam-footer">
        <p>Terms | Privacy | Contact</p>
        <p>© 2025 EduLearn — Learn. Grow. Achieve.</p>
      </footer>
    </div>
  );
};

export default ExamCatalog;
