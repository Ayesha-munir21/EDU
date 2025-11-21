import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaClock, FaClipboardList, FaStar } from "react-icons/fa";
import { AuthContext } from "../../AuthContext";
import "./ExamCatalog.css";

const API_BASE_URL = "https://ceretification-app.onrender.com"; 

const ExamCatalog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { trackId, trackName } = location.state || {};

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Exams from Backend
  useEffect(() => {
    if (!trackId) {
        setError("Error: No track selected to view exams.");
        setLoading(false);
        return;
    }
    if (!user) {
        navigate("/auth");
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
        } else if (response.status === 403) {
             setError("You must be enrolled in this track to access exams.");
        } else {
            setError("Failed to fetch exams.");
        }
      } catch (err) {
        console.error("Error loading exams:", err);
        setError("Network error loading exams.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [trackId, user, navigate]);

  // Start Exam: Navigate to ExamPlayer page with specific exam ID
  const startExam = (examId, examTitle) => {
    navigate("/exam-player", {
      state: { 
        examId: examId, 
        trackId: trackId,
        trackName: trackName || "Certification Track",
        examTitle: examTitle
      },
      replace: false, 
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

  return (
    <div className="exam-catalog">
      {/* ===== HEADER BAR ===== */}
      <div className="exam-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* ===== PAGE TITLE ===== */}
      <h2 className="section-title">{trackName || "Course"} - Practice Exams</h2>

      {/* ===== INFO BOX ===== */}
      <div className="exam-info-box">
        <p>🧠 <strong>Note:</strong> These exams mirror the real certification environment.</p>
        <p>✅ Passing Score: <strong>70%</strong> | 💡 You can retake any exam anytime.</p>
        <p>Tip: Stay calm and manage your time — every question counts!</p>
      </div>

      {/* ===== EXAM CARDS ===== */}
      <div className="exam-list">
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
                    {/* Difficulty placeholder, often in metadata */}
                    <FaStar /> Difficulty: {exam.metadata?.difficulty || "Medium"}
                </p>
                <p>
                    <FaClipboardList /> Passing Score: {exam.passing_score || 70}%
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
      </footer>
    </div>
  );
};

export default ExamCatalog;
