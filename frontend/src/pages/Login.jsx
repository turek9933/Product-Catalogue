import { useState } from "react";
import { useTranslation } from "react-i18next";
import { loginUser } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginUser(username, password);
      
      if (data && data.access_token) {
        localStorage.setItem("token", data.access_token);
        login();
        navigate("/products");
      } else {
        setError(t("login.invalid_response"));
      }
    } catch {
      setError(t("login.error"));
    }
  };

  return (
    <div>
      <h1>{t("login.title")}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t("login.username")}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
          />
        </div>
        <div>
          <label>{t("login.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">{t("login.submit")}</button>
      </form>
      <button onClick={() => navigate("/register")} style={{ marginTop: "10px" }}>
        {t("login.no_account")}
      </button>
    </div>
  );
};

export default Login;
