import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";

const ProductCard = ({ product, onEdit, onDelete, isAdmin }) => {
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
      
      <div className="product-actions">
        <button className="add-to-cart-button" onClick={() => addToCart(product)}>
          {t("product.add_to_cart")}
        </button>
        <br />
        {isAdmin && (
          <>
          <button className="edit-product-button" onClick={onEdit}>
            {t("product.edit")}
          </button>
          <button className="delete-product-button" onClick={onDelete}>
            {t("product.delete")}
          </button>
          </>
        )}
      </div>
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
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isAdmin: PropTypes.bool,
};

export default ProductCard;
