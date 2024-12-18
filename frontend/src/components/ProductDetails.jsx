import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById, fetchComments } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../components/ErrorMessage";
import Rating from "./Rating";
import CommentForm from "./CommentForm";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [commentsError, setCommentsError] = useState(null);
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch {
        setError(t("error.product_details"));
      }
    };

    const loadComments = async () => {
      try {
        const data = await fetchComments(id);
        setComments(data);
      } catch (e) {
        console.log(e);
        setCommentsError(t("comments.error"));
      }
    };

    loadProductDetails();
    loadComments();
  }, [id, t]);

  if (error) return <ErrorMessage message={error} />;
  if (!product) return <p>{t("loading")}</p>;

  const name = product[`name_${language}`] || product.name_en;
  const description =
    product[`full_description_${language}`] || product.full_description_en;

  return (
    <div className="product-details">
      <h1>{name}</h1>
      <img src={product.image} alt={name} />
      <p>{description}</p>
      <p>
        {t("product.price")}: {product.price} USD
      </p>
      <button
        className="add-to-cart-button"
        onClick={() => addToCart(product)}
      >
        {t("product.add_to_cart")}
      </button>

      <h2>{t("comments.header")}</h2>
      {commentsError && <ErrorMessage message={commentsError} />}
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.id}>
            <Rating value={comment.rating} readOnly /> {new Date(comment.created_at).toLocaleDateString()}<br />
            {comment.content}
          </li>
        ))}
      </ul>

      <h2>{t("comments.addComment")}</h2>
      <CommentForm
        productId={id}
        onCommentAdded={() => {
          const loadComments = async () => {
            try {
              const data = await fetchComments(id);
              setComments(data);
            } catch {
              setCommentsError(t("comments.error"));
            }
          };
          loadComments();
        }}
      />
    </div>
  );
};

export default ProductDetails;
