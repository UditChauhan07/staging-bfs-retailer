import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import { useNavigate } from "react-router-dom";
import { AuthCheck } from "../lib/store";
import Layout from "../components/Layout/Layout";
import AppLayout from "../components/AppLayout";

const DashboardPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!AuthCheck()) {
      // navigate("/");
    }
  }, []);
  return (
    <AppLayout>
      <Dashboard />
      {/* <OrderStatusFormSection /> */}
    </AppLayout>
  );
};

export default DashboardPage;
