import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchProducts, getCurrentUser, deleteProduct } from "../utils/api";
import { useTranslation } from "react-i18next";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserAndProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await getCurrentUser(token);
          setCurrentUser(user);
        }
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to load products or user", err);
      }
    };

    loadUserAndProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleAddProduct = () => {
    navigate("/products/add");
  };

  const handleEditProduct = (productId) => {
    navigate(`/products/edit/${productId}`);
  };
  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteProduct(productId, token);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Failed to delete product:", err.message);
    }
  };
  

  return (
    <div>
      {currentUser?.role === "admin" && (
        <button onClick={handleAddProduct} className="add-product-btn">
          {t("product.add")}
        </button>
      )}

      <div className="product-list">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => handleEditProduct(product.id)}
            onDelete={() => handleDeleteProduct(product.id)}
            isAdmin={currentUser?.role === "admin"}
          />
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
