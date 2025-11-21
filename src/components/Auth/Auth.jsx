import React, { useState, useContext } from "react";
import "./Auth.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

export const API_BASE_URL = "https://ceretification-app.onrender.com";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const { user, setUser, enrolledCourses } = useContext(AuthContext);

  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    consents: { terms: false },
  });

  const handleInputChange = (e, formType) => {
    const { name, value, type, checked } = e.target;
    if (formType === "signIn") {
      setSignInData((prev) => ({ ...prev, [name]: value }));
    } else {
      if (name === "consents") {
        setSignUpData(prev => ({ 
            ...prev, 
            consents: { terms: checked } 
        }));
      } else {
        setSignUpData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  // Helper to fetch user data after successful authentication
  const fetchAndSetUser = async (token) => {
    try {
        const meResponse = await fetch(`${API_BASE_URL}/api/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (meResponse.ok) {
            const meData = await meResponse.json();
            setUser(meData);
            return true;
        } else {
            console.error("Failed to fetch user details.");
            localStorage.removeItem('accessToken');
            setUser(null);
            return false;
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        setUser(null);
        return false;
    }
  };


  // ===== Handle Sign In Submit (Login) =====
  const handleSignIn = async (e) => {
    e.preventDefault();
    
    const formData = new URLSearchParams();
    formData.append('username', signInData.email);
    formData.append('password', signInData.password);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access_token);
        
        const userFetched = await fetchAndSetUser(data.access_token);
        
        if (userFetched) {
            if (enrolledCourses.length > 0) {
              navigate("/dashboard");
            } else {
              navigate("/");
            }
        }
      } else {
        console.error("Sign In Failed:", data.detail);
        alert(`Login failed: ${data.detail || 'Invalid email or password'}`);
      }
    } catch (error) {
      console.error("Network Error during Sign In:", error);
      alert("A network error occurred.");
    }
  };


  // ===== Handle Sign Up Submit (Registration) =====
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (signUpData.password !== signUpData.confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    if (!signUpData.consents.terms) {
        alert("You must agree to the Terms & Privacy Policy.");
        return;
    }

    const payload = {
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        email: signUpData.email,
        password: signUpData.password,
        consents: signUpData.consents, 
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Account created successfully for ${data.user.email}. Please sign in.`);
        
        setIsSignUp(false);
        setSignInData({ email: signUpData.email, password: '' });
        
      } else {
        console.error("Sign Up Failed:", data.detail);
        alert(`Sign up failed: ${data.detail || 'An error occurred'}`);
      }
    } catch (error) {
      console.error("Network Error during Sign Up:", error);
      alert("A network error occurred.");
    }
  };


  return (
    <div className="auth-container">
      {/* ===== Left Side (No UI change) ===== */}
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
          {/* ===== Tabs (Sign In / Sign Up) (No UI change) ===== */}
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

          {/* ===== Sign In Form (Integration changes applied) ===== */}
          {!isSignUp ? (
            <>
              <h2>Sign In to Your Account</h2>
              <form onSubmit={handleSignIn}>
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  name="email"
                  value={signInData.email}
                  onChange={(e) => handleInputChange(e, 'signIn')}
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  name="password"
                  value={signInData.password}
                  onChange={(e) => handleInputChange(e, 'signIn')}
                />
                <div className="forgot">
                  <button
                    type="button"
                    className="forgot-link"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#2563eb",
                      cursor: "pointer",
                      padding: 0,
                      margin: 0,
                      textDecoration: "underline",
                      font: "inherit",
                    }}
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
            /* ===== Create Account Form (Integration changes applied) ===== */
            <>
              <h2>Create a New Account</h2>
              <form onSubmit={handleSignUp}>
                <div className="name-row">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    required 
                    name="firstName"
                    value={signUpData.firstName}
                    onChange={(e) => handleInputChange(e, 'signUp')}
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    required 
                    name="lastName"
                    value={signUpData.lastName}
                    onChange={(e) => handleInputChange(e, 'signUp')}
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  name="email" 
                  value={signUpData.email} 
                  onChange={(e) => handleInputChange(e, 'signUp')} 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  name="password" 
                  value={signUpData.password} 
                  onChange={(e) => handleInputChange(e, 'signUp')} 
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  name="confirmPassword"
                  value={signUpData.confirmPassword}
                  onChange={(e) => handleInputChange(e, 'signUp')}
                />
                <label className="checkbox">
                  <input 
                    type="checkbox" 
                    required 
                    name="consents"
                    checked={signUpData.consents.terms}
                    onChange={(e) => handleInputChange(e, 'signUp')}
                  /> I agree to the Terms &
                  Privacy Policy
                </label>
                <button type="submit" className="primary-btn">
                  Create Account
                </button>
              </form>
            </>
          )}

          {/* ===== OR Divider (No UI change) ===== */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* ===== Social Login Buttons (No UI change) ===== */}
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