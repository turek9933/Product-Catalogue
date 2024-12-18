import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>{t('welcome')}</h1>
      <p>{t('menu.description')}</p>
    </div>
  );
};

export default Home;
