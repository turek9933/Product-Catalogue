import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const name = product[`name_${language}`] || product.name_en;
  const description = product[`short_description_${language}`] || product.short_description_en;

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={name} className="product-image" />
      </Link>
      <h3>
        <Link to={`/product/${product.id}`}>{name}</Link>
      </h3>
      <p>{description}</p>
      <p className="product-price">{product.price} USD</p>
      <button className="add-to-cart-button" onClick={() => addToCart(product)}>{t("product.add_to_cart")}</button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name_en: PropTypes.string.isRequired,
    name_pl: PropTypes.string.isRequired,
    short_description_en: PropTypes.string,
    short_description_pl: PropTypes.string,
    full_description_en: PropTypes.string,
    full_description_pl: PropTypes.string,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;
