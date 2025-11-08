import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Asma Ali",
    email: "asma@example.com",
    enrolledTracks: "Web Development, Python",
    completedExams: 3,
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("✅ Profile updated successfully!");
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1 className="profile-title">👤 My Profile</h1>

        <div className="profile-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
            alt="User Avatar"
            className="profile-avatar"
          />

          {!isEditing ? (
            <>
              <h2>{profile.name}</h2>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Enrolled Tracks:</strong> {profile.enrolledTracks}</p>
              <p><strong>Completed Exams:</strong> {profile.completedExams}</p>

              <button className="edit-btn" onClick={handleEditToggle}>
                ✏️ Edit Profile
              </button>
            </>
          ) : (
            <div className="edit-section">
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter Name"
              />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
              <input
                type="text"
                name="enrolledTracks"
                value={profile.enrolledTracks}
                onChange={handleChange}
                placeholder="Enter Enrolled Tracks"
              />
              <input
                type="number"
                name="completedExams"
                value={profile.completedExams}
                onChange={handleChange}
                placeholder="Completed Exams"
              />

              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  💾 Save
                </button>
                <button className="cancel-btn" onClick={handleEditToggle}>
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
