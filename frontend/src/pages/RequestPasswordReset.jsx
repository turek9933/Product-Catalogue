import { useState } from "react";
import { requestPasswordReset } from "../utils/api";
import { useTranslation } from "react-i18next";

const RequestPasswordReset = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setMessage(t("Password reset email sent successfully!"));
    } catch (error) {
      console.error("Request Password Reset Error:", error);
      setMessage(error.message || t("Failed to send password reset email."));
    }
  };

  return (
    <form onSubmit={handleRequestReset}>
      <h2>{t("reset_password.title_request")}</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>{t("reset_password.email")}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>
      <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px" }}>
        {t("reset_password.submit_request")}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default RequestPasswordReset;
