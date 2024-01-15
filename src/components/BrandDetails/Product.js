import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import Accordion from "./Accordion/Accordion";
import FilterPage from "./Accordion/FilterPage";
import TopNav from "../All Headers/topNav/TopNav";
import LogoHeader from "../All Headers/logoHeader/LogoHeader";
import Header from "../All Headers/header/Header";
import HelpSection from "../Footer/HelpSection";
import Footer from "../Footer/Footer";
import { useProductList } from "../../api/useProductList";
import { useAuth } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { FilterItem } from "../FilterItem";
import FilterSearch from "../FilterSearch";
import ModalPage from "../Modal UI";
import { useBag } from "../../context/BagContext";
import { fetchBeg } from "../../lib/store";
import Styles from "../Modal UI/Styles.module.css";
import { BackArrow } from "../../lib/svg";
const groupBy = function (xs, key) {
  return xs?.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function Product() {
  const [emptyBag, setEmptyBag] = useState(false);
  const { orderQuantity } = useBag();
  const { user } = useAuth();
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [productTypeFilter, setProductTypeFilter] = useState("Wholesale");
  const [sortBy, setSortBy] = useState();
  const [searchBy, setSearchBy] = useState("");
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);
  const [alert, setAlert] = useState(0);
  const [testerInBag, setTesterInBag] = useState(false);
  const { data, isLoading } = useProductList({
    key: user?.data.access_token,
    Sales_Rep__c: user?.data.Sales_Rep__c,
    Manufacturer: localStorage.getItem("ManufacturerId__c"),
    AccountId__c: localStorage.getItem("AccountId__c"),
  });
  const brandName = data?.data?.records?.[0]?.ManufacturerName__c;

  const groupProductDataByCategory = (productData) => {
    const groupedData = groupBy(productData || [], "Category__c");

    const tester = [...(groupedData["TESTER"] || [])];
    delete groupedData["TESTER"];
    const samples = [...(groupedData["Samples"] || [])];
    delete groupedData["Samples"];

    if (tester?.length) {
      groupedData["TESTER"] = tester;
    }
    if (samples?.length) {
      groupedData["Samples"] = samples;
    }

    return groupedData;
  };

  const formattedData = useMemo(() => groupProductDataByCategory(data?.data?.records), [data?.data?.records]);

  const formattedFilterData = useMemo(() => {
    let finalFilteredProducts = { ...formattedData };

    if (categoryFilters?.length) {
      let newData = {};
      Object.keys(finalFilteredProducts)?.forEach((key) => {
        if (categoryFilters?.includes(key)) {
          newData[key] = finalFilteredProducts[key];
        }
      });
      finalFilteredProducts = { ...newData };
    }

    if (productTypeFilter) {
      let newData = {};
      Object.keys(finalFilteredProducts)?.forEach((key) => {
        if (productTypeFilter === "Pre-order") {
          if (key === "PREORDER") {
            newData[key] = finalFilteredProducts[key];
          }
        } else {
          if (key !== "PREORDER") {
            newData[key] = finalFilteredProducts[key];
          }
        }
      });
      finalFilteredProducts = { ...newData };
    }

    if (searchBy) {
      let newData = {};
      const filteredProductsArray = Object.values(finalFilteredProducts)
        ?.flat()
        ?.filter((value) => {
          return value.Name.toLowerCase().includes(searchBy?.toLowerCase());
        });
      newData = groupProductDataByCategory(filteredProductsArray);
      finalFilteredProducts = { ...newData };
    }

    if (sortBy === "Price: Low To High") {
      let newData = {};
      Object.keys(finalFilteredProducts)?.forEach((key) => {
        const value = finalFilteredProducts[key];

        value?.sort((a, b) => {
          return +a?.usdRetail__c?.replace("$", "") - +b?.usdRetail__c?.replace("$", "");
        });
      });
    }

    if (sortBy === "Price: High To Low") {
      let newData = {};
      Object.keys(finalFilteredProducts)?.forEach((key) => {
        const value = finalFilteredProducts[key];
        value?.sort((a, b) => +b?.usdRetail__c?.replace("$", "") - +a?.usdRetail__c?.replace("$", ""));
      });
    }

    return finalFilteredProducts;
  }, [formattedData, categoryFilters, productTypeFilter, sortBy, searchBy]);

  useEffect(() => {
    if (!(localStorage.getItem("ManufacturerId__c") && localStorage.getItem("AccountId__c"))) {
      setRedirect(true);
    }
  }, []);
  const redirecting = () => {
    setTimeout(() => {
      navigate("/my-retailers");
    }, 2000);
    // setRedirect(false);
  };
  const generateOrderHandler = () => {
    let begValue = fetchBeg();
    if (begValue?.Account?.id && begValue?.Manufacturer?.id && Object.values(begValue.orderList).length > 0) {
      let bagPrice = 0;
      let bagTesterPrice = 0;
      Object.values(begValue.orderList).map((product) => {
        let productPriceStr = product.product.usdRetail__c;
        let productQuantity = product.quantity;
        let productCategories = product.product.Category__c;
        let productPrice = 0;
        let splitPrice = productPriceStr.split("$");
        if (splitPrice.length == 2) {
          productPrice = parseFloat(splitPrice[1]);
        } else {
          productPrice = parseFloat(splitPrice[0]);
        }
        if (productCategories && productCategories.toUpperCase() === "TESTER") {
          console.log(productPrice * productQuantity - (productPrice * productQuantity * product.discount.testerMargin) / 100);
          bagTesterPrice += productPrice * productQuantity - (productPrice * productQuantity * product.discount.testerMargin) / 100;
          bagPrice += bagTesterPrice;
          setTesterInBag(true);
        } else if (productCategories && productCategories.toUpperCase() === "SAMPLES") {
          bagPrice += productPrice * productQuantity - (productPrice * productQuantity * product.discount.sample) / 100;
        } else {
          bagPrice += productPrice * productQuantity - (productPrice * productQuantity * product.discount.margin) / 100;
        }
      });
      setAlert(0);
      console.log("begValue", begValue);
      if (data.discount.MinOrderAmount > bagPrice) {
        setAlert(1);
      } else {
        if (testerInBag && data.discount.testerproductLimit > bagPrice) {
          setAlert(2);
        } else {
          navigate("/my-bag");
        }
      }
      setEmptyBag(false);
    } else {
      setEmptyBag(true);
      setAlert(0);
    }
  };
  useEffect(() => {
    setEmptyBag(false);
  }, []);
  return (
    <>
      {redirect ? (
        <ModalPage
          open
          content={
            <>
              <div style={{ maxWidth: "309px" }}>
                <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                <p className={` ${Styles.ModalContent}`}>
                  Data is not available for selected Account and Manufacturer.
                  {/* No Data available */}
                  <br />
                </p>
                <p>Redirecting to My Retailers page...</p>
                {redirect ? redirecting() : null}
                <div className="d-flex justify-content-center"></div>
              </div>
            </>
          }
          onClose={() => setRedirect(false)}
        />
      ) : (
        <div className="container p-0 ">
          {alert == 1 && (
            <ModalPage
              open
              content={
                <>
                  <div style={{ maxWidth: "309px" }}>
                    <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                    <p className={` ${Styles.ModalContent}`}>Please Select Products of Minimum Order Amount</p>
                    <div className="d-flex justify-content-center">
                      <button className={`${Styles.modalButton}`} onClick={() => setAlert(0)}>
                        OK
                      </button>
                    </div>
                  </div>
                </>
              }
              onClose={() => setAlert(0)}
            />
          )}
          {alert == 2 && (
            <ModalPage
              open
              content={
                <>
                  <div style={{ maxWidth: "309px" }}>
                    <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                    <p className={` ${Styles.ModalContent}`}>Please Select Tester Product of Minimum Order Amount</p>
                    <div className="d-flex justify-content-center">
                      <button className={`${Styles.modalButton}`} onClick={() => setAlert(0)}>
                        OK
                      </button>
                    </div>
                  </div>
                </>
              }
              onClose={() => {
                setAlert(0);
              }}
            />
          )}
          {emptyBag && (
            <ModalPage
              open
              content={
                <>
                  <div style={{ maxWidth: "309px" }}>
                    <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                    <p className={` ${Styles.ModalContent}`}>No Product in your bag</p>
                    <div className="d-flex justify-content-center">
                      <button className={`${Styles.modalButton}`} onClick={() => setEmptyBag(false)}>
                        OK
                      </button>
                    </div>
                  </div>
                </>
              }
              onClose={() => {
                setEmptyBag(false);
              }}
            />
          )}

          <div className="row p-0 m-0 d-flex flex-column justify-content-around align-items-center col-12">
            {/* TopNav */}
            <div className="col-12">
              <TopNav />
            </div>
            <hr className="hrBgColor"></hr>
            {/* all headers */}
            <div className="col-12">
              <LogoHeader />
              <Header />
              <div className="filter-container">
                <FilterItem
                  label="Sort by"
                  value={sortBy}
                  options={[
                    {
                      label: "Price: High To Low",
                      value: "Price: High To Low",
                    },
                    {
                      label: "Price: Low To High",
                      value: "Price: Low To High",
                    },
                  ]}
                  onChange={(value) => {
                    setSortBy(value);
                  }}
                />
                <FilterItem
                  label="Product type"
                  value={productTypeFilter}
                  options={[
                    {
                      label: "Wholesale",
                      value: "Wholesale",
                    },
                    {
                      label: "PREORDER",
                      value: "Pre-order",
                    },
                  ]}
                  onChange={(value) => {
                    setProductTypeFilter(value);
                  }}
                />
                <FilterSearch onChange={(e) => setSearchBy(e.target.value)} value={searchBy} placeholder={"Enter Product name"} minWidth="179px" />
                <button
                  className="border px-2.5 py-1 leading-tight"
                  onClick={() => {
                    setSortBy("Price: High To Low");
                    setSearchBy("");
                    setProductTypeFilter("Wholesale");
                  }}
                >
                  CLEAR ALL
                </button>
              </div>
            </div>
            {/* brand list accordion */}
            <div className="col-12">
              {isLoading ? (
                <Loading height={"70vh"} />
              ) : (
                <div>
                  <section className="py-[34px]">
                    <div className="">
                      <div className={styles.BrandTopShow}>
                        <h4 className="flex justify-center items-center gap-4 uppercase font-[Montserrat-500] tracking-[2.20px]">
                          <button
                            onClick={() => {
                              navigate("/my-retailers");
                            }}
                          >
                            <BackArrow />
                          </button>
                          {brandName}
                        </h4>

                        <p>
                          <span>Account</span>: {localStorage.getItem("Account")}
                        </p>
                      </div>

                      <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-12">
                        
                            <FilterPage
                              data={data}
                              formattedData={formattedData}
                              setCategoryFilters={setCategoryFilters}
                              categoryFilters={categoryFilters}
                              setProductTypeFilter={setProductTypeFilter}
                              productTypeFilter={productTypeFilter}
                              setSortBy={setSortBy}
                              sortBy={sortBy}
                            ></FilterPage>
                        
                        </div>

                        <div className="col-lg-9 col-md-8 col-sm-12 ">
                          <div
                            className={`${styles.AccorBorder} overflow-auto`}
                            style={{
                              height: "64vh",
                              border: "1px dashed black",
                            }}
                          >
                            <Accordion data={data} formattedData={formattedFilterData}></Accordion>
                          </div>
                          <div className={`${styles.TotalSide} `}>
                            <h4>Total Number of Products : {orderQuantity}</h4>
                            <button
                              onClick={() => {
                                generateOrderHandler();
                              }}
                            >
                              Generate Order
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
            {/* footer */}
            <div className="col-12">
              <HelpSection />
            </div>
            <div className="col-12">
              <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Product;
