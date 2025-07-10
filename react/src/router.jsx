import { createBrowserRouter } from "react-router-dom";
import Login from "./views/client/Login";
import Signup from "./views/client/Signup";
import Products from "./views/client/Products";
import Services from "./views/client/Services";
import NotFound from "./views/NotFound";
import GuestsLayout from "./components/pages/GuestsLayout";
import UsersLayout from "./components/pages/UsersLayout";
import Home from "./views/client/Home";
import Franchising from "./views/client/Franchising";
import HotDeals from "./views/client/HotDeals";
import Aboutus from "./views/client/Aboutus";
import Dashboard from "./views/admin/Dashboard";
import Appointment from "./views/client/Appointment";
import Statistics from "./views/admin/sections/Statistics";
import Inquiries from "./views/admin/sections/Inquiries";
import Accounts from "./views/admin/sections/Accounts";
import UpdateUser from "./views/admin/sections/Operation/UpdateUser";
import Calendar from "./views/admin/sections/Calendar";
import ManageProduct from "./views/admin/sections/ManageProduct";
import ManageServices from "./views/admin/sections/ManageServices";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestsLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/login/callback",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/",
    element: <UsersLayout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/franchising",
        element: <Franchising />,
      },
      {
        path: "/hotdeals",
        element: <HotDeals />,
      },
      {
        path: "/aboutus",
        element: <Aboutus />,
      },
      {
        path: "/appointment",
        element: <Appointment />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "/dashboard",
            element: <Inquiries />,
          },
          {
            path: "/dashboard/calendar",
            element: <Calendar />,
          },
          {
            path: "/dashboard/inquiries",
            element: <Inquiries />,
          },
          {
            path: "/dashboard/accounts",
            element: <Accounts />,
          },
          {
            path: "/dashboard/statistics",
            element: <Statistics />,
          },
          {
            path: "/dashboard/products",
            element: <ManageProduct />,
          },
          {
            path: "/dashboard/services",
            element: <ManageServices />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
