import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    if (!isLoggedIn) {
      toast.error(t("login.required"));
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(t("product.added"));
    console.log(t("product.added"));
    console.log(cartItems);
    console.log("count = " + cartItems.length);
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, cartItemsCount: cartItems.length, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => useContext(CartContext);
