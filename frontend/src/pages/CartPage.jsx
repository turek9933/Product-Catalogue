import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import PayPalButton from "../components/PayPalButton";

const CartPage = () => {
  const { isLoggedIn } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isLoggedIn) { return <ErrorMessage message="You are not logged in."/> }

  return (
    <div className="cart-page">
      <h1>{t("product.cart")}</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("product.title")}</th>
            <th>{t("product.price")}</th>
            <th>{t("product.quantity")}</th>
            <th>{t("product.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item[`name_${language}`] || item.name_en}</td>
              <td>{item.price.toFixed(2)} USD</td>
              <td>
                <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span className="quantity-display">{item.quantity}</span>
                <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </td>
              <td>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>{t("product.remove")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>{t("product.total")}: {totalPrice.toFixed(2)} USD</h2>
      <PayPalButton totalPrice={totalPrice} />
      <button className="clear-cart-button" onClick={clearCart}>{t("product.clear_cart")}</button>
    </div>
  );
};

export default CartPage;