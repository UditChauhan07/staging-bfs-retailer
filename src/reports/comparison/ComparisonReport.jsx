import React, { useEffect, useState } from "react";
import FiltersInComparison from "../../components/All Headers/filters/FiltersInComparison";
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
const ComparisonReport = () => {
  const initialValues = {
    ManufacturerId__c: "a0O3b00000p7zqKEAQ",
    month: 6,
    year: 2023,
  };
  const { data: manufacturers } = useManufacturer();
  const [filter, setFilter] = useState(initialValues);
  const originalApiData = useComparisonReport(filter);
  const [apiData, setApiData] = useState(originalApiData || {});

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
    setApiData(originalApiData);
  }, [originalApiData, filter]);
  console.log(apiData);
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `Comparison Report ${new Date()}` + fileExtension);
  };
  const resetFilter = () => {
    setFilter(() => initialValues);
  };
  console.log(filter);
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
            options={originalApiData?.date?.monthList?.map((month) => ({
              label: month?.name,
              value: month.value,
            }))}
            onChange={(value) => setFilter((prev) => ({ ...prev, month: value }))}
          />
          <FilterItem
            minWidth="220px"
            label="Year"
            value={filter.year}
            options={originalApiData?.date?.yearList?.map((year) => ({
              label: year?.name,
              value: year.value,
            }))}
            onChange={(value) => setFilter((prev) => ({ ...prev, year: value }))}
          />

          <button className="border px-2.5 py-1 leading-tight" onClick={resetFilter}>
            CLEAR ALL
          </button>
          <button className="border px-2.5 py-1 leading-tight" onClick={exportToExcel}>
            EXPORT
          </button>
        </>
      }
    >
      {originalApiData?.status === 200 && apiData ? <ComparisonReportTable comparisonData={apiData} /> : <Loading height={"70vh"} />}
    </AppLayout>
  );
};

export default ComparisonReport;
