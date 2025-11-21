import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../../AuthContext";

const API_BASE_URL = "https://ceretification-app.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [enrolledTracks, setEnrolledTracks] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== HELPER: Get Reliable Pixel Art Avatar (for Navbar & Welcome) =====
  const getAvatar = () => {
    const name = user?.firstName || "User";
    // Pixel Art style - reliable and tech-themed
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${name}`;
  };

  const handleAvatarError = (e) => {
    // Fallback to generic user icon if API or network fails
    e.target.src = "https://cdn-icons-png.flaticon.com/512/2436/2436874.png"; 
  };

  // ===== 1. FETCH DASHBOARD DATA =====
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/auth");
        return;
      }

      const trackIds = (user.entitlements || [])
        .filter((e) => e.startsWith("track:"))
        .map((e) => e.replace("track:", ""));

      try {
        const trackPromises = trackIds.map(async (trackId) => {
          try {
            const trackRes = await fetch(`${API_BASE_URL}/api/tracks/${trackId}`);
            if (!trackRes.ok) return null;
            const trackData = await trackRes.json();

            const progRes = await fetch(`${API_BASE_URL}/api/progress/${trackId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const progData = progRes.ok ? await progRes.json() : { conceptStatuses: [] };

            const completed = progData.conceptStatuses?.length || 0;
            const total = trackData.concepts_count || 1;
            const rawPercent = (completed / total) * 100;
            const percentage = Math.round(rawPercent > 100 ? 100 : rawPercent);

            return {
              ...trackData,
              id: trackData._id || trackData.id,
              progress: percentage,
            };
          } catch (err) {
            console.error(`Error fetching track ${trackId}:`, err);
            return null;
          }
        });

        const recRes = await fetch(`${API_BASE_URL}/api/tracks?status=active&limit=3`);
        const recData = recRes.ok ? await recRes.json() : [];

        const results = await Promise.all(trackPromises);
        const validEnrolled = results.filter((t) => t !== null);

        setEnrolledTracks(validEnrolled);

        const enrolledIds = new Set(validEnrolled.map((t) => t.id));
        const validRec = recData.filter((t) => !enrolledIds.has(t._id));
        setRecommended(validRec);

      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  // ===== HANDLERS (Omitted for brevity, but exist in full code) =====
  const handleContinueLearning = (track) => {
    navigate("/learning", { state: { trackId: track.id, trackName: track.title } });
  };
  const handleTakeExam = (track) => {
    navigate("/exam-catalog", { state: { trackId: track.id, trackName: track.title } });
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  };
  const handleBrowseMore = () => {
    navigate("/", { state: { scrollTo: "courses" } });
  };

  const lastStudiedTrack = enrolledTracks.find(t => t.progress < 100) || enrolledTracks[0];

  return (
    <div className="dashboard">
      {/* ===== NAVBAR ===== */}
      <header className="navbar">
        <h1 className="logo" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>Edora</h1>
        <nav className="nav-links">
          <span className="active">Dashboard</span>
        </nav>
        <div className="nav-right">
          <button className="browse-btn" onClick={handleBrowseMore}>
            Browse More
          </button>
          <div className="profile-dropdown">
            {/* Small Navbar Avatar */}
            <div className="nav-avatar-container">
                <img 
                    src={getAvatar()} 
                    alt="Profile" 
                    className="nav-avatar-img" 
                    onClick={() => navigate("/profile")} 
                    onError={handleAvatarError}
                />
            </div>
            <div className="dropdown-menu">
              <button onClick={() => navigate("/profile")}>Profile</button>
              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO BANNER ===== */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="welcome-container">
            {/* ✅ RESTORED WELCOME AVATAR */}
            <div className="welcome-avatar-wrapper">
                <img 
                    src={getAvatar()} 
                    alt="Welcome Avatar" 
                    className="welcome-avatar-img"
                    onError={handleAvatarError}
                />
            </div>
            
            <div className="welcome-text">
              <h2>Welcome Back, {user?.firstName || "Learner"}!</h2>
              <p>Your journey to mastery continues — keep learning, keep growing!</p>
            </div>
          </div>
        </div>
        <button className="browse-tracks-btn" onClick={handleBrowseMore}>
          Browse New Tracks
        </button>
      </div>

      {/* ===== MY LEARNING TRACKS (Enrolled) ===== */}
      <section className="learning-tracks">
        <h2 className="section-title">My Learning Tracks</h2>

        {loading ? (
          <p>Loading your progress...</p>
        ) : enrolledTracks.length === 0 ? (
          <div className="empty-state">
            <p>You haven't enrolled in any tracks yet.</p>
            <button className="btn continue" onClick={handleBrowseMore} style={{marginTop: '10px'}}>
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="tracks-grid">
            {enrolledTracks.map((track) => {
              const isCompleted = track.progress >= 100;

              return (
                <div key={track.id} className={`track-card ${isCompleted ? "completed-card" : ""}`}>
                  <div className="track-img-wrapper" style={{position: 'relative', display: 'inline-block'}}>
                    <img
                      src={track.cover_image} 
                      alt={track.title}
                      className="track-icon-img"
                      onError={handleAvatarError} 
                    />
                    
                    {isCompleted && (
                      <div className="completed-badge" style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          background: '#10B981',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '5px',
                          fontSize: '12px',
                          display: 'flex', 
                          alignItems: 'center',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}>
                        <FaCheckCircle size={16} />
                      </div>
                    )}
                  </div>

                  <h3 className="track-title">{track.title}</h3>
                  
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ 
                            width: `${track.progress}%`,
                            backgroundColor: isCompleted ? '#10B981' : '#2563eb' 
                        }}
                      ></div>
                    </div>
                    <span className="progress-text" style={{color: isCompleted ? '#10B981' : '#666'}}>
                        {isCompleted ? "100% Completed" : `${track.progress}% completed`}
                    </span>
                  </div>

                  <div className="track-actions">
                    <button
                      className="btn continue"
                      onClick={() => handleContinueLearning(track)}
                      style={isCompleted ? {backgroundColor: '#059669'} : {}}
                    >
                      {isCompleted ? "Review Course" : "Continue Learning"}
                    </button>
                    
                    <button className="btn exam" onClick={() => handleTakeExam(track)}>
                      Take Exam
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== RECOMMENDED (Available to Enroll) ===== */}
      {recommended.length > 0 && (
        <section className="recommended">
          <div className="section-header-center">
             <h2 className="recommended-badge">Recommended Courses For You</h2>
          </div>

          <div className="rec-grid">
            {recommended.map((rec) => (
              <div key={rec._id} className="rec-card">
                <img
                  src={rec.cover_image}
                  alt={rec.title}
                  className="rec-icon-img"
                  onError={handleAvatarError}
                />
                <h3 className="rec-title">{rec.title}</h3>
                <button
                  className="view-details-btn"
                  onClick={() => navigate(`/track/${rec._id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>Terms | Privacy | Contact</p>
        <p>© 2025 Edora — Learn. Grow. Achieve.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
