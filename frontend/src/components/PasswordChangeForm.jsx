import PropTypes from "prop-types";
import { updatePassword, getCurrentUser } from "../utils/api";

const PasswordChangeForm = ({ passwordData, handlePasswordChange, t, token, setMessage }) => {
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const currentUser = await getCurrentUser(token);
      const userId = currentUser.id;

      const dataToSend = {
        user_id: userId,
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      };

      await updatePassword(dataToSend, token);
      setMessage(t("Password updated successfully!"));
    } catch (error) {
      console.error("Password Update Error:", error);
      setMessage(error.message || t("An error occurred while updating password."));
    }
  };

  return (
    <form onSubmit={handlePasswordUpdate}>
      <h2>{t("account.change_password")}</h2>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>{t("account.current_password")}</label>
        <input
          type="password"
          name="current_password"
          placeholder={t("account.current_password")}
          value={passwordData.current_password}
          onChange={handlePasswordChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>{t("account.new_password")}</label>
        <input
          type="password"
          name="new_password"
          placeholder={t("account.new_password")}
          value={passwordData.new_password}
          onChange={handlePasswordChange}
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

PasswordChangeForm.propTypes = {
  passwordData: PropTypes.object.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
};

export default PasswordChangeForm;
