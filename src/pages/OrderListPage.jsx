import React, { useState } from "react";
import OrderList from "../components/OrderList/OrderList";
import Layout from "../components/Layout/Layout";
import Filters from "../components/OrderList/Filters";
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
    <>
      <Layout>
        <div>
          <div className="col-12">
            <div className="filter-container">
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
            </div>
          </div>
          <div>
            <OrderList
              setSearchShipBy={setSearchShipBy}
              searchShipBy={searchShipBy}
              filterValue={filterValue}
            />
            {/* <OrderStatusFormSection /> */}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OrderListPage;
