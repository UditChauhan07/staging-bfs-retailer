import React, { useEffect, useMemo, useState } from "react";
import Styles from "./style.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import OrderListContent from "./OrderListContent";
import { GetAuthData, getOrderList } from "../../lib/store";
import Loading from "../Loading";
import Pagination from "../Pagination/Pagination";

let PageSize = 10;

function OrderList({ filterValue, setSearchShipBy, searchShipBy }) {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  function sortingList(data) {
    data.sort(function (a, b) {
      return new Date(b.CreatedDate) - new Date(a.CreatedDate);
    });
    return data;
  }
  const orderData = useMemo(() => {
    return (
      orders
        // Manufacturer filter
        ?.filter(
          (order) =>
            !filterValue.manufacturer ||
            filterValue.manufacturer === order.ManufacturerId__c
        )
        // Search by account filter
        ?.filter((order) => {
          return (
            !filterValue?.search?.length ||
            order.AccountName?.toLowerCase().includes(
              filterValue?.search?.toLowerCase()
            )
          );
        })
    );
  }, [filterValue, orders]);
  useEffect(() => {
    setLoaded(false);
    GetAuthData()
      .then((response) => {
        getOrderList({
          user: {
            key: response.x_access_token,
            Sales_Rep__c: false ? "00530000005AdvsAAC" : response.Sales_Rep__c,
          },
          month: filterValue.month,
        })
          .then((order) => {
            let sorting = sortingList(order);
            setOrders(sorting);
            setLoaded(true);
          })
          .catch((error) => {
            console.log({ error });
          });
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [filterValue.month]);

  if (!loaded) return <Loading />;

  return (
    <div>
      <section>
        <div className="">
          <div className={Styles.orderMainDiv}>
            <div className={Styles.OrderMainPr}>
              <OrderListContent
                currentPage={currentPage}
                PageSize={PageSize}
                data={orderData}
                setSearchShipBy={setSearchShipBy}
                searchShipBy={searchShipBy}
              />
            </div>
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={orderData.length}
              pageSize={PageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderList;
