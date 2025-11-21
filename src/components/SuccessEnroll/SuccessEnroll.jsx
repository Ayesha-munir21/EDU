import React from "react";
import { useNavigate } from "react-router-dom";
import "./SuccessEnroll.css";

const SuccessEnroll = () => {
  const navigate = useNavigate();

  return (
    <section className="success-screen">
      <div className="success-box">
        <div className="checkmark">🎉</div>
        <h2>You're Successfully Enrolled!</h2>

        <p className="msg">
          Congrats! Your enrollment was successful. 
          You can now access all your selected courses and modules.
        </p>

        <button
          className="primary-btn"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard →
        </button>
      </div>
    </section>
  );
};

export default SuccessEnroll;
