import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchComments } from '../utils/api';
import PropTypes from 'prop-types';

const CommentList = ({ productId }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(productId);
        setComments(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadComments();
  }, [productId]);

  if (error) {
    return <p>{t('comments.error')}: {error}</p>;
  }

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>
          <strong>{comment.user.username}:</strong> {comment.content}
          <p>{t('comments.rating')}: {comment.rating}/5</p>
        </li>
      ))}
    </ul>
  );
};

CommentList.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default CommentList;
