import PropTypes from "prop-types";
import { updateProfile, getCurrentUser } from "../utils/api";

const ProfileUpdateForm = ({ profileData, handleProfileChange, t, token, setMessage }) => {
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const currentUser = await getCurrentUser(token);
      const userId = currentUser.id;

      const dataToSend = {
        user_id: userId,
        current_password: profileData.current_password,
        new_email: profileData.new_email || null,
        new_username: profileData.new_username || null,
      };


      await updateProfile(dataToSend, token);
      setMessage(t("Profile updated successfully!"));
    } catch (error) {
      console.error("Profile Update Error:", error);
      setMessage(error.message || t("An error occurred while updating profile."));
    }
  };

  return (
    <form onSubmit={handleProfileUpdate}>
      <h2>{t("account.update")}</h2>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>{t("account.new_email")}</label>
        <input
          type="email"
          name="new_email"
          placeholder={t("account.new_email")}
          value={profileData.new_email}
          onChange={handleProfileChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>{t("account.new_username")}</label>
        <input
          type="text"
          name="new_username"
          placeholder={t("account.new_username")}
          value={profileData.new_username}
          onChange={handleProfileChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>{t("account.current_password")}</label>
        <input
          type="password"
          name="current_password"
          placeholder={t("account.current_password")}
          value={profileData.current_password}
          onChange={handleProfileChange}
          required
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <button type="submit" style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px" }}>
        {t("account.save")}
      </button>
    </form>
  );
};

ProfileUpdateForm.propTypes = {
  profileData: PropTypes.object.isRequired,
  handleProfileChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
};

export default ProfileUpdateForm;
