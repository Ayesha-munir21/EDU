import React, { useState } from "react";
import "./Auth.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // ===== Handle Sign In Submit =====
  const handleSignIn = (e) => {
    e.preventDefault(); // Stop page refres
    navigate("/dashboard"); // Redirect to Dashboard
  };

  // ===== Handle Sign Up Submit =====
  const handleSignUp = (e) => {
    e.preventDefault();
    navigate("/dashboard"); // Redirect after account creation
  };

  return (
    <div className="auth-container">
      {/* ===== Left Side ===== */}
      <div className="auth-left">
        <h1>Welcome to EduLearn 🎓</h1>
        <p>Your journey to certification starts here.</p>
        <button className="back-home" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>

      {/* ===== Right Side ===== */}
      <div className="auth-right">
        <div className="auth-box">
          {/* ===== Tabs (Sign In / Sign Up) ===== */}
          <div className="auth-tabs">
            <button
              className={!isSignUp ? "tab active" : "tab"}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
            <button
              className={isSignUp ? "tab active" : "tab"}
              onClick={() => setIsSignUp(true)}
            >
              Create Account
            </button>
          </div>

          {/* ===== Sign In Form ===== */}
          {!isSignUp ? (
            <>
              <h2>Sign In to Your Account</h2>
              <form onSubmit={handleSignIn}>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <div className="forgot">
                  <a href="/profile">Profile</a>
                  <a href="/purchases">Purchases</a>
                  <button
                    type="button"
                    className="forgot-link"
                    onClick={(e) => e.preventDefault() /* TODO: handle forgot password dialog */}
                    style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer", padding: 0, margin: 0, textDecoration: "underline", font: "inherit" }}
                  >
                    Forgot password?
                  </button>
                </div>
                <button type="submit" className="primary-btn">
                  Sign In
                </button>
              </form>
            </>
          ) : (
            /* ===== Create Account Form ===== */
            <>
              <h2>Create a New Account</h2>
              <form onSubmit={handleSignUp}>
                <div className="name-row">
                  <input type="text" placeholder="First Name" required />
                  <input type="text" placeholder="Last Name" required />
                </div>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                />
                <label className="checkbox">
                  <input type="checkbox" required /> I agree to the Terms &
                  Privacy Policy
                </label>
                <button type="submit" className="primary-btn">
                  Create Account
                </button>
              </form>
            </>
          )}

          {/* ===== OR Divider ===== */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* ===== Social Login Buttons ===== */}
          <div className="social-buttons">
            <button className="google-btn">
              <FaGoogle className="icon" /> Continue with Google
            </button>
            <button className="facebook-btn">
              <FaFacebook className="icon" /> Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
