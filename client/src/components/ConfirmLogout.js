import React from "react";
import "./ConfirmLogout.css";

function ConfirmLogout({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="logout-overlay">
      <div className="logout-box">
        <h3>Logout?</h3>
        <p>Are you sure you want to exit?</p>

        <div className="logout-actions">
          <button className="logout-btn yes" onClick={onConfirm}>Yes</button>
          <button className="logout-btn no" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLogout;
