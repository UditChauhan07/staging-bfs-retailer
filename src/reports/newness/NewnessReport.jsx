import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AppLayout from "../../components/AppLayout";
import Loading from "../../components/Loading";
import NewnessReportTable from "../../components/newness report table/NewnessReportTable";
import { useNewnessReport } from "../../api/useNewnessReport";
import { useManufacturer } from "../../api/useManufacturer";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { FilterItem } from "../../components/FilterItem";
import FilterDate from "../../components/FilterDate";
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";
const NewnessReport = () => {
  const navigate = useNavigate();

  let currentDate = new Date().toJSON().slice(0, 10);
  const subtract6Months = (date) => {
    date.setMonth(date.getMonth() - 6);
    return date;
  };
  let past6monthDate = subtract6Months(new Date());
  const initialValues = {
    ManufacturerId__c: "a0O3b00000p7zqKEAQ",
    toDate: currentDate,
    fromDate: past6monthDate.toJSON().slice(0, 10),
    dataDisplay: "quantity",
  };
  const [filter, setFilter] = useState(initialValues);
  const originalApiData = useNewnessReport();
  // console.log({ originalApiData });
  const { data: manufacturers, isLoading, error } = useManufacturer();
  const [newnessData, setNewnessData] = useState({});
  const [loading, setLoading] = useState(false);
  // if (manufacturers?.status !== 200) {
  //   // DestoryAuth();
  // }
  const resetFilter = async() => {
    setLoading(true);
    setFilter(initialValues);
    const result = await originalApiData.fetchNewnessApiData(initialValues);
    setNewnessData(result);
    setLoading(false);
  };
  const PriceDisplay = (value) => {
    return `$${Number(value).toFixed(2)}`;
  };
  const csvData = () => {
    let finalData = [];
    if (newnessData?.AccountList?.length) {
      newnessData?.AccountList?.map((ele) => {
        let temp = {};
        temp["Account_Name"] = ele.AccountName__c;
        temp["Account_Owner_Name"] = ele.OwnerName;
        temp["Account_Status"] = ele.Active_Closed__c;
        temp["Sales_Rep"] = ele.Sales_Rep_Name__c;
        temp["ManufacturerName__c"] = ele.ManufacturerName__c;
        newnessData?.header?.map((item) => {
          temp[`${item.name} Price`] = PriceDisplay(ele[item.name]?.price);
          temp[`${item.name} Quantity`] = ele[item.name]?.qty;
        });
        finalData.push(temp);
      });
    }
    return finalData;
  };
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(csvData());
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `Newness Report ${new Date()}` + fileExtension);
  };
  // console.log(filter);
  useEffect(() => {
    const userData = localStorage.getItem("Name");
    if (!userData) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    sendApiCall();
  }, []);
  const sendApiCall = async () => {
    setLoading(true);
    const result = await originalApiData.fetchNewnessApiData(filter);
    setNewnessData(result);
    setLoading(false);
  };
  return (
    <AppLayout
      filterNodes={
        <>
          <FilterItem
            minWidth="220px"
            label="All Manufacturers"
            value={filter.ManufacturerId__c}
            options={manufacturers?.data?.map((manufacturer) => ({
              label: manufacturer.Name,
              value: manufacturer.Id,
            }))}
            onChange={(value) => setFilter((prev) => ({ ...prev, ManufacturerId__c: value }))}
          />
          <FilterItem
            label="Qty/price"
            value={filter.dataDisplay}
            options={[
              {
                label: "Quantity",
                value: "quantity",
              },
              {
                label: "Price",
                value: "price",
              },
            ]}
            onChange={(value) => {
              setFilter((prev) => ({
                ...prev,
                dataDisplay: value,
              }));
            }}
          />
          {/* First Calender Filter-- from date */}
          <FilterDate
            onChange={(e) => {
              setFilter((prev) => ({
                ...prev,
                fromDate: e.target.value,
              }));
            }}
            value={filter.fromDate}
            label={"start date : "}
            minWidth="95px"
          />
          {/* Second Calender Filter -- to date */}
          <FilterDate
            onChange={(e) => {
              setFilter((prev) => ({
                ...prev,
                toDate: e.target.value,
              }));
            }}
            value={filter.toDate}
            label={"end date :"}
            minWidth="95px"
          />
          <div className="d-flex gap-3">
            <button className="border px-2.5 py-1 leading-tight" onClick={sendApiCall}>
              APPLY
            </button>
            <button className="border px-2.5 py-1 leading-tight" onClick={resetFilter}>
              CLEAR ALL
            </button>
          </div>
          <button className="border px-2.5 py-1 leading-tight" onClick={exportToExcel}>
            EXPORT
          </button>
        </>
      }
    >
      {loading ? <Loading height={"70vh"} /> : <NewnessReportTable newnessData={newnessData} dataDisplay={filter.dataDisplay} />}
    </AppLayout>
  );
};

export default NewnessReport;
