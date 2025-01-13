import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProductById, createProduct, updateProduct } from "../utils/api";
import PropTypes from "prop-types";

const ProductForm = ({ mode }) => {
  const { id } = useParams();
  const [productData, setProductData] = useState({
    name_en: "",
    name_pl: "",
    short_description_en: "",
    short_description_pl: "",
    full_description_en: "",
    full_description_pl: "",
    price: "",
    image: null,
  });
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "edit" && id) {
      const loadProduct = async () => {
        try {
          const product = await fetchProductById(id);
          setProductData({
            ...product,
            image: null,// Obrazu nie wczytujemy, dodajemy tylko nowe.
          });
        } catch (err) {
          setError(err.message);
        }
      };
      loadProduct();
    }
  }, [mode, id, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in productData) {
        if (key === "image" && !productData[key]) continue;
        formData.append(key, productData[key]);
    }

    if (mode === "edit") {
        formData.append("product_id", id);
    }

    try {
      if (mode === "add") {
        await createProduct(formData);
      } else if (mode === "edit") {
        await updateProduct(id, formData);
      }
      navigate("/products");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProductData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h1>{mode === "add" ? t("product.add") : t("product.update")}</h1>
      <div className="form-group">
        <label>{t("product.name_en")}</label>
        <input
          type="text"
          name="name_en"
          value={productData.name_en}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t("product.name_pl")}</label>
        <input
          type="text"
          name="name_pl"
          value={productData.name_pl}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t("product.short_description_en")}</label>
        <textarea
          name="short_description_en"
          value={productData.short_description_en}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>{t("product.short_description_pl")}</label>
        <textarea
          name="short_description_pl"
          value={productData.short_description_pl}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>{t("product.full_description_en")}</label>
        <textarea
          name="full_description_en"
          value={productData.full_description_en}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>{t("product.full_description_pl")}</label>
        <textarea
          name="full_description_pl"
          value={productData.full_description_pl}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>{t("product.price")}</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={productData.price}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t("product.image")}</label>
        <input type="file" name="image" onChange={handleImageChange} />
      </div>
      <button type="submit">
        {mode === "add" ? t("product.add") : t("product.update")}
      </button>
    </form>
  );
};

ProductForm.propTypes = {
  mode: PropTypes.oneOf(["add", "edit"]).isRequired,
};

export default ProductForm;