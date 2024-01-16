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

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const SalesReport = () => {
  const { data: manufacturers } = useManufacturer();
  const salesReportApi = useSalesReport();

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
  };

  const navigate = useNavigate();

  const getSalesData = async () => {
    const result = await salesReportApi.salesReportData();
    setSalesReportData(result.data.data);
  };
  //console.log("salesReportData", salesReportData);
  // api call
  useEffect(() => {
    const userData = localStorage.getItem("Name");
    if (userData) {
      getSalesData();
    } else {
      navigate("/");
    }
  }, []);

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
          <button className="border px-2.5 py-1 leading-tight" onClick={resetFilter}>
            CLEAR ALL
          </button>
          <button className="border px-2.5 py-1 leading-tight" onClick={exportToExcel}>
            EXPORT
          </button>
        </>
      }
    >
      {filteredSalesReportData?.length ? (
        <SalesReportTable salesData={filteredSalesReportData} />
      ) : salesReportData.length ? (
        <div className="flex justify-center items-center py-4 w-full lg:min-h-[300px] xl:min-h-[380px]">No data found</div>
      ) : (
        <Loading height={"70vh"} />
      )}
    </AppLayout>
  );
};

export default SalesReport;
