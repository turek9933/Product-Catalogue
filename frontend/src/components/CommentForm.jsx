import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { postComment } from "../utils/api";
import Rating from "./Rating";
import PropTypes from "prop-types";

const CommentForm = ({ productId, onCommentAdded }) => {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem("token");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn || !token) {
      setError(t("comments.loginRequired"));
      return;
    }

    try {
      await postComment({ content, rating, product_id: productId }, token);
      setContent("");
      setRating(5);
      onCommentAdded();
    } catch (err) {
      setError(err.message || t("comments.addError"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("comments.placeholder")}
        required
      />
      <Rating value={rating} onChange={(newRating) => setRating(newRating)} />
      <button type="submit">{t("comments.submit")}</button>
    </form>
  );
};

CommentForm.propTypes = {
  productId: PropTypes.number.isRequired,
  onCommentAdded: PropTypes.func.isRequired,
};

export default CommentForm;
