<<<<<<< HEAD
import React, { useEffect, useState, useContext } from "react";
=======
import React, { useEffect, useContext } from "react";
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
import "./Landing.css";
import { FaGlobe, FaGraduationCap, FaHandsHelping } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

// ✅ AuthContext import
import { AuthContext } from "../../AuthContext";

<<<<<<< HEAD
// Backend URL
export const API_BASE_URL = "https://ceretification-app.onrender.com";

=======
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get user from AuthContext
  const { user } = useContext(AuthContext);

<<<<<<< HEAD
  // State for storing tracks from the backend
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

=======
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

<<<<<<< HEAD
  // Handle scroll from other pages
=======
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
  useEffect(() => {
    if (location.state?.scrollTo === "courses") {
      const section = document.getElementById("courses");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

<<<<<<< HEAD
  // ✅ Fetch Tracks from Backend on Mount
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // Fetching only 'active' tracks
        const response = await fetch(`${API_BASE_URL}/api/tracks?status=active`);
        if (response.ok) {
          const data = await response.json();
          setTracks(data);
        } else {
          console.error("Failed to fetch tracks");
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Helper to handle track navigation
  const handleTrackClick = (trackId) => {
    if (!user) {
      navigate("/auth");
    } else {
      // Navigate to the dynamic track details page
      navigate(`/track/${trackId}`);
    }
  };

=======
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
  return (
    <div className="landing-container">
      {/* ===== Navbar ===== */}
      <nav className="navbar">
        <div className="brand">Edora</div>
        <ul className="nav-links">
          <li onClick={() => scrollToSection("home")}>Home</li>
          <li onClick={() => scrollToSection("tracks")}>Tracks</li>
          <li onClick={() => scrollToSection("pricing")}>Pricing</li>
          <li onClick={() => scrollToSection("how-it-works")}>How It Works</li>
        </ul>
        <div className="navbar-right">
<<<<<<< HEAD
          {/* Hide Sign In/Create Account if user is already logged in */}
          {!user && (
            <>
              <button className="nav-btn" onClick={() => navigate("/auth")}>
                Sign In
              </button>
              <button className="nav-btn filled" onClick={() => navigate("/auth")}>
                Create Account
              </button>
            </>
          )}
          {user && (
             <button className="nav-btn filled" onClick={() => navigate("/dashboard")}>
               Go to Dashboard
             </button>
          )}
=======
          <button className="nav-btn" onClick={() => navigate("/auth")}>
            Sign In
          </button>
          <button className="nav-btn filled" onClick={() => navigate("/auth")}>
            Create Account
          </button>
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section id="home" className="hero">
        <div className="hero-text">
          <h1>Learn. Practice. Get Certified. 🌟</h1>
          <p>
            Master any certification track with tutorials and realistic practice
            exams designed by industry experts.
          </p>
          <div className="hero-buttons">
            <button
              className="landing-primary-btn"
<<<<<<< HEAD
              onClick={() => scrollToSection("tracks")}
            >
              Browse Certifications
            </button>
            <button className="secondary-btn" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
=======
              onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
            >
              Browse Certifications
            </button>
            <button className="secondary-btn" onClick={() => navigate("/auth")}>
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
              Start Learning
            </button>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* ===== Featured Certifications (DYNAMIC) ===== */}
      <section id="tracks" className="section featured">
        <h2 className="section-title">Featured Certifications</h2>
        
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading available courses...</p>
        ) : (
          <div className="course-grid">
            {tracks.length > 0 ? (
              tracks.map((track) => (
                <div className="course-card" key={track.id || track._id}>
                  {/* ✅ DIRECT DATABASE IMAGE + ANTI-BLINK FIX */}
                  <img
                    src={track.cover_image} 
                    alt={track.title}
                    className="course-img"
                    onError={(e) => { 
                      e.target.onerror = null; // 🛑 Stop the loop (Prevents Blinking)
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/2436/2436874.png"; // Generic Fallback
                    }} 
                  />
                  <h4>{track.title}</h4>
                  <p className="level">
                    {track.level ? track.level.charAt(0).toUpperCase() + track.level.slice(1) : "All Levels"}
                  </p>

                  <button
                    className="primary-btn view-btn"
                    onClick={() => handleTrackClick(track.id || track._id)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", width: "100%" }}>No active tracks found right now.</p>
            )}
          </div>
        )}
=======
      {/* ===== Featured Certifications ===== */}
      <section id="tracks" className="section featured">
        <h2 className="section-title">Featured Certifications</h2>
        <div className="course-grid">
          {/* AWS */}
          <div className="course-card">
            <img
              src="https://cdn.worldvectorlogo.com/logos/amazon-web-services-2.svg"
              alt="AWS Cloud Practitioner"
              className="course-img"
            />
            <h4>AWS Cloud Practitioner</h4>
            <p className="level">Beginner</p>
          
        <button
  className="primary-btn view-btn"
  onClick={() => {
    if (!user) {
      // agar user sign in nahi hai
     
      navigate("/auth"); // Sign in page par bhejo
    } else {
      // agar user already sign in hai
      navigate("/track/aws"); // TrackDetails page par bhejo
    }
  }}
>
  View Details
</button>

 </div>

          {/* PMP */}
          <div className="course-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9191/9191048.png"
              alt="PMP Project Management"
              className="course-img"
            />
            <h4>PMP Project Management</h4>
            <p className="level">Intermediate</p>
            
            <button
              className="primary-btn view-btn"
              onClick={() => (user ? navigate("/track/pmp") : navigate("/auth"))}
            >
              View Details
            </button>
          </div>

          {/* Python */}
          <div className="course-card">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
              alt="Python for Developers"
              className="course-img"
            />
            <h4>Python for Developers</h4>
            <p className="level">Beginner</p>
            
            <button
              className="primary-btn view-btn"
              onClick={() => (user ? navigate("/track/python") : navigate("/auth"))}
            >
              View Details
            </button>
          </div>
        </div>
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
      </section>

      {/* ===== How It Works ===== */}
      <section id="how-it-works" className="section how">
        <h2 className="section-title">How It Works</h2>
        <div className="how-grid">
          <div className="how-card">
            <FaGraduationCap className="how-icon" />
            <h4>Learn</h4>
            <p>Bite-sized tutorials and easy-to-understand concepts.</p>
          </div>
          <div className="how-card">
            <FaGlobe className="how-icon" />
            <h4>Practice</h4>
            <p>Take mock exams designed like real certification tests.</p>
          </div>
          <div className="how-card">
            <FaHandsHelping className="how-icon" />
            <h4>Get Certified</h4>
            <p>Track progress and earn completion certificates.</p>
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing" className="section pricing">
        <h2 className="section-title">Pricing Plans</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Basic</h3>
            <p>$29 / month</p>
            <ul>
              <li>Access to all beginner tracks</li>
              <li>Email support</li>
            </ul>
          </div>
          <div className="pricing-card">
            <h3>Pro</h3>
            <p>$59 / month</p>
            <ul>
              <li>Access to all tracks</li>
              <li>Priority support</li>
            </ul>
          </div>
          <div className="pricing-card">
            <h3>Elite</h3>
            <p>$99 / month</p>
            <ul>
              <li>Unlimited access</li>
              <li>1-on-1 mentorship</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="section testimonials">
        <h2 className="section-title">What Our Learners Say</h2>
        <div className="testimonial-grid">
          <blockquote>
            “EduLearn made certifications so simple! Loved the practice exams.”
            <br />
            <span>— Ayesha</span>
          </blockquote>
          <blockquote>
            “Amazing UI and bite-sized lessons — perfect for busy learners!”
            <br />
            <span>— Hassan</span>
          </blockquote>
          <blockquote>
            “I earned my AWS certificate faster than I expected!”
            <br />
            <span>— Uzma</span>
          </blockquote>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <p>Terms | Privacy | Contact</p>
        <p>© 2025 Edora — Learn. Grow. Achieve.</p>
      </footer>
    </div>
  );
};

<<<<<<< HEAD
export default Landing;
=======
export default Landing;
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
