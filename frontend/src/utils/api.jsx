
import { jwtDecode } from "jwt-decode";
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

export const createProduct = async (formData) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create product");
  }

  return response.json();
};

export const updateProduct = async (productId, formData) => {
  const response = await fetch(`${BASE_URL}/products/edit`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update product");
  }

  return response.json();
};

export const deleteProduct = async (productId, token) => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete product');
  }

  return response.json();
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
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      alert("Your session has expired. Please log in again.");
      throw new Error("Token expired");
    }

    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    return response.json();
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    throw error;
  }
};

export const fetchComments = async (productId) => {
  const response = await fetch(`${BASE_URL}/comments/products/${productId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};

export const postComment = async (comment, token) => {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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

export const requestPasswordReset = async (email) => {
  const response = await fetch(`${BASE_URL}/auth/reset-password-request/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to send password reset request');
  }

  return response.json();
};

export const resetPassword = async (data) => {
  const response = await fetch(`${BASE_URL}/auth/reset-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to reset password');
  }

  return response.json();
};


export const updateProfile = async (data, token) => {
  const response = await fetch(`${BASE_URL}/auth/update-profile/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error details from server:", error);
    throw new Error(error.detail || "Failed to update profile");
  }

  return response.json();
};


export const updatePassword = async (data, token) => {
  const response = await fetch(`${BASE_URL}/auth/update-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update password');
  }

  return response.json();
};

export const deleteAccount = async (data, token) => {
  const response = await fetch(`${BASE_URL}/auth/delete-account/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete account");
  }

  return response.json();
};

