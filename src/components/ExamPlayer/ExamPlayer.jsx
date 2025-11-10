import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ExamPlayer.css";

const ExamPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, trackName } = location.state || { examId: 1, trackName: "Sample Track" };

  // ===== Modal state + handlers (add here) =====
  const [showModal, setShowModal] = React.useState(false);

  const handleSubmit = () => {
    setShowModal(true);
  };

  const confirmSubmit = () => {
    setShowModal(false);
    navigate("/exam-results", { state: { score: 78, timeTaken: "1h 15m" } });
  };
  // ==============================================

  return (
    <>
      <div className="exam-player">
        {/* ===== Top Bar ===== */}
        <div className="top-bar">
          <h2 className="exam-title">{trackName} — Exam {examId}</h2>
          <div className="timer">⏱ 1:28:00 left</div>
          <div className="question-counter">Q 5/50</div>
          {/* changed to open modal */}
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>

        {/* ===== Main Body ===== */}
        <div className="main-body">
          {/* ===== Left: Question Area ===== */}
          <div className="question-area">
            <h2 className="question-text">What is React primarily used for?</h2>

            <div className="options">
              <label><input type="radio" name="q1" /> Building user interfaces</label>
              <label><input type="radio" name="q1" /> Data analysis</label>
              <label><input type="radio" name="q1" /> Video rendering</label>
              <label><input type="radio" name="q1" /> File management</label>
            </div>

            <div className="controls">
              <button className="flag-btn">🚩 Flag Question</button>
              <div className="nav-buttons">
                <button className="prev-btn">Previous</button>
                <button className="next-btn">Next</button>
              </div>
            </div>
          </div>

          {/* ===== Right: Question Map ===== */}
          <div className="right-panel">
            <h3>Question Map</h3>
            <div className="map-grid">
              {Array.from({ length: 50 }).map((_, i) => (
                <button key={i} className="map-btn">{i + 1}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Modal (Add here, outside main .exam-player but inside returned fragment) ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Submit Exam?</h2>
            <p>Are you sure you want to submit your exam?</p>

            <div className="modal-buttons">
              <button className="yes-btn" onClick={confirmSubmit}>Yes, Submit</button>
              <button className="no-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamPlayer;
