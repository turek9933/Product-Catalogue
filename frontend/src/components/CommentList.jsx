import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchComments, deleteComment, getCurrentUser } from '../utils/api';
import PropTypes from 'prop-types';
import Rating from './Rating';
import ErrorMessage from './ErrorMessage';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}   ${hour}:${minute}`;
};

const CommentList = ({ productId }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndComments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await getCurrentUser(token);
          setCurrentUser(user);
        }
        const commentsData = await fetchComments(productId);
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserAndComments();
  }, [productId]);

  const handleDelete = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteComment(commentId, token);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.log(error);
      setError(t("comments.error"));
    }
  };

  if (error) {
    return <ErrorMessage message={t('comments.error')}/>;
  }

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>
          <p>
            {comment.content}
          </p>
          <p>
            <small>{formatDate(comment.created_at)}</small>{'    '}
            <Rating value={comment.rating} readOnly={true} />
          </p>
          {currentUser && (currentUser.role === 'admin' || currentUser.id === comment.user_id) && (
            <button onClick={() => handleDelete(comment.id)}>
              {t('comments.delete')}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

CommentList.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default CommentList;
