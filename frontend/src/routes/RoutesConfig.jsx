import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const ProductList = lazy(() => import('../pages/ProductList'));
const ErrorPage = lazy(() => import('../pages/ErrorPage'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ProductDetails = lazy(() => import('../components/ProductDetails'));
const CartPage = lazy(() => import('../pages/CartPage'));

const routes = [
  { path: '/', element: <Home /> },
  {
    path: '/products',
    element: <ProductList />
  },
  { 
    path: '/product/:id',
    element: <ProductDetails />
  },
  { 
    path: '/login', 
    element: <Login /> 
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: "/cart",
    element: <CartPage />
  },
  {
    path: '*', 
    element: <ErrorPage messageKey="error_404" statusCode={404} /> 
  },
];

export default routes;
