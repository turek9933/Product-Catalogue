import PropTypes from "prop-types";
import { deleteAccount, getCurrentUser } from "../utils/api";

const AccountDelete = ({ currentPassword, handlePasswordChange, t, token, setMessage, logout }) => {
  const handleAccountDelete = async () => {
    if (window.confirm(t("Are you sure you want to delete your account?"))) {
      try {
        const currentUser = await getCurrentUser(token);
        const userId = currentUser.id;
  
        const dataToSend = {
          user_id: userId,
          current_password: currentPassword,
        };
    
        await deleteAccount(dataToSend, token);
        logout();
        setMessage(t("Account deleted successfully!"));
      } catch (error) {
        console.error("Delete Account Error:", error);
        setMessage(error.message || t("An error occurred while deleting account."));
      }
    }
  };

  return (
    <div>
      <h2>{t("account.delete")}</h2>
      <p style={{ color: "red" }}>{t("account.delete_warning")}</p>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>{t("account.current_password")}</label>
        <input
          type="password"
          name="current_password"
          placeholder={t("account.current_password")}
          value={currentPassword}
          onChange={handlePasswordChange}
          required
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <button onClick={handleAccountDelete} style={{ backgroundColor: "red", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px" }}>
        {t("account.delete")}
      </button>
    </div>
  );
};

AccountDelete.propTypes = {
  currentPassword: PropTypes.string.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

export default AccountDelete;
