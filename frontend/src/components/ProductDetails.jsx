import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../components/ErrorMessage";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch {
        setError(t("product.error"));
      }
    };

    loadProductDetails();
  }, [id, t]);

  const refreshComments = () => {
    setRefreshTrigger((prev) => !prev);
  };

  if (error) return <ErrorMessage message={error} />;
  if (!product) return <p>{t("loading")}</p>;

  return (
    <div className="product-details">
      {product && (
        <>
          <h1>{language === "en" ? product.name_en : product.name_pl}</h1>
          <img src={product.image} alt={language === "en" ? product.name_en : product.name_pl} />
          <p>{language === "en" ? product.full_description_en : product.full_description_pl}</p>
          <p>{t("product.price")}: {product.price} USD</p>
          <button className="add-to-cart-button" onClick={() => addToCart(product)}>
            {t("product.add_to_cart")}
          </button>
        </>
      )}

      <hr />

      <h2>{t("comments.title")}</h2>
      <CommentList productId={Number(id)} refreshTrigger={refreshTrigger} />
      <h2>{t("comments.add")}</h2>
      <CommentForm productId={Number(id)} onCommentAdded={refreshComments} />
    </div>
  );
};

export default ProductDetails;
