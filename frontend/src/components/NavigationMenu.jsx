import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NavigationMenu = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  const handleThemeChange = (e) => {
    toggleTheme(e.target.value);
  };

  const handleAccoutClick = (e) => {
    const action = e.target.value;
    if (action === 'logout') {
      logout();
      navigate('/login');
    }
    else if (action === 'profile') {
      navigate('/profile');
    }
  };
  return (
    <header className="navigation-header">
      <nav className="navigation-bar">
        <div className="navigation-links">
          <Link to="/">{t('menu.home')}</Link>
          <Link to="/products">{t('menu.catalogue')}</Link>
        </div>
        
        {isLoggedIn ? (
          <>
          <div className="navigation-controls">
            <select defaultValue="" onChange={handleAccoutClick} className="account-select">
              <option value="" disabled hidden>{t('menu.account')}</option>
              <option value="profile">{t('menu.edit_profile')}</option>
              <option value="logout">{t('menu.logout')}</option>
            </select>
          </div>
          <Link to="/cart">{t('menu.cart')}</Link>
          </>
        ) : (
          <Link to="/login">{t('menu.login')}</Link>
        )}

        <div className="navigation-controls">
          <select value={language} onChange={handleLanguageChange} className="language-select">
            <option value="en">🇺🇸 English</option>
            <option value="pl">🇵🇱 Polski</option>
          </select>
          <select value={theme} onChange={handleThemeChange} className="theme-select">
            <option value="light">{t("menu.light_mode")}</option>
            <option value="dark">{t("menu.dark_mode")}</option>
          </select>
        </div>
      </nav>
    </header>
  );
};

export default NavigationMenu;
