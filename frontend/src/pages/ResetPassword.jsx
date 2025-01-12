import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../utils/api";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (!token || !newPassword) {
        throw new Error(t("Invalid reset link or password."));
      }
      const dataToSend = { token, new_password: newPassword };
      await resetPassword(dataToSend);
      setMessage(t("Password reset successfully!"));
    } catch (error) {
      console.error("Reset Password Error:", error);
      setMessage(error.message || t("Failed to reset password."));
    }
  };
  

  return (
    <form onSubmit={handleResetPassword}>
      <h2>{t("reset_password.title")}</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>{t("reset_password.new_password")}</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>
      <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px" }}>
        {t("reset_password.submit")}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ResetPassword;
