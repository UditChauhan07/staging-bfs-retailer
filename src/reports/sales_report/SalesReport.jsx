import React, { useEffect, useMemo, useState } from "react";
import useSalesReport from "../../api/useSalesReport";
import { useNavigate } from "react-router";
import AppLayout from "../../components/AppLayout";
import { FilterItem } from "../../components/FilterItem";
import { useManufacturer } from "../../api/useManufacturer";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import SalesReportTable from "../../components/sales report table/SalesReportTable";
import Loading from "../../components/Loading";
import FilterDate from "../../components/FilterDate";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const SalesReport = () => {
  const { data: manufacturers } = useManufacturer();
  let currentDate = new Date().toJSON().slice(0, 10);
  const subtract6Months = (date) => {
    date.setMonth(date.getMonth() - 6);
    return date.toJSON().slice(0, 10);
  };
  let past6monthDate = subtract6Months(new Date());
  const [startDate, setStartDate] = useState(past6monthDate);
  const [endDate, setEndDate] = useState(currentDate);
  const salesReportApi = useSalesReport();
  const [isLoading, setIsLoading] = useState(false);
  const [manufacturerFilter, setManufacturerFilter] = useState();
  const [highestOrders, setHighestOrders] = useState(true);
  const [salesReportData, setSalesReportData] = useState([]);

  const filteredSalesReportData = useMemo(() => {
    let filtered = salesReportData.filter((ele) => {
      return !manufacturerFilter || !ele.ManufacturerName__c.localeCompare(manufacturerFilter);
    });

    if (highestOrders) {
      filtered = filtered?.map((ele) => {
        const Orders = ele.Orders.sort((a, b) => b.totalOrders - a.totalOrders);
        return {
          ...ele,
          Orders,
        };
      });
    } else {
      filtered = filtered?.map((ele) => {
        const Orders = ele.Orders.sort((a, b) => a.totalOrders - b.totalOrders);
        return {
          ...ele,
          Orders,
        };
      });
    }
    return filtered;
  }, [manufacturerFilter, salesReportData, highestOrders]);

  const csvData = useMemo(() => {
    return filteredSalesReportData?.map((ele) =>
      ele.Orders.map((item) => ({
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
      }))
    );
  }, [filteredSalesReportData, manufacturerFilter]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `Sales Report ${new Date()}` + fileExtension);
  };
  const resetFilter = () => {
    setManufacturerFilter(null);
    setHighestOrders(true);
    getSalesData(past6monthDate,currentDate);
    setStartDate(past6monthDate);
    setEndDate(currentDate);
  };

  const navigate = useNavigate();

  const getSalesData = async (startDate, endDate) => {
    setIsLoading(true);
    const result = await salesReportApi.salesReportData({ startDate, endDate });
    setSalesReportData(result.data.data);
    setIsLoading(false);
  };
  // console.log("salesReportData", salesReportData);
  useEffect(() => {
    const userData = localStorage.getItem("Name");
    if (userData) {
      getSalesData();
    } else {
      navigate("/");
    }
  }, []);
  const sendApiCall = () => {
    getSalesData(startDate, endDate);
  };

  return (
    <AppLayout
      filterNodes={
        <>
          <FilterItem
            minWidth="220px"
            label="All Manufacturers"
            value={manufacturerFilter}
            options={manufacturers?.data?.map((manufacturer) => ({
              label: manufacturer.Name,
              value: manufacturer.Name,
            }))}
            onChange={(value) => setManufacturerFilter(value)}
          />
          <FilterItem
            minWidth="220px"
            label="Lowest Orders"
            value={highestOrders}
            options={[
              {
                label: "Highest Orders",
                value: true,
              },
              {
                label: "Lowest Orders",
                value: false,
              },
            ]}
            onChange={(value) => setHighestOrders(value)}
          />
          {/* First Calender Filter-- start date */}
          <FilterDate
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            value={startDate}
            label={"start date : "}
            minWidth="95px"
          />
          {/* Second Calender Filter -- end date */}
          <FilterDate
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            value={endDate}
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
      {filteredSalesReportData?.length && !isLoading ? (
        <SalesReportTable salesData={filteredSalesReportData} />
      ) : salesReportData.length && !isLoading ? (
        <div className="flex justify-center items-center py-4 w-full lg:min-h-[300px] xl:min-h-[380px]">No data found</div>
      ) : (
        <Loading height={"70vh"} />
      )}
    </AppLayout>
  );
};

export default SalesReport;
