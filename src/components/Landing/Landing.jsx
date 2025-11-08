import React from "react";
import "./Landing.css";
import { FaGlobe, FaGraduationCap, FaHandsHelping } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};


useEffect(() => {
  if (location.state?.scrollTo === "courses") {
    const section = document.getElementById("courses");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
}, [location]);


  return (
    <div className="landing-container">
      {/* ===== Navbar ===== */}
      <nav className="navbar">
        <div className="brand">EduLearn</div>
       <ul className="nav-links">
  <li onClick={() => scrollToSection("home")}>Home</li>
  <li onClick={() => scrollToSection("tracks")}>Tracks</li>
  <li onClick={() => scrollToSection("pricing")}>Pricing</li>
  <li onClick={() => scrollToSection("how-it-works")}>How It Works</li>
</ul>

        <div className="navbar-right">
          <button className="nav-btn" onClick={() => navigate("/auth")}>
            Sign In
          </button>
          <button className="nav-btn filled" onClick={() => navigate("/auth")}>
            Create Account
          </button>
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

          {/* ✅ Fixed Buttons */}
          <div className="hero-buttons">
            <button
              className="landing-primary-btn"
              onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
            >
              Browse Certifications
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate("/auth")}
            >
              Start Learning
            </button>
          </div>
        </div>
      </section>

      {/* ===== Featured Certifications ===== */}
     <section id="tracks" className="section featured">


        <h2 className="section-title">Featured Certifications</h2>
        <div className="course-grid">
          <div className="course-card">
            <img
              src="https://cdn.worldvectorlogo.com/logos/amazon-web-services-2.svg"
              alt="AWS Cloud Practitioner"
              className="course-img"
            />
            <h4>AWS Cloud Practitioner</h4>
            <p className="level">Beginner</p>
            <div className="price">$49</div>
            <button
              className="primary-btn view-btn"
              onClick={() => navigate("/track/aws")}
            >
              View Details
            </button>
          </div>

          <div className="course-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9191/9191048.png"
              alt="PMP Project Management"
              className="course-img"
            />
            <h4>PMP Project Management</h4>
            <p className="level">Intermediate</p>
            <div className="price">$79</div>
            <button
              className="primary-btn view-btn"
              onClick={() => navigate("/track/pmp")}
            >
              View Details
            </button>
          </div>

          <div className="course-card">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
              alt="Python for Developers"
              className="course-img"
            />
            <h4>Python for Developers</h4>
            <p className="level">Beginner</p>
            <div className="price">$59</div>
            <button
              className="primary-btn view-btn"
              onClick={() => navigate("/track/python")}
            >
              View Details
            </button>
          </div>
        </div>
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
        <p>© 2025 EduLearn — Learn. Grow. Achieve.</p>
      </footer>
    </div>
  );
};

export default Landing;
