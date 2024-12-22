import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/change-password", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Password changed successfully!");
    } catch (error) {
      alert("Error changing password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" name="currentPassword" placeholder="Current Password" onChange={handleChange} required />
      <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} required />
      <button type="submit">Change Password</button>
    </form>
  );
}

export default ChangePassword;
