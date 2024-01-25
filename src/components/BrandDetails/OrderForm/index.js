import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { GetAuthData, POGenerator } from "../../../lib/store";
import { useBag } from "../../../context/BagContext";
import { useNavigate } from "react-router-dom";
import ModalPage from "../../Modal UI";
import Styles from "../../Modal UI/Styles.module.css";

const SpreadsheetUploader = ({ rawData, showTable = false, setOrderFromModal, orderData = {}, btnClassName = null }) => {
  const { orders, setOrders, setOrderQuantity, addOrder } = useBag();
  const productList = rawData?.data.records || [];
  const discount = rawData?.discount || {};
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [errorOnlist, setErrorOnList] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const CheckError = (data) => {
    let totalQty = 0;
    let errorCount = data.reduce((accumulator, item) => {
      let productDetails = getProductData(item["Product Code"] || null);
      if (item?.Quantity) {
        let error = !item?.Quantity || !Number.isInteger(item?.Quantity) || item?.Quantity < (productDetails.Min_Order_QTY__c || 0) || !productDetails?.Name;
        // console.log(accumulator);
        return accumulator + (error ? 1 : 0);
      } else {
        totalQty += 1;
      }
      return accumulator;
    }, 0);
    if (totalQty == data.length) {
      setErrorOnList(totalQty);
    } else {
      setErrorOnList(errorCount);
    }
  };
  console.log(errorOnlist, data.length);
  const readFile = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        resolve(sheetData);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsArrayBuffer(file);
    });

    return promise;
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setIsLoading(true);
      const file = event.target.files[0];
      readFile(file).then((data) => {
        setData(data);
        CheckError(data);
      });
    }
  };
  const getProductData = (productCode) => {
    if (!productCode) return {};
    let found = productList.find((item) => item.ProductCode == productCode);
    if (!found) return {};
    if (found?.Category__c === "TESTER") {
      let salesPrice = found.usdRetail__c.includes("$")
        ? (+found.usdRetail__c.substring(1) - (discount?.testerMargin / 100) * +found.usdRetail__c.substring(1)).toFixed(2)
        : (+found.usdRetail__c - (discount?.testerMargin / 100) * +found.usdRetail__c).toFixed(2);
      found.salesPrice = salesPrice;
      found.discount = discount?.testerMargin;
    } else if (found.Category__c === "Samples") {
      let salesPrice = found.usdRetail__c.includes("$")
        ? (+found.usdRetail__c.substring(1) - (discount?.sample / 100) * +found.usdRetail__c.substring(1)).toFixed(2)
        : (+found.usdRetail__c - (discount?.sample / 100) * +found.usdRetail__c).toFixed(2);
      found.salesPrice = salesPrice;
      found.discount = discount?.sample;
    } else {
      let salesPrice = found.usdRetail__c.includes("$")
        ? (+found.usdRetail__c.substring(1) - (discount?.margin / 100) * +found.usdRetail__c.substring(1)).toFixed(2)
        : (+found.usdRetail__c - (discount?.margin / 100) * +found.usdRetail__c).toFixed(2);
      found.salesPrice = salesPrice;
      found.discount = discount?.margin;
    }
    return found;
  };
  const submitForm = () => {
    setOrders({});
    GetAuthData()
      .then((user) => {
        let orderList = [];
        let orderType = "Wholesale Number";
        let productCount = 0;
        data.map((element) => {
          if (element.Quantity && Number.isInteger(element?.Quantity)) {
            let product = getProductData(element["Product Code"]);
            if (product?.Id && element?.Quantity >= (product.Min_Order_QTY__c || 0)) {
              productCount++;
              if (product.Category__c == "PREORDER") orderType = "Pre Order";
              let item = {};
              let discountAmount = discount?.margin;
              if (product.Category__c === "TESTER") {
                let salesPrice = product.usdRetail__c.includes("$")
                  ? (+product.usdRetail__c.substring(1) - (discount?.testerMargin / 100) * +product.usdRetail__c.substring(1)).toFixed(2)
                  : (+product.usdRetail__c - (discount?.testerMargin / 100) * +product.usdRetail__c).toFixed(2);
                item.price = salesPrice;
                item.discount = discount?.testerMargin;
                discountAmount = discount?.testerMargin;
              } else if (product.Category__c === "Samples") {
                let salesPrice = product.usdRetail__c.includes("$")
                  ? (+product.usdRetail__c.substring(1) - (discount?.sample / 100) * +product.usdRetail__c.substring(1)).toFixed(2)
                  : (+product.usdRetail__c - (discount?.sample / 100) * +product.usdRetail__c).toFixed(2);
                item.price = salesPrice;
                item.discount = discount?.sample;
                discountAmount = discount?.sample;
              } else {
                let salesPrice = product.usdRetail__c.includes("$")
                  ? (+product.usdRetail__c.substring(1) - (discount?.margin / 100) * +product.usdRetail__c.substring(1)).toFixed(2)
                  : (+product.usdRetail__c - (discount?.margin / 100) * +product.usdRetail__c).toFixed(2);
                item.price = salesPrice;
                item.discount = discount?.margin;
              }
              item.ProductCode = element["Product Code"];
              item.qty = element["Quantity"];
              addOrder(product, element["Quantity"], discount);
            }
          }
        });
        if (productCount) {
          navigate("/my-bag");
          let currentUrl = window.location.href;
          let urlSplit = currentUrl.split("/product");
          let url = urlSplit[0] + "/my-bag";
          console.log({ url });
        } else {
          alert("Product list not found");
        }
      })
      .catch((error) => {
        console.error({ error });
      });
  };
  useEffect(() => {
    if (errorOnlist > 0) {
      setOpenModal(true);
    }
  }, [errorOnlist]);
  if (!showTable) {
    return (
      <div>
        {/* <input type="file" ref={fileInputRef} accept=".xlsx,.xls" onChange={handleFileChange} /> */}
        <form className="d-flex justify-content-between">
          <input type="file" ref={fileInputRef} accept=".csv" onChange={handleFileChange} />
          <input
            type="reset"
            value={"reset"}
            className={btnClassName}
            onClick={() => {
              setData([]);
              setIsLoading(false);
              setErrorOnList(0);
            }}
          />
        </form>
        <div>{errorOnlist > 0 && errorOnlist !== data.length&& <p className="text-start mt-2 text-danger">Highlighted rows have issues in their given quantity. Upload Again or Move further with correct rows.</p>}</div>
        <div>{errorOnlist > 0 && errorOnlist === data.length&& <p className="text-start mt-2 text-danger">No Data Found.</p>}</div>
        <div>
          {openModal && errorOnlist === data.length ? (
            <ModalPage
              open
              content={
                <>
                  <div style={{ maxWidth: "309px" }}>
                    <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                    <p className={` ${Styles.ModalContent} tracking-[1.2px] leading-[20px]`}>No Data Found </p>
                    <div className="d-flex justify-content-center">
                      <button className={`${Styles.modalButton}`} onClick={() => setOpenModal(false)}>
                        OK
                      </button>
                    </div>
                  </div>
                </>
              }
              onClose={() => {
                setOpenModal(false);
              }}
            />
          ) : null}
        </div>
        {openModal && errorOnlist > 0 && errorOnlist !== data.length&& (
          <ModalPage
            open
            content={
              <>
                <div style={{ maxWidth: "309px" }}>
                  <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                  <p className={` ${Styles.ModalContent} tracking-[1.2px] leading-[20px]`}>Highlighted rows have issues in their given quantity. </p>
                  <p className={` ${Styles.ModalContent} tracking-[1.2px] leading-[20px]`}>Upload Again or Move further with correct rows.</p>
                  <div className="d-flex justify-content-center">
                    <button className={`${Styles.modalButton}`} onClick={() => setOpenModal(false)}>
                      OK
                    </button>
                  </div>
                </div>
              </>
            }
            onClose={() => {
              setOpenModal(false);
            }}
          />
        )}
        {isLoading && (
          <>
            <table className="table table-hover text-start">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Product Code</th>
                  <th>Product Category</th>
                  <th>Product UPC</th>
                  <th>List Price</th>
                  <th>Sale Price</th>
                  <th>Min Qty</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  let productDetails = getProductData(item["Product Code"] || null);
                  if (item?.Quantity) {
                    let error = !item?.Quantity || !Number.isInteger(item?.Quantity) || item?.Quantity < (productDetails.Min_Order_QTY__c || 0) || !productDetails?.Name;
                    return (
                      <tr key={index}>
                        <td style={error ? { background: "red", color: "#fff" } : {}}>{productDetails?.Name || "---"}</td>
                        <td style={error ? { background: "red", color: "#fff" } : {}}>{productDetails?.ProductCode || item["Product Code"]}</td>
                        <td style={error ? { background: "red", color: "#fff" } : {}}>{productDetails?.Category__c || "No Category"}</td>
                        <td style={error ? { background: "red", color: "#fff" } : {}}>{productDetails?.ProductUPC__c || item["ProductUPC"]}</td>
                        <td style={error ? { background: "red", color: "#fff" } : {}}>{productDetails?.usdRetail__c || "---"}</td>
                        <td style={error ? { background: "red", color: "#fff" } : {}}>${productDetails?.salesPrice || "---"}</td>
                        <td style={error ? { background: "red", color: "#fff" } : {}}>{productDetails?.Min_Order_QTY__c || 0}</td>
                        {/* <td><div className='Style_ButtonControl__-vuDew-[85px] h-[27px] flex '><span className='px-[8px] h-full bg-[#f8fafb] border border-solid border-black' style={(!item?.Quantity || Number.isInteger(item?.Quantity) || !productDetails?.Name) ? {} : { background: '#FFC1C3' }}>-</span><input className='w-[25px] text-center text-[12px] leading-tight appearance-none border-t-[1px] border-b-[1px] border-solid border-black' value={item?.Quantity || 0} readOnly /><span className='px-[8px] h-full bg-[#f8fafb] border border-solid border-black' style={(!item?.Quantity || Number.isInteger(item?.Quantity) || !productDetails?.Name) ? {} : { background: '#FFC1C3' }}>+</span></div></td> */}
                        <td style={error ? { background: "red", color: "#fff" } : {}}>{item?.Quantity || 0}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
            {errorOnlist && data.length > 0 && errorOnlist == data.length && (
              <div className="flex flex-column justify-center items-center py-4 w-full lg:min-h-[300px] xl:min-h-[380px]">
                <div>Products with zero quantity are uploaded! </div>
                <div className="mt-3">No Data Found.</div>
              </div>
            )}
            <div className="d-flex justify-content-center">
              <button className={btnClassName} onClick={submitForm}>
                Submit
              </button>
              <button
                style={{
                  color: "#000",
                  fontFamily: "Montserrat",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  letterSpacing: "1.4px",
                  width: "100px",
                  height: "30px",
                  backgroundColor: "#fff",
                  border: "1px solid #000",
                  margin: "0 2rem",
                  textTransform: "uppercase",
                }}
                onClick={() => setOrderFromModal(false)}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <input type="file" ref={fileInputRef} accept=".xlsx,.xls" onChange={handleFileChange} />
        <table>
          <thead>
            <tr>
              {Object.keys(data[0] || []).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default SpreadsheetUploader;
