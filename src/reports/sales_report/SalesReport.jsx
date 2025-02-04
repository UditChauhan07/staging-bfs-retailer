import React, { useEffect, useMemo, useState } from "react";
import useSalesReport from "../../api/useSalesReport";
import { useNavigate } from "react-router";
import AppLayout from "../../components/AppLayout";
import { FilterItem } from "../../components/FilterItem";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import SalesReportTable from "../../components/sales report table/SalesReportTable";
import Styles from "./index.module.css";
import { MdOutlineDownload } from "react-icons/md";
import ModalPage from "../../components/Modal UI";
import styles from "../../components/Modal UI/Styles.module.css";
import { GetAuthData, defaultLoadTime, getAllAccountBrand } from "../../lib/store";
import { CloseButton, SearchIcon } from "../../lib/svg";
import LoaderV3 from "../../components/loader/v3";
import dataStore from "../../lib/dataStore";
import useBackgroundUpdater from "../../utilities/Hooks/useBackgroundUpdater";
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const SalesReport = () => {
  let currentYear = new Date().getFullYear()
  const [yearFor, setYearFor] = useState(currentYear);
  const salesReportApi = useSalesReport();
  const [isLoading, setIsLoading] = useState(true);
  const [manufacturerFilter, setManufacturerFilter] = useState();
  const [highestOrders, setHighestOrders] = useState(true);
  const [salesReportData, setSalesReportData] = useState([]);
  const [ownerPermission, setOwnerPermission] = useState(false);
  const [searchBy, setSearchBy] = useState("");
  const [searchBySalesRep, setSearchBySalesRep] = useState("");
  const [salesRepList, setSalesRepList] = useState([]);
  const [yearForTableSort, setYearForTableSort] = useState(currentYear);
  const [exportToExcelState, setExportToExcelState] = useState(false);
  const filteredSalesReportData = useMemo(() => {
    
    let filtered = salesReportData.filter((ele) => {
      return !manufacturerFilter || !ele.ManufacturerName__c.localeCompare(manufacturerFilter);
    });
    if (searchBy) {
      filtered = filtered?.map((ele) => {
        const Orders = ele.Orders.filter((item) => {
          if (item.Name?.toLowerCase().includes(searchBy?.toLowerCase())) {
            return item;
          }
        });
        return {
          ...ele,
          Orders,
        };
      });
    }
    if (searchBySalesRep) {
      filtered = filtered?.map((ele) => {
        const Orders = ele.Orders.filter((item) => {
          if (item.AccountRepo?.toLowerCase().includes(searchBySalesRep?.toLowerCase())) {
            return item;
          }
        });
        return {
          ...ele,
          Orders,
        };
      });
    }
    if (highestOrders) {
      filtered = filtered.sort((a, b) => {
        // Sort by totalOrders in descending order
        const totalOrdersDiff = b.Orders[0].totalOrders - a.Orders[0].totalOrders;
        if (totalOrdersDiff !== 0) {
          return totalOrdersDiff;
        }

        // If totalOrders are equal, sort by totalorderPrice in descending order
        return b.Orders[0].totalorderPrice - a.Orders[0].totalorderPrice;
      });

    } else {
      filtered = filtered.sort((a, b) => {
        // Sort by totalOrders in descending order
        const totalOrdersDiff = a.Orders[0].totalOrders - b.Orders[0].totalOrders;
        if (totalOrdersDiff !== 0) {
          return totalOrdersDiff;
        }

        // If totalOrders are equal, sort by totalorderPrice in descending order
        return b.Orders[0].totalorderPrice - a.Orders[0].totalorderPrice;
      });
    }
    return filtered;
  }, [manufacturerFilter, salesReportData, highestOrders, searchBy, searchBySalesRep]);

  const csvData = useMemo(() => {
    const dataWithTotals = filteredSalesReportData?.map((ele) =>
      ele.Orders.map((item) => ({
        ManufacturerName: ele.ManufacturerName__c,
        StoreName: item?.AccountName || item.Name,
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
        TotalAmount: item.totalorderPrice,
      }))
    ).flat();

    const totals = {
      ManufacturerName: "Total",
      JanOrders: dataWithTotals.reduce((total, item) => total + (item.JanOrders || 0), 0),
      JanAmount: dataWithTotals.reduce((total, item) => total + (item.JanAmount || 0), 0),

      FebOrders: dataWithTotals.reduce((total, item) => total + (item.FebOrders || 0), 0),
      FebAmount: dataWithTotals.reduce((total, item) => total + (item.FebAmount || 0), 0),

      MarOrders: dataWithTotals.reduce((total, item) => total + (item.MarOrders || 0), 0),
      MarAmount: dataWithTotals.reduce((total, item) => total + (item.MarAmount || 0), 0),

      AprOrders: dataWithTotals.reduce((total, item) => total + (item.AprOrders || 0), 0),
      AprAmount: dataWithTotals.reduce((total, item) => total + (item.AprAmount || 0), 0),

      MayOrders: dataWithTotals.reduce((total, item) => total + (item.MayOrders || 0), 0),
      MayAmount: dataWithTotals.reduce((total, item) => total + (item.MayAmount || 0), 0),

      JunOrders: dataWithTotals.reduce((total, item) => total + (item.JunOrders || 0), 0),
      JunAmount: dataWithTotals.reduce((total, item) => total + (item.JunAmount || 0), 0),

      JulOrders: dataWithTotals.reduce((total, item) => total + (item.JulOrders || 0), 0),
      JulAmount: dataWithTotals.reduce((total, item) => total + (item.JulAmount || 0), 0),

      AugOrders: dataWithTotals.reduce((total, item) => total + (item.AugOrders || 0), 0),
      AugAmount: dataWithTotals.reduce((total, item) => total + (item.AugAmount || 0), 0),

      SepOrders: dataWithTotals.reduce((total, item) => total + (item.SepOrders || 0), 0),
      SepAmount: dataWithTotals.reduce((total, item) => total + (item.SepAmount || 0), 0),

      OctOrders: dataWithTotals.reduce((total, item) => total + (item.OctOrders || 0), 0),
      OctAmount: dataWithTotals.reduce((total, item) => total + (item.OctAmount || 0), 0),

      NovOrders: dataWithTotals.reduce((total, item) => total + (item.NovOrders || 0), 0),
      NovAmount: dataWithTotals.reduce((total, item) => total + (item.NovAmount || 0), 0),

      DecOrders: dataWithTotals.reduce((total, item) => total + (item.DecOrders || 0), 0),
      DecAmount: dataWithTotals.reduce((total, item) => total + (item.DceAmount || 0), 0),

      TotalOrders: dataWithTotals.reduce((total, item) => total + (item.TotalOrders || 0), 0),
      TotalAmount: dataWithTotals.reduce((total, item) => total + (item.TotalAmount || 0), 0),


    };

    const dataWithTotalRow = [...dataWithTotals, totals];

    return dataWithTotalRow;
  }, [filteredSalesReportData, manufacturerFilter]);

  const handleExportToExcel = () => {
    setExportToExcelState(true);
  };
  const exportToExcel = () => {
    setExportToExcelState(false);
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `Purchase Report ${new Date().toDateString()}` + fileExtension);
  };
  const resetFilter = () => {
    setManufacturerFilter(null);
    setHighestOrders(true);
    getSalesData(yearFor, accountIds);
    setYearFor(currentYear);
    setSearchBy("");
    setSearchBySalesRep("");
    setYearForTableSort(currentYear);
  };
  const navigate = useNavigate();
  const reportReady = (result) => {
    let salesListName = [];
    let salesList = [];
    result.data.data.map((manu) => {
      if (manu.Orders.length) {
        manu.Orders.map((item) => {
          if (!salesListName.includes(item.AccountRepo)) {
            salesListName.push(item.AccountRepo);
            salesList.push({
              label: item.AccountRepo,
              value: item.AccountRepo,
            });
          }
        });
      }
    });
    setSalesRepList(salesList);
    setSalesReportData(result.data.data);
    setOwnerPermission(result.data.ownerPermission);
    setIsLoading(false);
  }
  const getSalesData = async (yearFor, strAccountIds = "[]") => {
    setIsLoading(true);
    setYearForTableSort(yearFor);

    let value = { yearFor, accountIds: strAccountIds };

    let result = await dataStore.getPageData("/purchase-report" + JSON.stringify(value), () => salesReportApi.salesReportData(value));
    reportReady(result);
  };
  // console.log("salesReportData", salesReportData);
  const [manufacturerData, setManufacturerData] = useState([]);
  const [accountIds, setAccountids] = useState("[]");
  const [accountList, setAccountList] = useState([]);

  const handlePageData = async () => {
    GetAuthData().then((user) => {
      dataStore.getPageData("getAllAccountBrand", () => getAllAccountBrand({ key: user.data.x_access_token, accountIds: JSON.stringify(user.data.accountIds) })).then((resManu) => {
        setManufacturerData(resManu);
        getSalesData(yearFor, JSON.stringify(user.data.accountIds));
      }).catch((err) => {
        console.log({ err });
      })
    }).catch((error) => {
      console.log({ error });
    })
  }

  useEffect(() => {
    GetAuthData().then((user) => {
      if (user) {
        dataStore.subscribe("/purchase-report" + JSON.stringify({ yearFor, accountIds: JSON.stringify(user.data.accountIds) }), (data) => reportReady(data));
        setAccountids(JSON.stringify(user.data.accountIds))
        setAccountList(user.data.accountList)
        handlePageData();
        return () => {
          dataStore.unsubscribe("/purchase-report" + JSON.stringify({ yearFor, accountIds: JSON.stringify(user.data.accountIds) }), (data) => reportReady(data));
        }
      } else {
        navigate("/");
      }
    }).catch((error) => {
      console.log({ error });
    })
  }, []);
  useBackgroundUpdater(() => getSalesData(yearFor, accountIds), defaultLoadTime)
  const sendApiCall = () => {
    // setManufacturerFilter(null);
    // setHighestOrders(true);
    // getSalesData(yearFor);
    // setSearchBy("");
    // setSearchBySalesRep("");
    if (!JSON.parse(accountIds).length) {
      GetAuthData().then((user) => {
        if (user) {
          setAccountids(JSON.stringify(user.data.accountIds))
          getSalesData(yearFor, JSON.stringify(user.data.accountIds));
        }
      }).catch((error) => {
        console.log({ error });
      })
    } else {
      getSalesData(yearFor, accountIds);
    }
  };
  let yearList = [
    { value: currentYear, label: currentYear },
    { value: currentYear -1 , label: currentYear -1 },
    { value: currentYear -2, label: currentYear -2 },
    { value: currentYear -3 , label: currentYear -3  },
    { value: currentYear -4 , label: currentYear -4 },
    { value: currentYear -5  , label: currentYear -5 },
    { value: currentYear -6, label: currentYear -6 },
    { value: currentYear -7 , label: currentYear -7 },
    { value: currentYear -8 , label: currentYear  -8},
    { value: currentYear -9 , label: currentYear -9 },
  ]
  return (
    <AppLayout
      filterNodes={
        <div className="d-flex justify-content-between m-auto" style={{ width: '99%' }}>
          <div className="d-flex justify-content-start gap-4 col-5">
            {accountList?.length > 1 &&
              <FilterItem
                minWidth="220px"
                label="All Store"
                value={JSON.parse(accountIds).length == 1 ? JSON.parse(accountIds)[0] : null}

                options={[
                  { label: 'All Accounts', value: null } , 
                  ...accountList.map((month, i) => ({
                  label: month.Name,
                  value: month.Id,
                })), ]}
                onChange={(value) => {
                  if (value) {
                    setAccountids(JSON.stringify([value]));
                  } else {
                    setAccountids(JSON.stringify([]));
                  }
                }}
                name={"Account-menu"}
              />}
            <FilterItem
              label="year"
              name="Year"
              value={yearFor}
              options={yearList}
              onChange={(value) => setYearFor(value)}
            />
            <button onClick={() => sendApiCall()} className="border px-2 py-1 leading-tight d-grid"> <SearchIcon fill="#fff" width={20} height={20} />
              <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>search</small>
            </button>
          </div>
          <div className="d-flex justify-content-end col-1"><hr className={Styles.breakHolder} /></div>
          <div className="d-flex justify-content-end gap-4 col-6">
            {ownerPermission && <FilterItem minWidth="220px" label="All Sales Rep" name="AllSalesRep" value={searchBySalesRep} options={salesRepList} onChange={(value) => setSearchBySalesRep(value)} />}
         
         {manufacturerData?.length > 0 ?
           <FilterItem
           minWidth="220px"
           label="All Brand"
           name="AllManufacturers1"
           value={manufacturerFilter}
           options={manufacturerData?.map((manufacturer) => ({
             label: manufacturer.Name,
             value: manufacturer.Name,
           }))}
           onChange={(value) => setManufacturerFilter(value)}
         />
         
         : null }
         
          
            <FilterItem
              minWidth="220px"
              label="Lowest Orders"
              name="LowestOrders"
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
            <div className="d-flex gap-3">
              <button className="border px-2 py-1 leading-tight d-grid" onClick={resetFilter}>
                <CloseButton crossFill={'#fff'} height={20} width={20} />
                <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>clear</small>
              </button>
            </div>
            <button className="border px-2 py-1 leading-tight d-grid" onClick={handleExportToExcel}>
              <MdOutlineDownload size={16} className="m-auto" />
              <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>EXPORT</small>
            </button>
          </div>
        </div>
      }
    >
      {exportToExcelState && (
        <ModalPage
          open
          content={
            <>
              <div style={{ maxWidth: "330px" }}>
                <h1 className={`fs-5 ${styles.ModalHeader}`}>Warning</h1>
                <p className={` ${styles.ModalContent}`}>Do you want to download Purchase Report?</p>
                <div className="d-flex justify-content-center gap-3 ">
                  <button className={`${styles.modalButton}`} onClick={exportToExcel}>
                    OK
                  </button>
                  <button className={`${styles.modalButton}`} onClick={() => setExportToExcelState(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </>
          }
          onClose={() => {
            setExportToExcelState(false);
          }}
        />
      )}
      <div className={Styles.inorderflex}>
        <div>
          <h2>
            {/* ${(yearFor<currentYear)?("-"+yearFor):''} */}
            {ownerPermission ? `${searchBySalesRep ? searchBySalesRep + "`s" : "All"} Purchase Report` : `Your Purchase Report`}
            {manufacturerFilter && " for " + manufacturerFilter}
          </h2>
        </div>
        <div>
        </div>
      </div>
      {isLoading || !filteredSalesReportData ? (
  // Jab tak data load ho raha hai ya filter apply ho raha hai, loader dikhaye
  <LoaderV3 text={"Loading Purchase Report, Please wait..."} />
) : filteredSalesReportData.length > 0 ? (
  // Filtered data available hai to table dikhaye
  <SalesReportTable
    salesData={filteredSalesReportData}
    year={yearForTableSort}
    ownerPermission={ownerPermission}
  />
) : (
  // Filter hone ke baad agar length 0 hai to "No data found" dikhaye
  <div className="flex justify-center items-center py-4 w-full lg:min-h-[300px] xl:min-h-[380px]">
    No data found
  </div>
)}

    </AppLayout>
  );
};

export default SalesReport;
