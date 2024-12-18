import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ErrorPage = ({ messageKey = "error_default", messageParams = {}, statusCode = 404 }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Error {statusCode}</h1>
      <p>{t(messageKey, messageParams)}</p>
      <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        {t('go_home', { defaultValue: 'Go to Homepage' })}
      </button>
    </div>
  );
};

ErrorPage.propTypes = {
  messageKey: PropTypes.string.isRequired,
  messageParams: PropTypes.object,
  statusCode: PropTypes.number,
};

export default ErrorPage;
