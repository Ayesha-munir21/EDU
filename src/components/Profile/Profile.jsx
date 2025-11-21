import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import "./Profile.css";
import { FaTrophy, FaBookOpen, FaHistory, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8000";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for Real History Data
  const [courseHistory, setCourseHistory] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  const [stats, setStats] = useState({
    completedCourses: 0,
    totalExams: 0,
    averageScore: 0
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // 1. Fetch Latest User Data & History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
          navigate("/login");
          return;
      }

      try {
        // A. FORCE FETCH LATEST USER DATA (Fixes the "0 Enrolled" issue)
        const meRes = await fetch(`${API_BASE_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!meRes.ok) throw new Error("Failed to refresh user data");
        
        const freshUser = await meRes.json();
        // Update Context with fresh data
        setUser(freshUser); 
        
        // Update local profile form
        setProfileData({
            firstName: freshUser.firstName || "",
            lastName: freshUser.lastName || "",
            email: freshUser.email || "",
        });

        // B. Get Track IDs from the FRESH user object
        const trackIds = (freshUser.entitlements || [])
            .filter(e => e.startsWith("track:"))
            .map(e => e.replace("track:", ""));

        // If no enrollments, stop here
        if (trackIds.length === 0) {
            setLoading(false);
            return;
        }

        const courses = [];
        const exams = [];
        let completedCount = 0;
        let totalScore = 0;
        let scoreCount = 0;

        // C. Fetch Details for each track
        await Promise.all(trackIds.map(async (trackId) => {
            // Get Track Info
            const trackRes = await fetch(`${API_BASE_URL}/api/tracks/${trackId}`);
            const trackData = trackRes.ok ? await trackRes.json() : null;

            // Get Progress
            const progRes = await fetch(`${API_BASE_URL}/api/progress/${trackId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const progData = progRes.ok ? await progRes.json() : null;

            if (trackData && progData) {
                // --- Course Calculation ---
                const done = progData.conceptStatuses?.length || 0;
                const total = trackData.concepts_count || 1;
                const pct = Math.round((done / total) * 100);
                const finalPct = pct > 100 ? 100 : pct;
                
                if (finalPct === 100) completedCount++;

                courses.push({
                    id: trackData._id || trackData.id,
                    title: trackData.title,
                    progress: finalPct,
                    status: finalPct === 100 ? "Completed" : "In Progress"
                });

                // --- Exam Calculation ---
                if (progData.examStats) {
                    progData.examStats.forEach(stat => {
                        scoreCount++;
                        totalScore += stat.bestScore;
                        
                        exams.push({
                           id: stat.examId, 
                           trackTitle: trackData.title,
                           score: stat.bestScore,
                           attempts: stat.attempts,
                           passed: stat.bestScore >= 70
                        });
                    });
                }
            }
        }));

        setCourseHistory(courses);
        setExamHistory(exams);
        setStats({
            completedCourses: completedCount,
            totalExams: exams.length,
            averageScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0
        });

      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate, setUser]); // Depend on setUser to update context


  // Handlers
  const handleEditToggle = () => setIsEditing(!isEditing);
  
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile update saved locally (Backend update not implemented yet).");
  };

  const handleDeleteAccount = async () => {
    if(!window.confirm("Are you sure? This cannot be undone.")) return;
    // ... existing delete logic ...
  };

  if (!user) return <div className="profile-wrapper"><p>Loading Profile...</p></div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1 className="profile-title">👤 My Profile & History</h1>

        {/* ===== User Card ===== */}
        <div className="profile-card">
          <div className="profile-header">
             <img
                src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
                alt="User Avatar"
                className="profile-avatar"
             />
             <div className="profile-info">
                {!isEditing ? (
                    <>
                    <h2>{profileData.firstName} {profileData.lastName}</h2>
                    <p>{profileData.email}</p>
                    </>
                ) : (
                    <div className="edit-inputs">
                        <input name="firstName" value={profileData.firstName} onChange={handleChange} placeholder="First Name"/>
                        <input name="lastName" value={profileData.lastName} onChange={handleChange} placeholder="Last Name"/>
                    </div>
                )}
             </div>
             <button className="edit-btn" onClick={!isEditing ? handleEditToggle : handleSave}>
                {isEditing ? "💾 Save" : "✏️ Edit"}
             </button>
          </div>

          {/* ===== Stats Row ===== */}
          <div className="stats-grid">
             <div className="stat-box">
                <FaCheckCircle className="icon-green"/>
                <h3>{stats.completedCourses}</h3>
                <p>Courses Completed</p>
             </div>
             <div className="stat-box">
                <FaBookOpen className="icon-blue"/>
                {/* Use courseHistory.length directly for the enrolled count */}
                <h3>{courseHistory.length}</h3>
                <p>Enrolled</p>
             </div>
             <div className="stat-box">
                <FaTrophy className="icon-yellow"/>
                <h3>{stats.averageScore}%</h3>
                <p>Avg. Score</p>
             </div>
          </div>
        </div>

        {/* ===== Course History Table ===== */}
        <div className="history-section">
            <h2><FaBookOpen /> Course History</h2>
            {loading ? <p>Loading...</p> : courseHistory.length === 0 ? (
                <div style={{padding: '10px', color: '#666', background: '#f9fafb', borderRadius: '8px'}}>
                    You haven't enrolled in any courses yet. <a href="/dashboard" style={{color: '#10B981'}}>Go to Dashboard</a>
                </div>
            ) : (
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Progress</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseHistory.map((c, i) => (
                            <tr key={i}>
                                <td>{c.title}</td>
                                <td>
                                    <div className="mini-progress-bar">
                                        <div className="mini-fill" style={{width: `${c.progress}%`, background: c.progress===100 ? '#10B981':'#3B82F6'}}></div>
                                    </div>
                                    <span className="mini-text">{c.progress}%</span>
                                </td>
                                <td>
                                    <span className={`status-badge ${c.status === 'Completed' ? 'success' : 'pending'}`}>
                                        {c.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        {/* ===== Exam History Table ===== */}
        <div className="history-section">
            <h2><FaHistory /> Exam Performance</h2>
            {loading ? <p>Loading...</p> : examHistory.length === 0 ? <p>No exams taken yet.</p> : (
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Track / Exam</th>
                            <th>Attempts</th>
                            <th>Best Score</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examHistory.map((e, i) => (
                            <tr key={i}>
                                <td>{e.trackTitle}</td>
                                <td>{e.attempts}</td>
                                <td style={{fontWeight: 'bold'}}>{e.score}%</td>
                                <td>
                                    {e.passed ? (
                                        <span className="status-badge success"><FaCheckCircle/> Passed</span>
                                    ) : (
                                        <span className="status-badge fail"><FaTimesCircle/> Failed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        {/* Delete Account */}
        <div style={{marginTop: '40px', textAlign: 'center'}}>
             <button className="delete-btn-text" onClick={handleDeleteAccount} style={{background:'none', border:'none', color:'red', cursor:'pointer', textDecoration:'underline'}}>
                Delete My Account
             </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;