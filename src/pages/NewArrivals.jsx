import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import NewArrivalsPage from "../components/NewArrivalsPage/NewArrivalsPage";
import { FilterItem } from "../components/FilterItem";
import { GetAuthData, defaultLoadTime, getAllAccountBrand, getMarketingCalendar, getRetailerBrands } from "../lib/store";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { CloseButton } from "../lib/svg";
import LoaderV3 from "../components/loader/v3";
import { useLocation } from "react-router-dom";
import dataStore from "../lib/dataStore";
import useBackgroundUpdater from "../utilities/Hooks/useBackgroundUpdater";
const fileExtension = ".xlsx";
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const NewArrivals = () => {
  let date = new Date();
  const [productList, setProductList] = useState([]);
  const [accountDiscount, setAccountDiscount] = useState();
  const [month, setMonth] = useState("");
  const [selectYear, setSelectYear] = useState(date.getFullYear())
    const [currentPage, setCurrentPage] = useState(1);
  let yearList = [
    { value: date.getFullYear(), label: date.getFullYear() },
    { value: date.getFullYear() + 1, label: date.getFullYear() + 1 }
  ]
  let months = [
    { value: "JAN", label: "JAN" },
    { value: "FEB", label: "FEB" },
    { value: "MAR", label: "MAR" },
    { value: "APR", label: "APR" },
    { value: "MAY", label: "MAY" },
    { value: "JUN", label: "JUN" },
    { value: "JUL", label: "JUL" },
    { value: "AUG", label: "AUG" },
    { value: "SEP", label: "SEP" },
    { value: "OCT", label: "OCT" },
    { value: "NOV", label: "NOV" },
    { value: "DEC", label: "DEC" },
    // { value: "TBD", label: "TBD" },
  ];

  // ...............
  const [isEmpty, setIsEmpty] = useState(false);
  const [brand, setBrand] = useState([]);
  const [selectBrand, setSelectBrand] = useState(null)
  const [isLoaded, setIsloaed] = useState(false);
  const [filterLoad, setFilterLoad] = useState(false);

  useEffect(() => {
    HandleClear()
  }, [])
  const handlePageData = async ()=>{
    GetAuthData().then((user) => {
      dataStore.getPageData("getAllAccountBrand", () => getAllAccountBrand({ key: user.data.x_access_token, accountIds: JSON.stringify(user.data.accountIds) })).then(async (resManu) => {
        setBrand(resManu);

        dataStore.getPageData("/marketing-calendar" + JSON.stringify(selectYear), () => getMarketingCalendar({ key: user.data.x_access_token, year: selectYear,accountIds: JSON.stringify(user.data.accountIds) })).then((productRes) => {
          console.log({productRes});
          
          handleNewArrivalReady(productRes)
        }).catch((err) => console.log({ err }))
      }).catch((err) => {
        console.log({ err });
      })
    }).catch((error) => {
      console.log({ error });
    })
  }
  useEffect(() => {
    dataStore.subscribe("/marketing-calendar" + JSON.stringify(selectYear), handleNewArrivalReady);
    handlePageData()
    return () => {
      dataStore.unsubscribe("/marketing-calendar" + JSON.stringify(selectYear), handleNewArrivalReady);
    }
  }, [selectBrand, selectYear, month, isLoaded])

  useBackgroundUpdater(handlePageData,defaultLoadTime)

  const handleNewArrivalReady = (data) => {
    if (data) {
      setAccountDiscount(data?.discount || {})

      data.list.map((month) => {
        month.content.map((element) => {
          element.date = element.Ship_Date__c ? (element.Ship_Date__c.split("-")[2] == 15 ? 'TBD' : element.Ship_Date__c.split("-")[2]) + '/' + monthNames[parseInt(element.Ship_Date__c.split("-")[1]) - 1].toUpperCase() + '/' + element.Ship_Date__c.split("-")[0] : 'NA';
          element.OCDDate = element.Launch_Date__c ? (element.Launch_Date__c.split("-")[2] == 15 ? 'TBD' : element.Launch_Date__c.split("-")[2]) + '/' + monthNames[parseInt(element.Launch_Date__c.split("-")[1]) - 1].toUpperCase() + '/' + element.Launch_Date__c.split("-")[0] : 'NA';
          return element;

        })
        return month;
      })
      setProductList(data?.list);
      setIsloaed(true)
    }
  }

  const HandleClear = () => {
    const currentMonthIndex = new Date().getMonth();
    setMonth(months[currentMonthIndex].value);
    setSelectBrand(null);
    setIsEmpty(false)
    setSelectYear(date.getFullYear())
  }

  //
  // const generateXLSX = () => {
  //   const newValues = productList?.map((months) => {
  //     const filterData = months.content?.filter((item) => {
  //       // let match = item.OCDDate.split("/")
  //       // console.log(match)
  //       if (month) {
  //         if (brand) {
  //           if (brand == item.brand) {
  //             return item.date.toLowerCase().includes(month.toLowerCase())
  //           }
  //         } else {
  //           return item.date.toLowerCase().includes(month.toLowerCase())
  //         }
  //         // return match.includes(month.toUpperCase() )
  //       } else {
  //         if (brand) {
  //           if (brand == item.brand) {
  //             return true;
  //           }
  //         } else {
  //           return true;
  //         }
  //         // If month is not provided, return all items
  //       }
  //     });
  //     // Create a new object with filtered content
  //     return { ...months, content: filterData };
  //   });
  //   let fileData = exportToExcel({ list: newValues });
  // }

  const csvData = ({ data }) => {
    let finalData = [];
    if (data.length) {
      data?.map((ele) => {
        if (ele.content.length) {
          ele.content.map((item) => {
            let temp = {};
            temp["MC Month"] = ele.month;
            temp["Product Title"] = item.name;
            temp["Product Description"] = item.description;
            temp["Product Size"] = item.size;
            temp["Product Ship Date"] = item.date;
            temp["Product OCD Date"] = item.OCDDate;
            temp["Product Brand"] = item.brand;
            finalData.push(temp);
          })
        }
      });
    }
    return finalData;
  };
  const exportToExcel = ({ list }) => {
    const ws = XLSX.utils.json_to_sheet(csvData({ data: list }));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    let filename = `Marketing Calender`;
    if (brand) {
      filename = brand
    }
    FileSaver.saveAs(data, `${filename} ${new Date()}` + fileExtension);
  };

  return (
    <AppLayout
      filterNodes={
        <>
          <FilterItem
            label="year"
            name="Year"
            value={selectYear}
            options={yearList}
            onChange={(value) => {setCurrentPage(1);setSelectYear(value);}}
          />
          {brand?.length > 0 ?
            <FilterItem
            minWidth="220px"
            label="All Brand"
            name="All-Brand"
            value={selectBrand}
            options={
              Array.isArray(brand)
                ? brand?.map((brands) => ({
                  label: brands.Name,
                  value: brands.Name,
                }))
                : []
            }
            onChange={(value) => {
              setCurrentPage(1);
              setSelectBrand(value);
            }}
          />
          : null}
        
          <FilterItem
            minWidth="220px"
            label="JAN-DEC"
            name="JAN-DEC"
            value={month}
            options={months}
            onChange={(value) => {
              setCurrentPage(1);
              setFilterLoad(true)
              let newArrivalsSection = document.getElementById("newArrivalsSection")

              if (newArrivalsSection) {
                let imgElement = newArrivalsSection.querySelectorAll("img");
                let keys = Object.keys(imgElement);

                if (keys.length > 0) {
                  keys.map((key) => {

                    imgElement[key].removeAttribute('src');
                  });
                }
              } else {
                console.error('Element with id "newArrivalsSection" not found.');
              }

              setTimeout(() => {
                setFilterLoad(false);
                setMonth(value);
              }, 1000);
            }}
          />
          <button
            className="border px-2.5 py-1 leading-tight d-grid"
            // onClick={handleclick}
            onClick={HandleClear}
          >
            <CloseButton crossFill={'#fff'} height={20} width={20} />
            <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>clear</small>
          </button>
        </>
      }
    >
      {isLoaded ? (
        <NewArrivalsPage selectBrand={selectBrand} brand={brand} isEmpty={isEmpty} isLoaded={filterLoad} month={month} productList={productList} accountDetails={accountDiscount} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      ) : (
        <LoaderV3 text={"Unveiling Upcoming New Products are loading...."} />
      )}

    </AppLayout>
  );
};

export default NewArrivals;