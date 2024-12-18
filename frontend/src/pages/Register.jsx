import { useState } from "react";
import { useTranslation } from "react-i18next";
import { registerUser } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username, email, password);
      setSuccess(t("register.success"));
      navigate("/login");
    } catch {
      setError(t("register.error"));
    }
  };

  return (
    <div>
      <h1>{t("register.title")}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t("register.username")}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>{t("register.email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>{t("register.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
        <button type="submit">{t("register.submit")}</button>
      </form>
    </div>
  );
};

export default Register;
