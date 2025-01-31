import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const ProductList = lazy(() => import('../pages/ProductList'));
const ErrorPage = lazy(() => import('../pages/ErrorPage'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ProductDetails = lazy(() => import('../components/ProductDetails'));
const CartPage = lazy(() => import('../pages/CartPage'));
const ProductForm = lazy(() => import('../components/ProductForm'));
const UserProfile = lazy(() => import('../pages/UserProfile'));
const RequestPasswordReset = lazy(() => import('../pages/RequestPasswordReset'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const OrderSummary = lazy(() => import('../pages/OrderSummary'));

const routes = [
  { path: '/', element: <Home /> },
  { path: '/products', element: <ProductList /> },
  { path: '/products/add', element: <ProductForm mode="add" /> },
  { path: '/products/edit/:id', element: <ProductForm mode="edit" /> },
  { path: '/product/:id', element: <ProductDetails /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/cart', element: <CartPage /> },
  { path: '/order-summary', element: <OrderSummary /> },
  { path: '/profile', element: <UserProfile /> },
  { path: '/request-password-reset', element: <RequestPasswordReset /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '*', element: <ErrorPage messageKey='error_404' statusCode={404} /> },
];

export default routes;
