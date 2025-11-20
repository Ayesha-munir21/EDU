import React, { useContext } from "react";
import { FaCheckCircle } from "react-icons/fa";
import "./TrackDetails.css";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../../AuthContext";

const TrackDetails = () => {
  const { user, enrolledCourses, setEnrolledCourses } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEnroll = () => {
    if (!enrolledCourses.includes("AWS")) {
      setEnrolledCourses([...enrolledCourses, "AWS"]);
    }
    // After enrollment, navigate to dashboard
    navigate("/success-enroll");
  };

  return (
    <div className="track-details">
      {/* ===== Header Section ===== */}
      <header className="track-header">
        <div className="track-left">
          <div className="track-title-row">
            <img
              src="https://cdn.worldvectorlogo.com/logos/amazon-web-services-2.svg"
              alt="AWS Logo"
              className="track-logo"
            />
            <div>
              <h1>AWS Cloud Practitioner</h1>
              <span className="badge">Beginner Level</span>
            </div>
          </div>

          <p className="summary">
            Start your cloud journey with AWS — learn essential cloud concepts,
            key AWS services, pricing, and best practices. Perfect for beginners
            preparing for their first cloud certification.
          </p>

          
          {/* ===== Enroll Button ===== */}
          <div className="track-actions-left">
            <button className="btn enroll-btn" onClick={handleEnroll}>
              Enroll Now
            </button>
          </div>
        </div>
      </header>

      {/* ===== What You’ll Get Section ===== */}
      <section className="tab-content">
        <h3>What You’ll Get</h3>
        <ul className="get-list">
          <li><FaCheckCircle className="check-icon" /> 5 Full-Length Practice Exams</li>
          <li><FaCheckCircle className="check-icon" /> Downloadable Study Materials (Slides + Notes)</li>
          <li><FaCheckCircle className="check-icon" /> Lifetime Access with Free Updates</li>
        </ul>
      </section>

      {/* ===== Exam Info ===== */}
      <section className="exam-info">
        <h3>Certification Exam Details</h3>
        <div className="info-grid">
          <div className="info-box">
            <h4>Duration</h4>
            <p>90 Minutes</p>
          </div>
          <div className="info-box">
            <h4>Question Count</h4>
            <p>65 Multiple-Choice Questions</p>
          </div>
          <div className="info-box">
            <h4>Exam Format</h4>
            <p>Online Proctored or Test Center (Closed Book)</p>
          </div>
        </div>

        <p className="exam-note">
          The <strong>AWS Certified Cloud Practitioner</strong> exam validates
          your understanding of AWS fundamentals and cloud concepts. Once
          certified, your credential remains valid for <strong>3 years</strong>.
        </p>
      </section>

      <footer className="footer">
        <p>Terms | Privacy | Contact</p>
        <p>© 2025 Edora — Learn. Grow. Achieve.</p>
      </footer>
    </div>
  );
};

export default TrackDetails;
