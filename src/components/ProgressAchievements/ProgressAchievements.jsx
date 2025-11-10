import React from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Award, Trophy, Clock, Download } from "lucide-react";
import "./ProgressAchievements.css";

const ProgressAchievements = () => {
  const navigate = useNavigate();
  const percentage = 78;

  // ✅ Modal State & Functions
  const [showDownloadModal, setShowDownloadModal] = React.useState(false);

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    setShowDownloadModal(false);
   
  };

  const achievements = [
    { icon: <Award />, title: "Completed 100 Slides", desc: "You’ve mastered 100 learning slides!" },
    { icon: <Trophy />, title: "Scored 90%+", desc: "High achiever in recent exams." },
  ];

  const history = [
    { activity: "Completed Concept 4", time: "2 days ago" },
    { activity: "Scored 85% in Practice Exam 2", time: "4 days ago" },
    { activity: "Watched Tutorial 3", time: "1 week ago" },
  ];

  return (
    <div className="progress-container">
      <h1 className="progress-title">🏆 Your Progress & Achievements</h1>

      <div className="progress-grid">
        {/* Progress Circle */}
        <div className="progress-card ring-card">
          <h2>Overall Progress</h2>
          <div style={{ width: 160, height: 160 }}>
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                pathColor: "#48BB78",
                textColor: "#2F855A",
                trailColor: "#C6F6D5",
              })}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="progress-card badge-card">
          <h2><Trophy className="icon-yellow" /> Badges</h2>
          <div className="badge-list">
            {achievements.map((a, index) => (
              <div key={index} className="badge-item">
                <div className="badge-icon">{a.icon}</div>
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity History */}
        <div className="progress-card history-card">
          <h2><Clock className="icon-green" /> Recent Activity</h2>
          <ul className="history-list">
            {history.map((item, i) => (
              <li key={i} className="history-item">
                <span>{item.activity}</span>
                <span className="time">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ✅ Updated Download Button */}
      <button className="download-btn" onClick={handleDownload}>
        <Download size={22} /> Download Summary
      </button>

      <button className="back-btn" onClick={() => navigate("/exam-results")}>
        Back to Results
      </button>

      {/* ✅ Modal UI */}
      {showDownloadModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Download Summary?</h2>
            <p>Do you want to download your progress summary?</p>

            <div className="modal-buttons">
              <button className="yes-btn" onClick={confirmDownload}>Yes, Download</button>
              <button className="no-btn" onClick={() => setShowDownloadModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProgressAchievements;
