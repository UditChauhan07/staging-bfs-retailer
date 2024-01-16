import React, { useState } from "react";
import OrderList from "../components/OrderList/OrderList";
import Layout from "../components/Layout/Layout";
import Filters from "../components/OrderList/Filters";
import AppLayout from "../components/AppLayout";
const OrderListPage = () => {
  const [filterValue, onFilterChange] = useState({
    month: "",
    manufacturer: null,
    search: "",
  });

  const [searchShipBy, setSearchShipBy] = useState();

  const handleFilterChange = (filterType, value) => {
    onFilterChange((prev) => {
      const newData = { ...prev };
      newData[filterType] = value;
      return newData;
    });
  };

  return (
    <AppLayout
      filterNodes={
        <Filters
          onChange={handleFilterChange}
          value={filterValue}
          resetFilter={() => {
            onFilterChange({
              manufacturer: null,
              month: "",
              search: "",
            });
            setSearchShipBy("");
          }}
        />
      }
    >
      <OrderList
        setSearchShipBy={setSearchShipBy}
        searchShipBy={searchShipBy}
        filterValue={filterValue}
      />
      {/* <OrderStatusFormSection /> */}
    </AppLayout>
  );
};

export default OrderListPage;
