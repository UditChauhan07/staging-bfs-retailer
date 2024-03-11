import React, { useEffect, useState } from "react";
import CustomerSupportPage from "../components/CustomerSupportPage/CustomerSupportPage";
import { FilterItem } from "../components/FilterItem";
import FilterSearch from "../components/FilterSearch";
import { DestoryAuth, GetAuthData, getRetailerBrands, getSupportList } from "../lib/store";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination/Pagination";
import AppLayout from "../components/AppLayout";
import { CloseButton } from "../lib/svg";

let PageSize = 10;
const CustomerSupport = () => {
  const [supportList, setSupportList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [manufacturerFilter, setManufacturerFilter] = useState(null);
  const [retailerFilter, setRetailerFilter] = useState(null);
  const [manufacturerData, setManufacturerData] = useState([]);
  useEffect(() => {
    GetAuthData()
      .then((user) => {
        if (user) {
          let rawData = { accountId: user.data.accountId, key: user.data.x_access_token }
          getRetailerBrands({ rawData }).then((resManu) => {
            setManufacturerData(resManu);
            getSupportList({ user })
              .then((supports) => {
                console.log({ supports });
                if (supports) {
                  setSupportList(supports);
                }
                setLoaded(true);
              })
              .catch((error) => {
                console.error({ error });
              });
          }).catch((err) => {
            console.log({ err });
          })
        } else {
          DestoryAuth()
            .then((res) => {
              console.log({ res });
            })
            .catch((err1) => {
              console.error({ err1 });
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <AppLayout
      filterNodes={
        <>
          <FilterItem
            minWidth="220px"
            label="Manufacturer"
            name="Manufacturer"
            value={manufacturerFilter}
            options={manufacturerData?.map((manufacturer) => ({
              label: manufacturer.Name,
              value: manufacturer.Id,
            }))}
            onChange={(value) => setManufacturerFilter(value)}
          />
          <FilterSearch
            onChange={(e) => setSearchBy(e.target.value)}
            value={searchBy}
            placeholder={"Search by case number"}
            minWidth="201px"
          />

          <button
            className="border px-2.5 py-1 leading-tight d-grid"
            onClick={() => {
              setManufacturerFilter(null);
              setRetailerFilter(null);
              setSearchBy("");
            }}
          >
                    <CloseButton crossFill={'#fff'} height={20} width={20} />
            <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>clear</small>
          </button>
        </>
      }
    >
      <>
        {!loaded ? (
          <Loading />
        ) : (
          <CustomerSupportPage
            data={supportList}
            currentPage={currentPage}
            PageSize={PageSize}
            manufacturerFilter={manufacturerFilter}
            searchBy={searchBy}
            retailerFilter={retailerFilter}
          />
        )}
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={supportList?.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
        {/* <OrderStatusFormSection /> */}
      </>
    </AppLayout>
  );
};

export default CustomerSupport;
