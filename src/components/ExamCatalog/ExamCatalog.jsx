<<<<<<< HEAD
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaClock, FaClipboardList, FaStar } from "react-icons/fa";
import "./ExamCatalog.css";
import { AuthContext } from "../../AuthContext";

export const API_BASE_URL = "https://ceretification-app.onrender.com";
=======
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaClock, FaClipboardList, FaStar } from "react-icons/fa";
import "./ExamCatalog.css";
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a

const ExamCatalog = () => {
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { user } = useContext(AuthContext);

  // Get track info passed from Dashboard/LearningView
  const { trackId, trackName } = location.state || {};

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Exams from Backend
  useEffect(() => {
    // If we don't have a trackId (e.g. page refresh), redirect to dashboard
    if (!trackId) {
        // You might want to handle this more gracefully, but for now:
        // navigate("/dashboard"); 
        // We'll just show an error to avoid infinite redirect loops during dev
        setError("No track selected.");
        setLoading(false);
        return;
    }

    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/api/tracks/${trackId}/exams`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setExams(data);
        } else {
            setError("Failed to fetch exams. You might not be enrolled in this track.");
        }
      } catch (err) {
        console.error("Error loading exams:", err);
        setError("Network error loading exams.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchExams();
    }
  }, [trackId, user, navigate]);

  // ✅ Start Exam: Navigate to ExamPlayer
  const startExam = (examId, examTitle) => {
    navigate("/exam-player", {
      state: { 
        examId: examId, 
        trackId: trackId,
        trackName: trackName || "Certification Track",
        examTitle: examTitle
      },
    });
  };

  if (loading) return <div className="exam-catalog" style={{textAlign: 'center', padding: '50px'}}>Loading Exams...</div>;
  
  if (error) return (
    <div className="exam-catalog">
        <div className="exam-header">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
             <FaArrowLeft /> Back to Dashboard
            </button>
        </div>
        <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>
            <h3>{error}</h3>
        </div>
    </div>
  );
=======
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

>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a

  return (
    <div className="exam-catalog">
      {/* ===== HEADER BAR ===== */}
      <div className="exam-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
<<<<<<< HEAD
      </div>

      {/* ===== PAGE TITLE ===== */}
      <h2 className="section-title">{trackName || "Course"} - Practice Exams</h2>
=======
       
      </div>

      {/* ===== PAGE TITLE ===== */}
      <h2 className="section-title">{trackName} - Practice Exams</h2>
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a

      {/* ===== INFO BOX ===== */}
      <div className="exam-info-box">
        <p>🧠 <strong>Note:</strong> These exams mirror the real certification environment.</p>
        <p>✅ Passing Score: <strong>70%</strong> | 💡 You can retake any exam anytime.</p>
        <p>Tip: Stay calm and manage your time — every question counts!</p>
      </div>

      {/* ===== EXAM CARDS ===== */}
      <div className="exam-list">
<<<<<<< HEAD
        {exams.length === 0 ? (
            <div style={{textAlign: "center", width: "100%", padding: "20px"}}>
                No exams available for this track yet. Check back later!
            </div>
        ) : (
            exams.map((exam) => (
            <div key={exam.id} className="exam-card">
                <h3 className="exam-title">{exam.title}</h3>
                <div className="exam-meta">
                <p>
                    <FaClock /> Duration: {exam.time_limit_minutes || 90} mins
                </p>
                <p>
                    <FaClipboardList /> Questions: {exam.question_count || 0}
                </p>
                <p>
                    <FaStar /> Difficulty: {exam.metadata?.difficulty || "Medium"}
                </p>
                </div>
                <button
                className="start-exam-btn"
                onClick={() => startExam(exam.id, exam.title)}
                >
                Start Exam
                </button>
            </div>
            ))
        )}
      </div>
      
      {/* ===== FOOTER ===== */}
      <footer className="exam-footer">
        <p>Terms | Privacy | Contact</p>
        <p>© 2025 Edora — Learn. Grow. Achieve.</p>
=======
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
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
      </footer>
    </div>
  );
};

<<<<<<< HEAD
export default ExamCatalog;
=======
export default ExamCatalog;
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
