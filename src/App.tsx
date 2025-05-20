import "./App.css"
import ProtectedRoute from "./components/protected-route";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/layout";
import DetailsList from "./pages/details-list";
import ProductDetails from "./pages/product-details";
import EditProductPage from "./pages/edit-product";
import { LoginForm } from "./pages/login-page";
import { RouterProvider } from "react-router-dom";
import { RegisterForm } from "./pages/register-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "login", element: <LoginForm /> },
      {path: "register", element: <RegisterForm />},
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DetailsList /> },
          { path: "products/:id", element: <ProductDetails /> },
          { path: "products/:id/edit", element: <EditProductPage /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}