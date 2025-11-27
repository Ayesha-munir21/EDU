import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import "./Profile.css";
import { FaTrophy, FaBookOpen, FaHistory, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const API_BASE_URL = "https://ceretification-app.onrender.com"; 

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [courseHistory, setCourseHistory] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  
  // Stats State
  const [stats, setStats] = useState({
    completedCourses: 0,
    enrolledCourses: 0,
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
    if (user) {
        setProfileData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
        });
    }

    const fetchHistory = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
          navigate("/auth"); // Redirect if not logged in
          return;
      }

      try {
        // A. FORCE FETCH LATEST USER DATA (Sync Enrolled Count)
        const meRes = await fetch(`${API_BASE_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!meRes.ok) throw new Error("Failed to refresh user data");
        
        const freshUser = await meRes.json();
        setUser(freshUser); 
        
        // Update local form data
        setProfileData({
            firstName: freshUser.firstName || "",
            lastName: freshUser.lastName || "",
            email: freshUser.email || "",
        });

        // B. Get Track IDs from fresh user data
        const trackIds = (freshUser.entitlements || [])
            .filter(e => e.startsWith("track:"))
            .map(e => e.replace("track:", ""));

        if (trackIds.length === 0) {
            setLoading(false);
            // Set stats to 0 if no tracks
            setStats({ completedCourses: 0, enrolledCourses: 0, totalExams: 0, averageScore: 0 });
            return;
        }

        const courses = [];
        const exams = [];
        let completedCount = 0;
        let totalScore = 0;
        let scoreCount = 0;

        // C. Fetch Details for each track
        await Promise.all(trackIds.map(async (trackId) => {
            try {
                // Fetch Track Info
                const trackRes = await fetch(`${API_BASE_URL}/api/tracks/${trackId}`);
                const trackData = trackRes.ok ? await trackRes.json() : null;

                // Fetch Progress
                const progRes = await fetch(`${API_BASE_URL}/api/progress/${trackId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const progData = progRes.ok ? await progRes.json() : { conceptStatuses: [], examStats: [] };

                if (trackData) {
                    // --- LOGIC: Calculate Real Progress (Slides + Exams) ---
                    const totalSlides = trackData.concepts_count || 0;
                    const totalExams = trackData.exams_count || 0;
                    const totalItems = totalSlides + totalExams;

                    const doneSlides = (progData.conceptStatuses || []).filter(s => s.status === 'understood').length;
                    const passedExams = (progData.examStats || []).filter(s => s.bestScore >= 70).length;
                    
                    const totalDone = doneSlides + passedExams;

                    let pct = 0;
                    if (totalItems > 0) {
                        pct = Math.round((totalDone / totalItems) * 100);
                    }
                    if (pct > 100) pct = 100;
                    
                    // Increment Completed Course Count if 100%
                    if (pct === 100) completedCount++;

                    courses.push({
                        id: trackData._id || trackData.id,
                        title: trackData.title,
                        progress: pct,
                        status: pct === 100 ? "Completed" : "In Progress"
                    });

                    // --- Process Exams for History Table ---
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
            } catch (e) {
                console.error("Error fetching track:", e);
            }
        }));

        // Update State with Real Data
        setCourseHistory(courses);
        setExamHistory(exams);
        
        setStats({
            completedCourses: completedCount,
            enrolledCourses: trackIds.length, // Accurate count from DB
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
  }, [navigate, setUser]); // Removed user dependency to prevent loops, uses internal check


  // Handlers
  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handleSave = () => { setIsEditing(false); alert("Profile updated locally (Backend sync pending)."); };
  const handleDeleteAccount = async () => { if(window.confirm("Are you sure? This cannot be undone.")) return; };

  if (!user) return <div className="profile-wrapper"><p>Loading Profile...</p></div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1 className="profile-title highlight">
          <span role="img" aria-label="avatar" style={{marginRight: '8px', verticalAlign: 'middle'}}>👤</span> My Profile & History
        </h1>
        <div className="profile-card">
          <div className="profile-header-row">
            <div className="profile-avatar-box">
              <img
                src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
                alt="User Avatar"
                className="profile-avatar"
              />
            </div>
            <div className="profile-name-editrow">
              {!isEditing ? (
                  <>
                    <h2 style={{margin:0, fontSize:'1.5rem', color:'#14532d'}}>{profileData.firstName} {profileData.lastName}</h2>
                  </>
              ) : (
                  <>
                    <input name="firstName" value={profileData.firstName} onChange={handleChange} placeholder="First Name" className="profile-name-input"/>
                    <input name="lastName" value={profileData.lastName} onChange={handleChange} placeholder="Last Name" className="profile-name-input"/>
                  </>
              )}
              <button className="save-btn sticky-save" onClick={!isEditing ? handleEditToggle : handleSave}>
                {isEditing ? "💾 Save" : "✏️ Edit"}
              </button>
            </div>
          </div>
          <div className="profile-email"><p>{profileData.email}</p></div>
          
          {/* ===== Stats Row (Values now sync with DB) ===== */}
          <div className="stats-grid">
            <div className="stat-box">
              <FaCheckCircle className="icon-green" />
              <h3>{stats.completedCourses}</h3>
              <p>Courses Completed</p>
            </div>
            <div className="stat-box">
              <FaBookOpen className="icon-blue" />
              <h3>{stats.enrolledCourses}</h3>
              <p>Enrolled</p>
            </div>
            <div className="stat-box">
              <FaTrophy className="icon-yellow" />
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
                      <span className={`status-badge ${c.status === 'Completed' ? 'success' : 'pending'}`}>{c.status}</span>
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
                    <td>{e.passed ? (<span className="status-badge success"><FaCheckCircle/> Passed</span>) : (<span className="status-badge fail"><FaTimesCircle/> Failed</span>)}</td>
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
