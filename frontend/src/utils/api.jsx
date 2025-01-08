import { BASE_URL } from '../config';

export const fetchProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const products = await response.json();

  return products.map(product => ({
    ...product,
    image: product.image ? `${BASE_URL}/products/images/${product.image}` : null,
  }));
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    const product = await response.json();
    
    return {
      ...product,
      image: product.image ? `${BASE_URL}/products/images/${product.image}` : null,
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

export const registerUser = async (username, email, password) => {
    const response = await fetch(`${BASE_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
    }

    return response.json();
};
  
export const loginUser = async (username, password) => {
    const response = await fetch(`${BASE_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
    }

    return await response.json();
};

export const getCurrentUser = async (token) => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }
  return await response.json();
};

export const fetchComments = async (productId) => {
  const response = await fetch(`${BASE_URL}/comments/products/${productId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};

export const postComment = async (comment, token) => {
  const response = await fetch(`${BASE_URL}/comments`, { // Poprawiony URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Token użytkownika
    },
    body: JSON.stringify(comment),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to post comment');
  }
  return response.json();
};

export const deleteComment = async (commentId, token) => {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete comment');
  }
};
