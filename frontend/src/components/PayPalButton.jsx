import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PropTypes from "prop-types";
import { PAYPAL_CLIENT_ID } from "../config";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const PayPalButton = ({ totalPrice }) => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalPrice.toFixed(2),
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            toast.success(t("order.complited"));
            clearCart();
            navigate("/order-summary", {
                state: {
                    buyer: details.payer.name.given_name,
                    total: totalPrice
                }
            });
          });
        }}
        onError={(err) => {
          console.error("Payment error:", err);
          alert("An error occurred during the payment.");
        }}
      />
    </PayPalScriptProvider>
  );
};

PayPalButton.propTypes = {
  totalPrice: PropTypes.number.isRequired,
};

export default PayPalButton;
