import React, { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import Loading from "../../components/Loading";
import ComparisonReportTable from "../../components/comparison report table/ComparisonReportTable";
import { useComparisonReport } from "../../api/useComparisonReport";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { FilterItem } from "../../components/FilterItem";
import { useManufacturer } from "../../api/useManufacturer";
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";
const date = new Date();
const ComparisonReport = () => {
  const initialValues = {
    ManufacturerId__c: "a0O3b00000p7zqKEAQ",
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
  const { data: manufacturers } = useManufacturer();
  const [filter, setFilter] = useState(initialValues);
  const originalApiData = useComparisonReport();
  const [apiData, setApiData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  //csv Data
  let csvData = [];
  if (apiData?.data?.length) {
    apiData?.data?.map((ele) => {
      return csvData.push({
        AccountName: ele.AccountName,
        Estee_Lauder_Number__c: ele.Estee_Lauder_Number__c,
        Sales_Rep__c: ele.Sales_Rep__c,
        retail_revenue__c: `$${Number(ele.retail_revenue__c).toFixed(2)}`,
        Whole_Sales_Amount: `$${Number(ele.Whole_Sales_Amount).toFixed(2)}`,
      });
    });
  }
  useEffect(() => {
    sendApiCall();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `Comparison Report ${new Date()}` + fileExtension);
  };
  const resetFilter = async () => {
    setIsLoading(true);
    const result = await originalApiData.fetchComparisonReportAPI(initialValues);
    setApiData(result);
    setFilter(() => initialValues);
    setIsLoading(false);
  };
  const sendApiCall = async () => {
    setIsLoading(true);
    const result = await originalApiData.fetchComparisonReportAPI(filter);
    setApiData(result);
    setIsLoading(false);
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
            minWidth="220px"
            label="Months"
            value={filter.month}
            options={apiData?.date?.monthList?.map((month) => ({
              label: month?.name,
              value: month.value,
            }))}
            onChange={(value) => setFilter((prev) => ({ ...prev, month: value }))}
          />
          <FilterItem
            minWidth="220px"
            label="Year"
            value={filter.year}
            options={apiData?.date?.yearList?.map((year) => ({
              label: year?.name,
              value: year.value,
            }))}
            onChange={(value) => setFilter((prev) => ({ ...prev, year: value }))}
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
      {!isLoading ? <ComparisonReportTable comparisonData={apiData} /> : <Loading height={"70vh"} />}
    </AppLayout>
  );
};

export default ComparisonReport;
