import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { buyer, total } = location.state || {};

  if (!buyer || !total) {
    return (
      <div>
        <p>{t("order.invalid_data")}</p>
        {setTimeout(() => navigate("/"), 3000)}
      </div>
    );
}

return (
    <div className="order-summary">
        <div className="order-card">
            <h1>{t("order.summary")}</h1>
            <p>{t("order.thanks_1")}{buyer}{t("order.thanks_2")}</p>
            <p>{t("order.total")} ${total.toFixed(2)}</p>
        </div>
    </div>
  );
};

export default OrderSummary;
