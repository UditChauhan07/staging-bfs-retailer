import React, { useEffect, useState } from "react";
import MyRetailers from "../components/My Retailers/MyRetailers";
import { FilterItem } from "../components/FilterItem";
import { useManufacturer } from "../api/useManufacturer";
import { useRetailersData } from "../api/useRetailersData";
import FilterSearch from "../components/FilterSearch";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const MyRetailersPage = () => {
  const { data: manufacturers } = useManufacturer();
  const [searchParams] = useSearchParams();
  const manufacturerId = searchParams.get("manufacturerId");
  const { data, isLoading } = useRetailersData();
  const [manufacturerFilter, setManufacturerFilter] = useState(manufacturerId);
  const [sortBy, setSortBy] = useState();
  const [searchBy, setSearchBy] = useState("");

  useEffect(() => {
    if (!manufacturerId) {
      setManufacturerFilter(null);
    } else {
      setManufacturerFilter(manufacturerId);
    }
  }, [manufacturerId]);
  const navigate = useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem("Name");
    if (!userData) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Layout>
        <div>
          <div className="col-12">
            <div className="filter-container  ">
              <FilterItem
                label="Sort by"
                value={sortBy}
                options={[
                  {
                    label: "A-Z",
                    value: "a-z",
                  },
                  {
                    label: "Z-A",
                    value: "z-a",
                  },
                ]}
                onChange={(value) => {
                  setSortBy(value);
                }}
              />
              <FilterItem
                minWidth="220px"
                label="Manufacturer"
                value={manufacturerFilter}
                options={manufacturers?.data?.map((manufacturer) => ({
                  label: manufacturer.Name,
                  value: manufacturer.Id,
                }))}
                onChange={(value) => setManufacturerFilter(value)}
              />
              <FilterSearch onChange={(e) => setSearchBy(e.target.value)} value={searchBy} placeholder={"Search by account"} minWidth={"167px"} />
              <button
                className="border px-2.5 py-1 leading-tight"
                onClick={() => {
                  setSortBy(null);
                  setManufacturerFilter(null);
                  setSearchBy("");
                }}
              >
                CLEAR ALL
              </button>
            </div>
          </div>
          <div>
            <MyRetailers
              pageData={data?.data}
              sortBy={sortBy}
              searchBy={searchBy}
              isLoading={isLoading}
              filterBy={manufacturerFilter ? manufacturers?.data?.find((manufacturer) => manufacturer.Id === manufacturerFilter) : null}
            />
            {/* <OrderStatusFormSection /> */}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MyRetailersPage;
