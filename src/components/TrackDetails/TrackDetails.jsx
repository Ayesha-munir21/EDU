import React, { useContext, useEffect, useState } from "react";
import { FaCheckCircle, FaBookOpen, FaClipboardList } from "react-icons/fa";
import "./TrackDetails.css";
import { useNavigate, useParams } from "react-router-dom"; 
import { AuthContext } from "../../AuthContext";

export const API_BASE_URL = "https://ceretification-app.onrender.com";
const TrackDetails = () => {
  const { trackId } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  // 1. Fetch Track Details
  useEffect(() => {
    const fetchTrackDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tracks/${trackId}`);
        if (response.ok) {
          const data = await response.json();
          setTrack(data);
        } else {
          console.error("Track not found");
        }
      } catch (error) {
        console.error("Error fetching track details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (trackId) {
      fetchTrackDetails();
    }
  }, [trackId]);

  // 2. Check Entitlement
  const isEnrolled = user?.entitlements?.includes(`track:${trackId}`);

  // 3. Handle Enrollment
  const handleEnroll = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setEnrolling(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/enroll/${trackId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = { 
            ...user, 
            entitlements: [...(user.entitlements || []), data.entitlement] 
        };
        setUser(updatedUser);
        navigate("/success-enroll");
      } else {
        alert("Enrollment failed.");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
    } finally {
      setEnrolling(false);
    }
  };

  // Navigation Handlers
  const goToLearning = () => {
    navigate("/learning", { state: { trackId: track._id || track.id, trackName: track.title } });
  };

  const goToExams = () => {
    navigate("/exam-catalog", { state: { trackId: track._id || track.id, trackName: track.title } });
  };

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;
  if (!track) return <div style={{ padding: "50px", textAlign: "center" }}>Track not found.</div>;

  return (
    <div className="track-details">
      <header className="track-header">
        <div className="track-left">
          <div className="track-title-row">
            <img
              src={track.cover_image}
              alt={track.title}
              className="track-logo"
              onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/2436/2436874.png"; }}
            />
            <div>
              <h1>{track.title}</h1>
              <span className="badge">
                {track.level ? track.level.toUpperCase() : "BEGINNER"} LEVEL
              </span>
            </div>
          </div>

          <p className="summary">
            {track.description || "Master the concepts and prepare for your certification exam."}
          </p>

          <div className="track-actions-left">
            {/* ✅ LOGIC CHANGED HERE */}
            {!isEnrolled ? (
              <button 
                  className="btn enroll-btn" 
                  onClick={handleEnroll} 
                  disabled={enrolling}
              >
                {enrolling ? "Enrolling..." : "Enroll Now"}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* If Enrolled/Completed, show these buttons instead of "Go to Dashboard" */}
                <button 
                  className="btn enroll-btn" 
                  onClick={goToLearning}
                  style={{ backgroundColor: '#10B981', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <FaBookOpen /> Review Slides
                </button>
                
                <button 
                  className="btn enroll-btn" 
                  onClick={goToExams}
                  style={{ backgroundColor: '#F59E0B', color: '#78350f', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <FaClipboardList /> Take Exam
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="tab-content">
        <h3>What You’ll Get</h3>
        <ul className="get-list">
          <li><FaCheckCircle className="check-icon" /> {track.exams_count || 0} Full-Length Practice Exams</li>
          <li><FaCheckCircle className="check-icon" /> {track.concepts_count || 0} Learning Modules</li>
          <li><FaCheckCircle className="check-icon" /> Lifetime Access</li>
        </ul>
      </section>

      <section className="exam-info">
        <h3>Certification Exam Details</h3>
        <div className="info-grid">
          <div className="info-box">
            <h4>Duration</h4>
            <p>{track.duration_hours ? `${track.duration_hours} Hours` : "90 Minutes"}</p>
          </div>
          <div className="info-box">
            <h4>Question Count</h4>
            <p>Multiple-Choice Questions</p>
          </div>
          <div className="info-box">
            <h4>Format</h4>
            <p>Online Proctored</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Terms | Privacy | Contact</p>
        <p>© 2025 Edora</p>
      </footer>
    </div>
  );
};

export default TrackDetails;