import React from "react";
import { useNavigate } from "react-router-dom"; // <-- add
import "./Dashboard.css";
import { FaUserCircle } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate(); // <-- add

  const myTracks = [
    {
      id: 1,
      title: "Web Development",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      progress: 82,
    },
    {
      id: 2,
      title: "Python Programming",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      progress: 58,
    },
    {
      id: 3,
      title: "AWS Cloud Essentials",
      icon: "https://cdn.worldvectorlogo.com/logos/amazon-web-services-2.svg",
      progress: 41,
    },
  ];

  const lastStudied = {
    module: "Module 5 — Python Loops",
    course: "Python Programming",
  };

  const recommended = [
    {
      id: 4,
      title: "AI & Deep Learning",
      icon: "https://cdn-icons-png.flaticon.com/512/9191/9191048.png",
    },
    {
      id: 5,
      title: "Database Management",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    },
  ];

  // ===== BUTTON HANDLERS =====
  const handleContinueLearning = (track) => {
    navigate("/learning", { state: { trackId: track.id, trackName: track.title } });
  };

  const handleTakeExam = (track) => {
    navigate("/exam-catalog", { state: { trackId: track.id, trackName: track.title } });
  };
  const handleLogout = () => {
  // agar localStorage/session me user data save ha to remove krdo
  localStorage.clear();
  sessionStorage.clear();

  // navigate to landing page (home)
  navigate("/");
};
 const handleBrowseMore = () => {
  navigate("/", { state: { scrollTo: "courses" } }); // landing page + scroll target
};

const handleBrowseNewTracks = () => {
  navigate("/", { state: { scrollTo: "courses" } }); // same scroll
};


  return (
    <div className="dashboard">
      {/* ===== NAVBAR (Only EduLearn, Dashboard, Browse More, Profile) ===== */}
      <header className="navbar">
        <h1 className="logo">Edora</h1>
        <nav className="nav-links">
          <a href="/" className="active">Dashboard</a>
        </nav>
        <div className="nav-right">
          <button className="browse-btn" onClick={handleBrowseMore}>Browse More</button>
          <div className="profile-dropdown">
            <FaUserCircle className="profile-icon" />
            <div className="dropdown-menu">
              <a href="/profile">Profile</a>
             
              <button className="logout" onClick={handleLogout}>Logout</button>

            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO BANNER ===== */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Welcome Back, Learner!</h2>
          <p>Your journey to mastery continues — keep learning, keep growing!</p>
        </div>
        <button className="browse-tracks-btn" onClick={handleBrowseNewTracks}>Browse New Tracks</button>

      </div>

      {/* ===== MY LEARNING TRACKS ===== */}
      <section className="learning-tracks">
        <h2 className="section-title">My Learning Tracks</h2>
        <div className="tracks-grid">
          {myTracks.map((track) => (
            <div key={track.id} className="track-card">
              <img src={track.icon} alt={track.title} className="track-icon-img" />
              <h3 className="track-title">{track.title}</h3>
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${track.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{track.progress}% completed</span>
              </div>
              <div className="track-actions">
                {/* ===== ADD NAVIGATION ===== */}
                <button className="btn continue" onClick={() => handleContinueLearning(track)}>
                  Continue Learning
                </button>
                <button className="btn exam" onClick={() => handleTakeExam(track)}>
                  Take Exam
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CONTINUE LEARNING ===== */}
      <div className="continue-section">
        <div className="continue-card">
          <div className="continue-text">
            <h3>Continue Learning</h3>
            <p>You last studied: <strong>{lastStudied.module}</strong></p>
          </div>
          <button className="resume-btn" onClick={() => handleContinueLearning({ id: 2, title: "Python Programming" })}>
            Resume Course
          </button>
        </div>
      </div>

      {/* ===== RECOMMENDED (Small Button) ===== */}
      <section className="recommended">
        <h2 className="section-title">Recommended For You</h2>
        <div className="rec-grid">
          {recommended.map((rec) => (
            <div key={rec.id} className="rec-card">
              <img src={rec.icon} alt={rec.title} className="rec-icon-img" />
              <h3 className="rec-title">{rec.title}</h3>
               <button
      className="view-details-btn"
      onClick={() => navigate(`/track/${rec.id}`)}
    >
      View Details
    </button>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>Terms | Privacy | Contact</p>
        <p>© 2025 Edora — Learn. Grow. Achieve.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
