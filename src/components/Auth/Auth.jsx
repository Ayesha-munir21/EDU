import React, { useState, useContext } from "react";
import "./Auth.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { AuthContext } from "../../AuthContext";

// Define the API base URL
export const API_BASE_URL = "https://ceretification-app.onrender.com";
=======
import { AuthContext } from "../../AuthContext"; // ✅ Import AuthContext
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

<<<<<<< HEAD
  const { user, setUser, enrolledCourses } = useContext(AuthContext);
  
  // State for managing Sign In form inputs
  const [signInData, setSignInData] = useState({ email: "", password: "" });

  // State for managing Sign Up form inputs
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


  // ===== Helper to fetch user data after successful authentication =====
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
    
    // 1. Create FormData for the OAuth2PasswordRequestForm expected by FastAPI
    const formData = new URLSearchParams();
    formData.append('username', signInData.email);
    formData.append('password', signInData.password);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          // CRUCIAL for OAuth2PasswordRequestForm
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. SUCCESS: Store the token
        localStorage.setItem('accessToken', data.access_token);
        
        // 3. Fetch user details and update context
        const userFetched = await fetchAndSetUser(data.access_token);
        
        if (userFetched) {
             // Navigation logic remains the same
            if (enrolledCourses.length > 0) {
              navigate("/dashboard");
            } else {
              navigate("/");
            }
        }
      } else {
        // 4. ERROR Handling
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

    // 1. Prepare JSON payload
    const payload = {
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        email: signUpData.email,
        password: signUpData.password,
        // Send the complete consents object required by the model
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
        // 2. SUCCESS: User created
        alert(`Account created successfully for ${data.user.email}. Please sign in.`);
        
        // Switch to Sign In tab and pre-fill email
        setIsSignUp(false);
        setSignInData({ email: signUpData.email, password: '' });
        
      } else {
        // 3. ERROR Handling (e.g., Email already registered)
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
=======
  // ✅ Get user and enrolledCourses from AuthContext
  const { user, setUser, enrolledCourses } = useContext(AuthContext);

  // ===== Handle Sign In Submit =====
  const handleSignIn = (e) => {
    e.preventDefault();

    // Example: after sign in, set user object (replace with real auth)
    setUser({ name: "Demo User", email: "demo@example.com" });

    // ✅ Existing user with enrolled courses goes to dashboard
    if (enrolledCourses.length > 0) {
      navigate("/dashboard");
    } else {
      // ✅ New user stays on landing page
      navigate("/");
    }
  };

  // ===== Handle Sign Up Submit =====
  const handleSignUp = (e) => {
    e.preventDefault();

    // Example: after sign up, set user object
    setUser({ name: "New User", email: "newuser@example.com" });

    // ✅ New user stays on landing page
    navigate("/");
  };

  return (
    <div className="auth-container">
      {/* ===== Left Side ===== */}
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
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
<<<<<<< HEAD
          {/* ===== Tabs (Sign In / Sign Up) (No UI change) ===== */}
=======
          {/* ===== Tabs (Sign In / Sign Up) ===== */}
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
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

<<<<<<< HEAD
          {/* ===== Sign In Form (Integration changes applied) ===== */}
=======
          {/* ===== Sign In Form ===== */}
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
          {!isSignUp ? (
            <>
              <h2>Sign In to Your Account</h2>
              <form onSubmit={handleSignIn}>
<<<<<<< HEAD
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
=======
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
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
<<<<<<< HEAD
            /* ===== Create Account Form (Integration changes applied) ===== */
=======
            /* ===== Create Account Form ===== */
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
            <>
              <h2>Create a New Account</h2>
              <form onSubmit={handleSignUp}>
                <div className="name-row">
<<<<<<< HEAD
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
=======
                  <input type="text" placeholder="First Name" required />
                  <input type="text" placeholder="Last Name" required />
                </div>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
<<<<<<< HEAD
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
=======
                />
                <label className="checkbox">
                  <input type="checkbox" required /> I agree to the Terms &
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
                  Privacy Policy
                </label>
                <button type="submit" className="primary-btn">
                  Create Account
                </button>
              </form>
            </>
          )}

<<<<<<< HEAD
          {/* ===== OR Divider (No UI change) ===== */}
=======
          {/* ===== OR Divider ===== */}
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
          <div className="divider">
            <span>or</span>
          </div>

<<<<<<< HEAD
          {/* ===== Social Login Buttons (No UI change) ===== */}
=======
          {/* ===== Social Login Buttons ===== */}
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
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

<<<<<<< HEAD
export default Auth;
=======
export default Auth;
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
