import React, { useEffect } from "react";
import styles from "./index.module.css";
import { useState } from "react";
import SalesReportTable from "../../sales report table/SalesReportTable";
import ReportName from "../../report name/ReportName";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Loading from "../../Loading";
const Filters = ({ salesReportData, manufacturers }) => {
  let length = 0;
  const [salesData, setSalesData] = useState(salesReportData || []);
  const [filter, setFilter] = useState({
    sortBy: "highest",
    selectedManufacturer: "All Manufacturers",
  });
  const handleManufacturerFilter = () => {
    if (filter.selectedManufacturer === "All Manufacturers") {
      setSalesData([...salesReportData]);
    } else {
      const filteredData = salesReportData.filter((ele) => !ele.ManufacturerName__c.localeCompare(filter.selectedManufacturer));
      setSalesData(filteredData);
    }
  };
  const handleSortFilter = () => {
    if (filter.sortBy === "lowest") {
      salesReportData.map((ele) => ele.Orders.sort((a, b) => a.totalOrders - b.totalOrders));
    } else {
      salesReportData.map((ele) => ele.Orders.sort((a, b) => b.totalOrders - a.totalOrders));
    }
  };
  let csvData = [];
  salesData?.map((ele) =>
    ele.Orders.map((item) =>
      csvData.push({
        ManufacturerName__c: ele.ManufacturerName__c,
        AccountName: item.AccountName,
        AccountRepo: item.AccountRepo,
        JanOrders: item.Jan.items?.length,
        JanAmount: item.Jan.amount,
        FebOrders: item.Feb.items?.length,
        FebAmount: item.Feb.amount,
        MarOrders: item.Mar.items?.length,
        MarAmount: item.Mar.amount,
        AprOrders: item.Apr.items?.length,
        AprAmount: item.Apr.amount,
        MayOrders: item.May.items?.length,
        MayAmount: item.May.amount,
        JunOrders: item.Jun.items?.length,
        JunAmount: item.Jun.amount,
        JulOrders: item.Jul.items?.length,
        JulAmount: item.Jul.amount,
        AugOrders: item.Aug.items?.length,
        AugAmount: item.Aug.amount,
        SepOrders: item.Sep.items?.length,
        SepAmount: item.Sep.amount,
        OctOrders: item.Oct.items?.length,
        OctAmount: item.Oct.amount,
        NovOrders: item.Nov.items?.length,
        NovAmount: item.Nov.amount,
        DecOrders: item.Dec.items?.length,
        DecAmount: item.Dec.amount,
        TotalOrders: item.totalOrders,
        totalAmount: item.totalorderPrice,
      })
    )
  );
  useEffect(() => {
    handleManufacturerFilter();
    handleSortFilter();
  }, [filter.selectedManufacturer, filter.sortBy, salesReportData]);

  const handleSortBy = (e) => {
    setFilter((prev) => ({
      ...prev,
      sortBy: e.target.value,
    }));
  };
  const handleManufacturerChange = (e) => {
    setFilter((prev) => ({
      ...prev,
      selectedManufacturer: e.target.value,
    }));
  };
  const clearFilters = () => {
    setFilter((prev) => ({
      ...prev,
      sortBy: "highest",
      selectedManufacturer: "All Manufacturers",
    }));
  };
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `Sales Report ${new Date()}` + fileExtension);
  };
  length = filter.selectedManufacturer.length <= 10 ? filter.selectedManufacturer.length * 14.5 : filter.selectedManufacturer.length * 12;
  return (
    <>
      <div className={`${styles.heightFix} d-flex bg-black justify-content-center  align-items-center  gap-5 `}>
        {/* all manufactures */}
        <div className="d-flex">
          <select className={`${styles.text} bg-black`} style={{ outline: "none", maxWidth: `${length}px` }} onChange={handleManufacturerChange} value={filter.selectedManufacturer}>
            <option value="All Manufacturers" className={`${styles.option}`}>
              All Manufacturers
            </option>
            ;
            {manufacturers.map((ele) => {
              return (
                <option key={ele} value={ele} className={`${styles.option}`}>
                  {ele}
                </option>
              );
            })}
          </select>
          {/* <img src={"/assets/images/downArrowWhite.svg"} alt="img" /> */}
        </div>
        {/* sort by orders */}
        <select className={`${styles.text} bg-black`} style={{ outline: "none" }} onChange={handleSortBy} value={filter.sortBy}>
          <option value="highest" className={`${styles.option}`}>
            Highest Orders
          </option>
          <option value="lowest" className={`${styles.option}`}>
            Lowest Orders
          </option>
          ;{/* <option value="relevance">Relevance</option>; */}
        </select>
        {/* clear filters */}
        <p className={`m-0  ${styles.text} `}>
          <button style={{ border: "1px solid white", lineHeight: "20px" }} className={`m-0 px-1 ${styles.text} bg-black`} onClick={clearFilters}>
            clear all
          </button>
        </p>
        {/* export excel */}
        <p className={`m-0  ${styles.text}`}>
          <button style={{ border: "1px solid white", lineHeight: "20px" }} className={`m-0 px-1 ${styles.text} bg-black`} onClick={exportToExcel}>
            export
          </button>
        </p>
      </div>
      {/* <ReportName name="Sales Report" /> */}
      {salesData.length ? <SalesReportTable salesData={salesData} /> : <Loading height={"70vh"} />}
    </>
  );
};

export default Filters;
