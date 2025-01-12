import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProfileUpdateForm from "../components/ProfileUpdateForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import AccountDelete from "../components/AccountDelete";

const UserProfile = () => {
  const { t } = useTranslation();
  const { logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState({ new_email: "", new_username: "", current_password: "" });
  const [passwordData, setPasswordData] = useState({ current_password: "", new_password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  return (
    <div>
      <ProfileUpdateForm
        profileData={profileData}
        handleProfileChange={handleProfileChange}
        t={t}
        token={token}
        setMessage={setMessage}
      />
      <PasswordChangeForm
        passwordData={passwordData}
        handlePasswordChange={handlePasswordChange}
        t={t}
        token={token}
        setMessage={setMessage}
      />
      <AccountDelete
        currentPassword={profileData.current_password}
        handlePasswordChange={handleProfileChange}
        t={t}
        token={token}
        setMessage={setMessage}
        logout={logout}
      />
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserProfile;
