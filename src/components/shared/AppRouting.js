import React, { lazy } from "react";
import { Routing } from "./constants/routing";
import {
  BrowserRouter as Router,
  Route,
  // Switch,
  // Redirect,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MainLayout from "../layout/MainLayout";
import NoteExit404 from "../layout/404";

const Order = lazy(()=>import("../pages/orders/Order"))

const Login = lazy(() => import("../pages/login/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Product_new = lazy(() => import("../pages/products/NewProduct"));
const Product = lazy(() => import("../pages/products/Products"));

const Coupon = lazy(() => import("../pages/coupon/Coupon"));

const Store_setting = lazy(() => import("../pages/setting/tabs/Store"));
const Setting_Payments = lazy(() => import("../pages/setting/tabs/Payments"));

const Setting_Shipping = lazy(() => import("../pages/setting/tabs/Shipping"));
const Setting_Tax = lazy(() => import("../pages/setting/tabs/Tax"));
const Categories = lazy(() => import("../pages/categories/Categories"));
const AddCategories = lazy(() => import("../pages/categories/AddCategories"));
const Size_Chart = lazy(() => import("../common/sizechart"));

const routes = [
  {
    path: Routing.Initial,
    component: Login,
    isPrivateRoute: false,
  },
  {
    path: Routing.Login,
    component: Login,
    isPrivateRoute: false,
  },
  {
    path: Routing.Dashboard,
    component: Dashboard,
    isPrivateRoute: true,
  },
  {
    path: Routing.Product,
    component: Product,
    isPrivateRoute: true,
  },
  {
    path: Routing.Coupon,
    component: Coupon,
    isPrivateRoute: true,
  },
  {
    path: Routing.Setting_store,
    component: Store_setting,
    isPrivateRoute: true,
  },
  {
    path: Routing.Setting_Payments,
    component: Setting_Payments,
    isPrivateRoute: true,
  },
  {
    path: Routing.Setting_Shipping,
    component: Setting_Shipping,
    isPrivateRoute: true,
  },
  {
    path: Routing.Setting_Tax,
    component: Setting_Tax,
    isPrivateRoute: true,
  },
  {
    path: Routing.Categories,
    component: Categories,
    isPrivateRoute: true,
  },
  {
    path: Routing.AddCategories,
    component: AddCategories,
    isPrivateRoute: true,
  },
  {
    path: Routing.Order,
    component: Order,
    isPrivateRoute: true,
  },
  {
    path: Routing.Coupon,
    component: Coupon,
    isPrivateRoute: true,
  },
  {
    path: Routing.Product,
    component: Product,
    isPrivateRoute: true,
  },
  {
    path: Routing.Product_new,
    component: Product_new,
    isPrivateRoute: true,
  },
  {
    path: Routing.Product_edit,
    component: Product_new,
    isPrivateRoute: true,
  },
  {
    path: Routing.Size_Chart,
    component: Size_Chart,
    isPrivateRoute: true,
  },

];
const AppRouting = () => {
  return (
    <Router>
      <ToastContainer theme="light" />
      <Routes>
        {routes
          .filter((route) => !route.isPrivateRoute)
          .map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                element={<route.component />}
              />
            );
          })}
      </Routes>
      <Routes>
        {routes
          .filter((route) => route.isPrivateRoute)
          .map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <MainLayout>
                    <route.component />
                  </MainLayout>
                }
              />
            );
          })}
        <Route path="*" element={<NoteExit404 />} />
      </Routes>
    </Router>
  );
};

export default AppRouting;
