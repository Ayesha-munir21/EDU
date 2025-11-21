<<<<<<< HEAD
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Award, Trophy, Clock, Download, Star, Zap } from "lucide-react";
import { AuthContext } from "../../AuthContext";
import "./ProgressAchievements.css";

export const API_BASE_URL = "https://ceretification-app.onrender.com";

const ProgressAchievements = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [overallPercentage, setOverallPercentage] = useState(0);
  const [history, setHistory] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  
  // Stats for the Text File
  const [stats, setStats] = useState({ 
      completedCourses: 0, 
      itemsCompleted: 0, // Slides + Exams
      examsPassed: 0, 
      bestScore: 0 
  });

  // Modal State
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // 1. Fetch Data & Calculate Real Stats
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // Get Track IDs from User Object
        const trackIds = (user.entitlements || [])
            .filter(e => e.startsWith("track:"))
            .map(e => e.replace("track:", ""));

        if (trackIds.length === 0) {
            setLoading(false);
            return;
        }

        let grandTotalItems = 0;   // All slides + exams across all tracks
        let grandTotalDone = 0;    // All marked slides + passed exams
        let coursesCompleted = 0;
        let highestScore = 0;
        let totalExamsPassed = 0;
        let allActivities = [];

        // Fetch data for ALL enrolled tracks
        await Promise.all(trackIds.map(async (trackId) => {
            // A. Fetch Track Info
            const trackRes = await fetch(`${API_BASE_URL}/api/tracks/${trackId}`);
            const trackData = trackRes.ok ? await trackRes.json() : null;

            // B. Fetch Progress
            const progRes = await fetch(`${API_BASE_URL}/api/progress/${trackId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const progData = progRes.ok ? await progRes.json() : null;

            if (trackData && progData) {
                // 1. Counts for this specific track
                const totalSlides = trackData.concepts_count || 0;
                const totalExams = trackData.exams_count || 0;
                const trackTotalItems = totalSlides + totalExams;

                const doneSlides = progData.conceptStatuses?.length || 0;
                // Count passed exams (score >= 70)
                const passedExams = (progData.examStats || []).filter(s => s.bestScore >= 70).length;
                const trackDoneItems = doneSlides + passedExams;

                // Add to Grand Totals
                grandTotalItems += trackTotalItems;
                grandTotalDone += trackDoneItems;
                totalExamsPassed += passedExams;

                // Check if THIS course is 100% complete
                if (trackTotalItems > 0 && trackDoneItems >= trackTotalItems) {
                    coursesCompleted++;
                }

                // 2. Collect Concept History
                progData.conceptStatuses?.forEach(status => {
                    allActivities.push({
                        type: 'concept',
                        title: `Learned a concept in ${trackData.title}`,
                        date: new Date(status.markedAt)
                    });
                });

                // 3. Collect Exam History
                progData.examStats?.forEach(exam => {
                    if (exam.bestScore > highestScore) highestScore = exam.bestScore;
                    
                    allActivities.push({
                        type: 'exam',
                        title: `Scored ${exam.bestScore}% on Exam in ${trackData.title}`,
                        date: new Date(progData.updatedAt) 
                    });
                });
            }
        }));

        // C. Calculate Overall Percentage
        const finalPercentage = grandTotalItems > 0 
            ? Math.round((grandTotalDone / grandTotalItems) * 100) 
            : 0;

        setOverallPercentage(finalPercentage);
        setStats({ 
            completedCourses: coursesCompleted, 
            itemsCompleted: grandTotalDone,
            examsPassed: totalExamsPassed, 
            bestScore: highestScore 
        });

        // D. Sort History (Newest First)
        allActivities.sort((a, b) => b.date - a.date);
        setHistory(allActivities.slice(0, 10)); // Keep top 10

        // E. Determine Badges
        const badges = [];
        if (grandTotalDone >= 5) badges.push({ icon: <Zap color="#F59E0B" />, title: "Fast Starter", desc: "Completed 5+ learning items" });
        if (coursesCompleted >= 1) badges.push({ icon: <Award color="#3B82F6" />, title: "Graduate", desc: "Completed a full course" });
        if (totalExamsPassed >= 1) badges.push({ icon: <Trophy color="#10B981" />, title: "Scholar", desc: "Passed your first exam" });
        if (highestScore >= 90) badges.push({ icon: <Star color="#8B5CF6" />, title: "High Flyer", desc: "Scored 90%+ on an exam" });

        setEarnedBadges(badges);

      } catch (error) {
        console.error("Error calculating progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 2. Handle Download (Generate REAL Text File)
  const confirmDownload = () => {
    const element = document.createElement("a");
    
    // ✅ THIS CONTENT IS DYNAMIC & REAL
    const fileContent = `
EDORA LEARNING REPORT
======================
Student: ${user?.firstName} ${user?.lastName}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

----------------------
📊 STATISTICS
----------------------
Overall Progress:   ${overallPercentage}%
Courses Completed:  ${stats.completedCourses}
Items Mastered:     ${stats.itemsCompleted} (Slides + Exams)
Exams Passed:       ${stats.examsPassed}
Highest Score:      ${stats.bestScore}%

----------------------
🕒 RECENT ACTIVITY
----------------------
${history.length === 0 ? "No recent activity found." : history.map(h => `[${h.date.toLocaleDateString()}] ${h.title}`).join('\n')}

----------------------
Generated by Edora Certification App
    `;

    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Edora_Report_${user?.firstName || 'User'}.txt`;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
    
    setShowDownloadModal(false);
  };

  const handleDownload = () => setShowDownloadModal(true);

  // Helper to format date
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  };

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Loading your achievements...</div>;
=======
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
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a

  return (
    <div className="progress-container">
      <h1 className="progress-title">🏆 Your Progress & Achievements</h1>

      <div className="progress-grid">
        {/* Progress Circle */}
        <div className="progress-card ring-card">
          <h2>Overall Progress</h2>
          <div style={{ width: 160, height: 160 }}>
            <CircularProgressbar
<<<<<<< HEAD
              value={overallPercentage}
              text={`${overallPercentage}%`}
=======
              value={percentage}
              text={`${percentage}%`}
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
              styles={buildStyles({
                pathColor: "#48BB78",
                textColor: "#2F855A",
                trailColor: "#C6F6D5",
              })}
            />
          </div>
<<<<<<< HEAD
          <p style={{marginTop: '15px', color: '#666'}}>Total Completion</p>
=======
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
        </div>

        {/* Badges */}
        <div className="progress-card badge-card">
          <h2><Trophy className="icon-yellow" /> Badges</h2>
<<<<<<< HEAD
          {earnedBadges.length === 0 ? (
              <p style={{color: '#888', fontStyle: 'italic', padding:'20px'}}>Start learning to earn badges!</p>
          ) : (
            <div className="badge-list">
                {earnedBadges.map((a, index) => (
                <div key={index} className="badge-item">
                    <div className="badge-icon">{a.icon}</div>
                    <div>
                    <h3>{a.title}</h3>
                    <p>{a.desc}</p>
                    </div>
                </div>
                ))}
            </div>
          )}
=======
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
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
        </div>

        {/* Activity History */}
        <div className="progress-card history-card">
          <h2><Clock className="icon-green" /> Recent Activity</h2>
<<<<<<< HEAD
          {history.length === 0 ? (
              <p style={{color: '#888', padding: '20px'}}>No recent activity.</p>
          ) : (
            <ul className="history-list">
                {history.map((item, i) => (
                <li key={i} className="history-item">
                    <span>{item.title}</span>
                    <span className="time">{timeAgo(item.date)}</span>
                </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="progress-actions">
        <button className="download-btn" onClick={handleDownload}>
            <Download size={22} /> Download Summary
        </button>

        <button className="back-btn" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
        </button>
      </div>

      {/* Modal UI */}
=======
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
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
      {showDownloadModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Download Summary?</h2>
<<<<<<< HEAD
            <p>Do you want to download your progress summary as a text file?</p>
=======
            <p>Do you want to download your progress summary?</p>

>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
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

<<<<<<< HEAD
export default ProgressAchievements;
=======
export default ProgressAchievements;
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
