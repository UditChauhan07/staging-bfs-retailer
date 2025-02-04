import React, { useEffect, useMemo, useState } from "react";
import Filters from "../components/OrderList/Filters";
import Styles from "../components/OrderList/style.module.css";
import AppLayout from "../components/AppLayout";
import { GetAuthData, defaultLoadTime, getAllAccountOrders } from "../lib/store";
import Pagination from "../components/Pagination/Pagination";
import OrderListContent from "../components/OrderList/OrderListContent";
import { FilterItem } from "../components/FilterItem";
import LoaderV3 from "../components/loader/v3";
import dataStore from "../lib/dataStore";
import useBackgroundUpdater from "../utilities/Hooks/useBackgroundUpdater";

let PageSize = 10;

const OrderListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shipByText, setShipByText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searchShipBy, setSearchShipBy] = useState();
  const [accountList, setAccountList] = useState([]);
  const [account, setAccount] = useState(null);
  const [filterValue, onFilterChange] = useState({
    month: "",
    manufacturer: null,
    search: "",
  });
  useEffect(() => { }, [filterValue])
  const handleFilterChange = (filterType, value) => {
    orderListHandler(account, filterType == 'month' ? value : filterValue.month)
    onFilterChange((prev) => {
      const newData = { ...prev };
      newData[filterType] = value;
      return newData;
    });
    setCurrentPage(1);

  };

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
            order.AccountName?.toLowerCase()?.includes(
              filterValue?.search?.toLowerCase()
            )
          );
        })
        .filter((order) => {
          if (searchShipBy) {
            const orderItems = order.OpportunityLineItems?.records;
            if (orderItems?.length) {
              return (
                orderItems?.some((item) => {
                  return item.Name?.toLowerCase()?.includes(
                    searchShipBy?.toLowerCase()
                  );
                }) ||
                order.PO_Number__c?.toLowerCase()?.includes(
                  searchShipBy?.toLowerCase()
                )
              );
            } else if (
              order.PO_Number__c?.toLowerCase()?.includes(
                searchShipBy.toLowerCase()
              )
            ) {
              return true;
            }
            return false;
          }
          return true;
        })
    );
  }, [filterValue, orders, searchShipBy]);

  useEffect(() => {
    const handleOrderUppdate = (data) => {
      ;
      let sorting = sortingList(data);
      setOrders(sorting);
    }
    dataStore.subscribe(`/getAllAccountOrders${account ?? ''}${filterValue.month}`, handleOrderUppdate);
    orderListHandler(account, filterValue.month)
    return () => {
      dataStore.unsubscribe(`/getAllAccountOrders${account ?? ''}${filterValue.month}`, handleOrderUppdate);
    };

  }, []);

  useBackgroundUpdater(() => orderListHandler(account, filterValue.month), defaultLoadTime);

  useEffect(() => {
    setShipByText(searchShipBy);
  }, [searchShipBy]);

  const orderListHandler = (accountIds = null, month = null) => {
    setAccount(accountIds)
    setLoaded(false);
    setOrders([]);
    GetAuthData()
      .then(async (response) => {
        setAccountList(response.data.accountList)

        dataStore.getPageData(`/getAllAccountOrders${accountIds ? accountIds : ''}${month}`, () =>
          getAllAccountOrders({
            key: response.data.x_access_token,
            accountIds: JSON.stringify(accountIds || response.data.accountIds),
            month: month,
          }))
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
  };
  console.log(orders , "order")


  return (
    <AppLayout
      filterNodes={
        <>
          {accountList.length > 1 &&
            <FilterItem
              minWidth="220px"
              label="All Store"
              value={account ? account.length ? account[0] : null : null}

              options={[
                { label: "All Store", value: null }, // "All Store" first
                ...[...accountList]
                  .sort((a, b) => a.Name.localeCompare(b.Name)) // Sorting accountList alphabetically
                  .map((month) => ({
                    label: month.Name,
                    value: month.Id,
                  })),
              ]}
              onChange={(value) => {
                if (value) {
                  orderListHandler([value], filterValue.month);
                } else {
                  orderListHandler(null, filterValue.month);
                }
              }}
              name={"Account-menu"}
            />}
          <Filters
            onChange={handleFilterChange}
            
            value={filterValue}
            resetFilter={() => {
              orderListHandler();
              onFilterChange({
                manufacturer: null,
                month: "",
                search: "",
              });
              setAccount();
              setSearchShipBy("");
            }}
          />
        </>
      }
    >
      {!loaded ? (
        <LoaderV3 text={"Loading Order List, Please wait..."} />
      ) : (
        <div>
          <section>
            <div className="">
              <div className={Styles.orderMainDiv}>
                <div className={Styles.OrderMainPr}>
                  <div className={Styles.inorderflex}>
                    <div>
                      <h2>Your Orders</h2>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSearchShipBy(e.target.elements.searchShipBy.value);
                      }}
                    >
                      <div
                        className={`d-flex align-items-center ${Styles.InputControll}`}
                      >
                        <input
                          type="text"
                          name="searchShipBy"
                          onChange={(e) => setShipByText(e.target.value)}
                          value={shipByText}
                          placeholder="Search All Orders"
                        />
                        <button>Search Orders</button>
                      </div>
                    </form>
                  </div>
                  <OrderListContent
                    data={orderData?.slice(
                      (currentPage - 1) * PageSize,
                      currentPage * PageSize
                    )}
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
      )}
    </AppLayout>
  );
};

export default OrderListPage;
