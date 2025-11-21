// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

<<<<<<< HEAD
// ✅ Import AuthProvider so user state is available everywhere
import { AuthProvider } from "./AuthContext";

=======
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
// === Components ===
import Landing from "./components/Landing/Landing";
import Auth from "./components/Auth/Auth";
import TrackDetails from "./components/TrackDetails/TrackDetails";
import Dashboard from "./components/Dashboard/Dashboard";
import CheckoutFlow from "./components/CheckoutFlow/CheckoutFlow";
import LearningView from "./components/LearningView/LearningView";
import ExamCatalog from "./components/ExamCatalog/ExamCatalog";
import ExamPlayer from "./components/ExamPlayer/ExamPlayer"; 
import ExamResults from "./components/ExamResults/ExamResults";
import ProgressAchievements from "./components/ProgressAchievements/ProgressAchievements";
import Profile from "./components/Profile/Profile"; 
import SuccessEnroll from "./components/SuccessEnroll/SuccessEnroll";

function App() {
  return (
<<<<<<< HEAD
    // ✅ Wrap the Router in AuthProvider
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* ✅ Changed :id to :trackId to match TrackDetails.jsx */}
          <Route path="/track/:trackId" element={<TrackDetails />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<CheckoutFlow />} />
          
          {/* Note: You might need to make these dynamic later (e.g., /learning/:trackId) */}
          <Route path="/learning" element={<LearningView />} />
          <Route path="/exam-catalog" element={<ExamCatalog />} />
          <Route path="/exam-player" element={<ExamPlayer />} /> 
          <Route path="/exam-results" element={<ExamResults />} />
          
          <Route path="/progress" element={<ProgressAchievements />} />
          <Route path="/purchases" element={<CheckoutFlow />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/success-enroll" element={<SuccessEnroll />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
=======
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/track/:id" element={<TrackDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkout" element={<CheckoutFlow />} />
        <Route path="/learning" element={<LearningView />} />
        <Route path="/exam-catalog" element={<ExamCatalog />} />
        <Route path="/exam-player" element={<ExamPlayer />} /> 
        <Route path="/exam-results" element={<ExamResults />} />
        <Route path="/progress" element={<ProgressAchievements />} />
        <Route path="/purchases" element={<CheckoutFlow />} />
        <Route path="/profile" element={<Profile />} />
       <Route path="/success-enroll" element={<SuccessEnroll />} />




      </Routes>
    </Router>
  );
}

export default App;
>>>>>>> cdb24864b6178644b7b3ad57a25dea20de31d29a
