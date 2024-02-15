import React, { useEffect, useState } from "react";
import Styles from "./Dashboard.module.css";
import Chart from "react-apexcharts";
import Loading from "../Loading";
import img1 from "./Images/Active-1.png";
import img2 from "./Images/Vector.png";
import img3 from "./Images/Group.png";
import img4 from "./Images/Group1.png";
import img5 from "./Images/Rectangle 304.png";
import { PieChart, Pie, Cell } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { AuthCheck, GetAuthData, getDashboardata } from "../../lib/store";
import { getRandomColors } from "../../lib/color";
import ContentLoader from "react-content-loader";
import SelectBrandModel from "../My Retailers/SelectBrandModel/SelectBrandModel";
import ModalPage from "../Modal UI/index";
import AppLayout from "../AppLayout";
import { FilterItem } from "../FilterItem";
import { UserIcon } from "../../lib/svg";
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthList = [
  {
    name: "January - 2023",
    value: "2023|1",
  },
  {
    name: "February - 2023",
    value: "2023|2",
  },
  {
    name: "March - 2023",
    value: "2023|3",
  },
  {
    name: "April - 2023",
    value: "2023|4",
  },
  {
    name: "May - 2023",
    value: "2023|5",
  },
  {
    name: "June - 2023",
    value: "2023|6",
  },
  {
    name: "July - 2023",
    value: "2023|7",
  },
  {
    name: "August - 2023",
    value: "2023|8",
  },
  {
    name: "September - 2023",
    value: "2023|9",
  },
  {
    name: "October - 2023",
    value: "2023|10",
  },
  {
    name: "November - 2023",
    value: "2023|11",
  },
  {
    name: "December - 2023",
    value: "2023|12",
  },
  {
    name: "January - 2024",
    value: "2024|1",
  },
  {
    name: "February - 2024",
    value: "2024|2",
  },
  {
    name: "March - 2024",
    value: "2024|3",
  },
  {
    name: "April - 2024",
    value: "2024|4",
  },
  {
    name: "May - 2024",
    value: "2024|5",
  },
  {
    name: "June - 2024",
    value: "2024|6",
  },
  {
    name: "July - 2024",
    value: "2024|7",
  },
  {
    name: "August - 2024",
    value: "2024|8",
  },
  {
    name: "September - 2024",
    value: "2024|9",
  },
  {
    name: "October - 2024",
    value: "2024|10",
  },
  {
    name: "November - 2024",
    value: "2024|11",
  },
  {
    name: "December - 2024",
    value: "2024|12",
  },
];
const dataa = {
  series: [
    {
      name: "Diptyque",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Byredo",
      data: [76, 85, 87, 98, 87, 97, 91, 74, 94],
    },
    {
      name: "Bobbi Brown",
      data: [16, 25, 37, 48, 57, 67, 73, 84, 94],
    },
    {
      name: "By Terry",
      data: [6, 15, 23, 35, 41, 53, 66, 74, 87],
    },
    {
      name: "Revive",
      data: [2, 12, 21, 30, 33, 42, 37, 41, 54],
    },
    {
      name: "Kevyn Aucoin",
      data: [71, 88, 83, 91, 82, 99, 61, 70, 98],
    },
    {
      name: "Smashbox",
      data: [10, 12, 14, 11, 16, 20, 24, 29, 32],
    },
  ],
  options: {
    chart: {
      type: "area",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },

    dataLabels: {
      enabled: true,
    },
    colors: getRandomColors(17),
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0,
        opacityTo: 0,
      },
    },

    xaxis: {
      categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
    yaxis: {
      title: {
        text: "$ (Dollar)",
      },
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + Number(val).toFixed(2) + "";
        },
      },
    },
  },
};

function Dashboard({ dashboardData }) {
  const bgColors = {
    "Kevyn Aucoin Cosmetics": "KevynAucoinCosmeticsBg",
    "Bumble and Bumble": "BumbleandBumbleBg",
    "BY TERRY": "BYTERRYBg",
    "Bobbi Brown": "BobbiBrownBg",
    ReVive: "ReViveBg",
    "Maison Margiela": "MaisonMargielaBg",
    Smashbox: "SmashboxBg",
    "RMS Beauty": "RMSBeautyBg",
    "ESTEE LAUDER": "esteeLauderBg",
  };
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [selMonth, setSelMonth] = useState(`${currentYear}|${currentMonth}`);
  const [tabledata, settabledata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lineChart, setlineChart] = useState();
  const [dashboardRelatedData, setDashboardRelatedData] = useState({});

  const [brandData, setBrandData] = useState([]);

  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [targetValue, setTargetValue] = useState();
  const [achievedSales, setAchievedSales] = useState();
  const [needle_data, setNeedle_data] = useState([]);


  //dashboard varibale used
  const [box, setBox] = useState({ RETAILERS: 0, GROWTH: 0, ORDERS: 0, REVENUE: 0, TARGET: 0 })
  const [Monthlydataa, setMonthlydata] = useState({ isLoaded: false, data: [] });
  const [Yearlydataa, setYearlydata] = useState({ isLoaded: false, data: [] });
  const [accountPerformance, setAccountPerformance] = useState({ isLoaded: false, data: [] });
  const [leadsbybrand, setleadsbtbrand] = useState({ isLoaded: false, data: [] });
  const [salesByBrandData, setSalesByBrandData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
      },
      labels: {
        show: true,
        name: {
          show: true,
          offsetY: 38,
          formatter: () => "out of 553 points",
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                formatter: function (w) {
                  const t = w.globals.seriesTotals;
                  const result = t.reduce((a, b) => a + b, 0);
                  // return (result / 10000).toFixed(1);
                  return result;
                },
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100px",
            },
          },
        },
      ],
      colors: getRandomColors(8),
      labels: [],
    },
  });
  const [manufacturerSalesYear, setManufacturerSalesYaer] = useState([]);
  // API INTEGRATION

  useEffect(() => {
    if (localStorage.getItem("Name")) {
      // getDataHandler();
      getDataHandler({ month: 2, year: 2024 });
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (!AuthCheck()) {
      navigate("/");
    }
  }, []);
  const [salesRepId, setSalesRepId] = useState();
  const getDataHandler = (headers = null) => {
    // setIsLoaded(true);
    GetAuthData()
      .then((user) => {
        // user.Sales_Rep__c = "00530000005AdvsAAC";

        setSalesRepId(user.Sales_Rep__c);
        if (headers) {
          user.headers = headers;
        }
        getDashboardata({ user })
          .then((dashboard) => {
            console.log({aa:dashboard});
            setBox({ RETAILERS: dashboard?.activeAccount || 0, GROWTH: 0, ORDERS: dashboard?.totalOrder || 0, REVENUE: dashboard?.totalPrice || 0, TARGET: dashboard.salesRepTarget || 0 })
            if (dashboard.rawPerformance) {
              setAccountPerformance({ isLoaded: true, data: dashboard.rawPerformance })
            }
            if (dashboard?.monthlySalesRepData) {
              let monthlyDataKey = Object.keys(dashboard?.monthlySalesRepData)
              let temp = [];
              monthlyDataKey.map((id) => {
                temp.push(dashboard.monthlySalesRepData[id])
              })
              setMonthlydata({ isLoaded: true, data: temp })
            }
            if (dashboard.yearlySalesRepData) {
              let monthlyDataKey = Object.keys(dashboard?.yearlySalesRepData)
              let temp = [];
              monthlyDataKey.map((id) => {
                temp.push(dashboard.yearlySalesRepData[id])
              })
              setYearlydata({ isLoaded: true, data: temp })
            }
            if (dashboard?.monthlyManufactureData) {
              let monthlyDataKey = Object.keys(dashboard?.monthlyManufactureData)
              let temp = [];
              monthlyDataKey.map((id) => {
                temp.push(dashboard.monthlyManufactureData[id])
              })
              setBrandData({ isLoaded: true, data: temp })
            }
            //ownManuFactureData
            if (dashboard?.monthlyManufactureData) {
              setSalesByBrandData({
                series: Object.values(dashboard?.monthlyManufactureData).map((value) => {
                  return value?.own || 0;
                }),
                options: {
                  chart: {
                    type: "donut",
                  },
                  labels: {
                    show: true,
                    name: {
                      show: true,
                      offsetY: 38,
                      formatter: () => "out of 553 points",
                    },
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        labels: {
                          show: true,

                          total: {
                            show: true,
                            showAlways: true,
                            label: "Total Orders",
                            formatter: function (w) {
                              const t = w.globals.seriesTotals;
                              const result = t.reduce((a, b) => a + b, 0);
                              return result;
                              // return result < 1000 ? result.toFixed(1) : `${(result / 1000).toFixed(1)}K`;
                            },
                          },
                        },
                      },
                    },
                  },

                  responsive: [
                    {
                      breakpoint: 100,
                      options: {
                        chart: {
                          width: "100px",
                        },
                      },
                    },
                  ],
                  colors: getRandomColors(Object.values(dashboard?.monthlyManufactureData).length),
                  labels: Object.values(dashboard?.monthlyManufactureData).map((value) => {
                    return value?.name || 0;
                  }),
                },
              });
            }
            if (dashboard?.yearlyManufacturerData) {
              let monthlyDataKey = Object.keys(dashboard.yearlyManufacturerData)
              let temp = [];
              monthlyDataKey.map((id) => {
                let indexValue = dashboard.yearlyManufacturerData[id];
                let raw = {
                  name: indexValue.name,
                  data: []
                }
                monthNames.map((month, index) => {
                  raw.data.push(indexValue[month].sale)
                })
                temp.push(raw)
              })
              setManufacturerSalesYaer(temp)
            }
            if (dashboard?.leadManufacturerRaw) {
              let monthlyDataKey = Object.keys(dashboard?.leadManufacturerRaw)
              let temp = [];
              monthlyDataKey.map((id) => {
                temp.push(dashboard.leadManufacturerRaw[id])
              })
              setleadsbtbrand({ isLoaded: true, data: temp })
            }
          })
          .catch((err) => {
            console.error({ err });
          });
      })
      .catch((error) => {
        console.error({ error });
      });
  };
  useEffect(() => {
    setTargetValue(Number(box.TARGET / 1000).toFixed(0));
    setAchievedSales(Number(box.REVENUE / 1000).toFixed(0));
  }, [Monthlydataa]);
  useEffect(() => {
    setNeedle_data([
      { name: "A", value: parseInt(targetValue> 0 ? targetValue : achievedSales), color: "#16BC4E" },
      { name: "B", value: parseInt(targetValue>0 ? targetValue - achievedSales > 0 ? targetValue - achievedSales || 0 : 0 : targetValue), color: "#C7C7C7" },
    ]);
  }, [targetValue, achievedSales, Monthlydataa]);
  let lowPerformanceArray = accountPerformance?.data?.slice(0).reverse().map((ele) => ele);

  const changeMonthHandler = (value) => {
    setIsLoading(false);
    setleadsbtbrand({ isLoaded: false, data: [] })
    setAccountPerformance({ isLoaded: false, data: [] })
    setMonthlydata({ isLoaded: false, data: [] })
    setYearlydata({ isLoaded: false, data: [] })
    setBrandData({ isLoaded: false, data: [] })
    setManufacturerSalesYaer([]);
    setBox({ RETAILERS: 0, GROWTH: 0, ORDERS: 0, REVENUE: 0, TARGET: 0 })
    setSelMonth(value);
    const valuePlit = value.split("|");
    let month = valuePlit[1] || null;
    let year = valuePlit[0] || null;
    getDataHandler({ month, year });
  };
  const RADIAN = Math.PI / 180;
  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;
  const value = parseInt(targetValue);
  const needle = (value, data, cx, cy, iR, oR, color) => {
    let total = 0;
    needle_data.forEach((v) => {
      total += v.value;
    });
    let ang = 180.0 * (1 - value / total);
    if(value == 0 &&value < total){
      ang = 0;
    }
    const length = (iR + 2.4 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;
    return [<circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />, <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />];
  };
  function IsTableLoading() {
    return (
      <>
        <tr>
          <td>
            <ContentLoader />
          </td>
          <td>
            <ContentLoader />
          </td>
          <td>
            <ContentLoader />
          </td>
          <td>
            <ContentLoader />
          </td>
        </tr>
        <tr>
          <td>
            <ContentLoader />
          </td>
          <td>
            <ContentLoader />
          </td>
          <td>
            <ContentLoader />
          </td>
          <td>
            <ContentLoader />
          </td>
        </tr>
      </>
    );
  }
  let totalTargetForMTDSalesRep = 0;
  let totalAmountForMTDSalesRep = 0;
  let totalDiffForMTDSalesRep = 0;
  let totalTargetForYTDSalesRep = 0;
  let totalAmountForYTDSalesRep = 0;
  let totalDiffForYTDSalesRep = 0;
  let totalTargetForMTDGoalBrand = 0;
  let totalAmountForMTDGoalBrand = 0;
  let totalDiffForMTDGoalBrand = 0;
  let totalRecieved = 0;
  let totalConverted = 0;
  const sendDataTargetHandler = ({ salesRepId = null, manufacturerId = null }) => {
    navigate('/Target-Report', { state: { salesRepId, manufacturerId } });
  }
  return (
    <AppLayout
      filterNodes={
        <>
          <FilterItem
            minWidth="220px"
            label="Month-Year"
            value={selMonth}
            options={monthList.map((month) => ({
              label: month.name,
              value: month.value,
            }))}
            onChange={(value) => {
              changeMonthHandler(value);
            }}
            name={"dashboard-manu"}
          />
        </>
      }
    >
      {isLoading ? (
        <Loading height="80vh" />
      ) : (
        <div className="">
          <div className="row mt-4 justify-between">
            <div className="col-lg-6 my-2">
              <div className={Styles.DashboardWidth}>
                <p className={Styles.Tabletext}>Month till date(MTD): Sales By Rep</p>
                <div className={Styles.goaltable}>
                  <div className="">
                    <div className={Styles.table_scroll}>
                      <table className="table table-borderless ">
                        <thead>
                          <tr className={Styles.tablerow}>
                            <th scope="col" className="ps-3">
                              Opportunity Owner
                            </th>
                            <th scope="col">Sale Target</th>
                            <th scope="col">Sale Amount</th>
                            <th scope="col">Diff.</th>
                          </tr>
                        </thead>
                        {!Monthlydataa.isLoaded ? (
                          <IsTableLoading />
                        ) : (
                          <>
                            {Monthlydataa.data ? (
                              <tbody>
                                {Monthlydataa.data?.map((e) => {
                                  // console.log("e.....", e);
                                  totalTargetForMTDSalesRep = Number((Number(e?.target || 0) / 1000).toFixed(0)) + Number(totalTargetForMTDSalesRep);
                                  totalAmountForMTDSalesRep = Number((Number(e?.sale || 0) / 1000).toFixed(0)) + Number(totalAmountForMTDSalesRep);
                                  totalDiffForMTDSalesRep = Number((Number(e?.diff || 0) / 1000).toFixed(0)) + Number(totalDiffForMTDSalesRep);
                                  return (
                                    <tr key={e}>
                                      <td className={`${Styles.tabletd} ps-3 d-flex justify-content-start align-items-center gap-2`} onClick={() => { sendDataTargetHandler({ salesRepId: e.name }) }} style={{ cursor: 'pointer' }}>
                                        <UserIcon /> {e.name}
                                      </td>
                                      <td className={Styles.tabletd}>${(Number(e?.target || 0) / 1000).toFixed(0)}K</td>
                                      <td className={Styles.tabletd}>${(Number(e.sale) / 1000).toFixed(0)}K</td>
                                      <td className={Styles.tabletd}>${(Number(e?.diff || 0) / 1000).toFixed(0)}K</td>
                                    </tr>
                                  );
                                })}
                                <tr className={`${Styles.tablerow} ${Styles.stickyBottom}`}>
                                  <th scope="col" className="ps-3">
                                    Total
                                  </th>
                                  <th scope="col">${totalTargetForMTDSalesRep ?? "0"}K</th>
                                  <th scope="col">${totalAmountForMTDSalesRep ?? "0"}K</th>
                                  <th scope="col">${totalDiffForMTDSalesRep ?? "0"}K</th>
                                </tr>
                              </tbody>
                            ) : (
                              <tbody>
                                <td></td>
                                <td>
                                  <div className={`d-flex justify-content-start align-items-center`} style={{ minHeight: "230px" }}>
                                    <p className={`${Styles.tablenodata}`}>No Data Found</p>
                                  </div>
                                </td>
                                <td></td>
                              </tbody>
                            )}
                          </>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Yearly SALESBYREP */}
            <div className="col-lg-6 my-2">
              <div className={Styles.DashboardWidth}>
                <p className={Styles.Tabletext}>Year till date(YTD): Sales By Rep</p>
                <div className={Styles.goaltable}>
                  <div className="">
                    <div className={Styles.table_scroll}>
                      <table className="table table-borderless ">
                        <thead>
                          <tr className={Styles.tablerow}>
                            <th scope="col" className="ps-3">
                              Opportunity Owner
                            </th>
                            <th scope="col">Sale Target</th>
                            <th scope="col">Sale Amount</th>
                            <th scope="col">Diff.</th>
                          </tr>
                        </thead>
                        {!Yearlydataa.isLoaded ? (
                          <IsTableLoading />
                        ) : (
                          <>
                            {Yearlydataa.data ? (
                              <tbody>
                                {Yearlydataa.data?.map((e, index) => {
                                  totalTargetForYTDSalesRep = Number((Number(e?.target || 0) / 1000).toFixed(0)) + Number(totalTargetForYTDSalesRep);
                                  totalAmountForYTDSalesRep = Number((Number(e?.sale || 0) / 1000).toFixed(0)) + Number(totalAmountForYTDSalesRep);
                                  totalDiffForYTDSalesRep = Number((Number(e?.diff || 0) / 1000).toFixed(0)) + Number(totalDiffForYTDSalesRep);

                                  return (
                                    <tr key={e}>
                                      <td className={`${Styles.tabletd} ps-3 d-flex justify-content-start align-items-center gap-2`} onClick={() => { sendDataTargetHandler({ salesRepId: e.name }) }} style={{ cursor: 'pointer' }}>
                                        <UserIcon /> {e.name}
                                      </td>
                                      <td className={Styles.tabletd}>${(Number(e.target) / 1000).toFixed(0)}K</td>
                                      <td className={Styles.tabletd}>${(Number(e.sale) / 1000).toFixed(0)}K</td>
                                      <td className={Styles.tabletd}>${(Number(e.diff) / 1000).toFixed(0)}K</td>
                                    </tr>
                                  );
                                })}
                                <tr className={`${Styles.tablerow} ${Styles.stickyBottom}`}>
                                  <th scope="col" className="ps-3">
                                    Total
                                  </th>
                                  <th scope="col">${totalTargetForYTDSalesRep}K</th>
                                  <th scope="col">${totalAmountForYTDSalesRep}K</th>
                                  <th scope="col">${totalDiffForYTDSalesRep}K</th>
                                </tr>
                              </tbody>
                            ) : (
                              <tbody>
                                <td></td>
                                <td>
                                  <div className={`d-flex justify-content-start align-items-center`} style={{ minHeight: "230px" }}>
                                    <p className={`${Styles.tablenodata}`}>No Data Found</p>
                                  </div>
                                </td>
                                <td></td>
                              </tbody>
                            )}
                          </>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-between ">
            {/* monthly data goal by brand*/}
            <div className="col-lg-6 col-sm-12 my-2">
              <div className={Styles.DashboardWidth}>
                <p className={Styles.Tabletext}>Month till date(MTD): Goal by Brand</p>
                <div className={Styles.goaltable}>
                  <div className={Styles.table_scroll}>
                    <table className="table table-borderless ">
                      <thead>
                        <tr className={Styles.tablerow}>
                          <th className="ps-3">Manufacturer</th>
                          {/* <th>Total Order</th> */}
                          <th scope="col">Sale Target</th>
                          <th scope="col">Sale Amount</th>
                          <th scope="col">Diff.</th>
                        </tr>
                      </thead>
                      <tbody className={Styles.tbdy}>
                        {!brandData.isLoaded ? (
                          <IsTableLoading />
                        ) : (
                          <>
                            {brandData.data.length ? (
                              <>
                                {brandData.data?.map((e, i) => {
                                  totalTargetForMTDGoalBrand = Number((Number(e.target) / 1000 || 0).toFixed(0)) + Number(totalTargetForMTDGoalBrand);
                                  totalAmountForMTDGoalBrand = Number((Number(e.sale) / 1000 || 0).toFixed(0)) + Number(totalAmountForMTDGoalBrand);
                                  totalDiffForMTDGoalBrand = Number((Number(e.target - e.sale || 0) / 1000).toFixed(0)) + Number(totalDiffForMTDGoalBrand);
                                  // console.log({e,i});
                                  return (
                                    <tr key={e}>
                                      <td className={` ps-3 ${Styles.tabletd}`} onClick={() => { sendDataTargetHandler({ manufacturerId: e.id }) }} style={{ cursor: 'pointer' }}>{e.name}</td>
                                      {/* <td className={Styles.tabletd}>{e.totalOrder}</td> */}
                                      <td className={Styles.tabletd}>${(Number(e.target) / 1000).toFixed(0)}K</td>
                                      <td className={Styles.tabletd}>${(Number(e.sale) / 1000).toFixed(0)}K</td>
                                      <td className={Styles.tabletd}>${(Number(e.target - e.sale || 0) / 1000).toFixed(0)}K</td>
                                    </tr>
                                  );
                                })}
                                <tr className={`${Styles.tablerow} ${Styles.stickyBottom}`}>
                                  <th scope="col" className="ps-3">
                                    Total
                                  </th>
                                  <th scope="col">${totalTargetForMTDGoalBrand}K</th>
                                  <th scope="col">${totalAmountForMTDGoalBrand}K</th>
                                  <th scope="col">${totalDiffForMTDGoalBrand}K</th>
                                </tr>
                              </>
                            ) : (
                              <tr>
                                <td className={` ps-3 ${Styles.tabletd}`}>No data Found.</td>
                              </tr>
                            )}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* leads by brand*/}
            <div className="col-lg-6 col-sm-12 my-2 ">
              <div className={Styles.DashboardWidth}>
                <p className={Styles.Tabletext}>Leads by Brand</p>
                <div className={Styles.goaltable1}>
                  <div className={Styles.table_scroll}>
                    <table className="table table-borderless mt-2">
                      <thead>
                        <tr className={Styles.tablerow}>
                          <th className="ps-3">Manufacturer</th>
                          <th>Received</th>
                          <th>Converted</th>
                        </tr>
                      </thead>
                      {!leadsbybrand.isLoaded ? (
                        <IsTableLoading />
                      ) : (
                        <>
                          {leadsbybrand.data.length ? (
                            <tbody className="position-relative">
                              {leadsbybrand.data.map((element) => {
                                totalRecieved += element.received;
                                totalConverted += element.coverted
                                return (
                                  <tr key={element}>
                                    <td className={` ps-3 ${Styles.tabletd}`}>{element.manufacturer}</td>
                                    <td className={Styles.tabletd}>{element.received}</td>
                                    <td className={Styles.tabletd}>{element.coverted}</td>
                                  </tr>
                                );
                              })}
                              <tr className={`${Styles.tablerow} ${Styles.stickyBottom}`}>
                                <th scope="col" className="ps-3">
                                  Total
                                </th>
                                <th scope="col">{totalRecieved}</th>
                                <th scope="col">{totalConverted}</th>
                              </tr>
                            </tbody>
                          ) : (
                            <tbody>
                              <td></td>
                              <td>
                                <div className={`d-flex justify-content-start align-items-center`} style={{ minHeight: "230px" }}>
                                  <p className={`${Styles.tablenodata}`}>No Data Found</p>
                                </div>
                              </td>
                              <td></td>
                            </tbody>
                          )}
                        </>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-5">
            <div className={`row mt-1 justify-between ${Styles.topPerform2}`}>
              <div className={`col-lg-6 col-sm-12 ${Styles.top_perform1}`}>
                <p className={Styles.Tabletext}>Top Performing Accounts</p>
                <div className="row">
                  {/* TOP PERFORMANCE */}
                  {!accountPerformance?.isLoaded ? (
                    <Loading />
                  ) : (
                    <>
                      {accountPerformance.data?.map((ele, index) => {
                        if (index < 4) {
                          return (
                            <div className="col-lg-6 col-md-6 col-sm-12 onHoverCursor">
                              <div
                                className={Styles.top_perform}
                                onClick={() => {
                                  setModalOpen(true);
                                  setBrandData(ele.ManufacturerList);
                                  localStorage.setItem("Account", ele.Name);
                                  localStorage.setItem("AccountId__c", ele.AccountId);
                                }}
                                id={index}
                              >
                                <div className={Styles.top_accnew}>
                                  <p className={Styles.top_accounttext}>{ele.Name}</p>
                                </div>

                                <div className={` ${Styles.scrollbar}`}>
                                  {ele.ManufacturerList.map((itemm) => {
                                    const bgcolor = bgColors[itemm.Name];
                                    return <span className={`${Styles.account} ${Styles[bgcolor]}`}>{itemm.Name}</span>;
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </>
                  )}
                </div>
              </div>
              <ModalPage open={modalOpen} onClose={() => setModalOpen(false)} content={<SelectBrandModel brands={brandData} onClose={() => setModalOpen(false)} />} />
              <div className="col-lg-6 col-sm-12" style={{ width: "48%" }}>
                <p className={Styles.Tabletext1}>Low Performing Accounts</p>
                <div className="row">
                  {/* LOW PERFORMANCE */}
                  {!accountPerformance?.isLoaded ? (
                    <Loading />
                  ) : (
                    <>
                      {lowPerformanceArray?.map((ele, index) => {
                        if (index < 4) {
                          return (
                            <div className="col-lg-6 col-md-6 col-sm-12 onHoverCursor">
                              <div
                                className={Styles.top_perform2}
                                onClick={() => {
                                  setModalOpen(true);
                                  setBrandData(ele.ManufacturerList);
                                  localStorage.setItem("Account", ele.Name);
                                  localStorage.setItem("AccountId__c", ele.AccountId);
                                }}
                              >
                                <div className={Styles.top_account}>
                                  <p className={Styles.top_accounttext}>{ele.Name}</p>
                                </div>

                                <div className={` ${Styles.scrollbar}`}>
                                  {ele.ManufacturerList.map((item) => {
                                    const bgcolor = bgColors[item.Name];
                                    return <span className={`${Styles.account22} ${Styles[bgcolor]}`}>{item.Name}</span>;
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-lg-7">
              <p className={Styles.Tabletext}>Your Sales By Brand</p>

              <div className={Styles.donuttop}>
                {/* <p className={` text-center mt-3  ${Styles.Tabletextt}`}>Sum of Order</p> */}
                <p className={`text-end ${Styles.main_heading}`}>MANUFACTURER</p>
                {isLoaded ? (
                  <Loading />
                ) : (
                  <>
                    <Chart options={salesByBrandData.options} series={salesByBrandData.series} type="donut" className={Styles.donutchart} width="90%" height="400px" />
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-5">
              <p className={Styles.Tabletext}>Your Sales Performance Score in 2024</p>
              {false ? (
                <Loading />
              ) : (
                <>
                  {targetValue && achievedSales && Monthlydataa ? (
                    <>
                      <div className={Styles.donuttop1}>
                        <div className="container">
                          <p className={`text-end ${Styles.Tabletxt}`}>
                            Your Target: <span className={Styles.Tabletext_head}>{Number(targetValue) || 0}K</span>
                          </p>
                          <p className={`text-end ${Styles.Tabletxt1}`}>
                            Achieved Sales: <span className={Styles.Tabletext_head}>{Number(achievedSales) || 0}K</span>
                          </p>
                          <div className={Styles.donutbox}>
                            <PieChart width={400} height={400}>
                              <Pie dataKey="value" startAngle={180} endAngle={0} data={needle_data} cx={cx} cy={cy} innerRadius={iR} outerRadius={oR} fill="#8884d8" stroke="none">
                                {needle_data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              {needle(value, needle_data, cx, cy, iR, oR, "#000000")}
                            </PieChart>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>

          <div className="row mt-2 g-4">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className={Styles.dashbottom}>
                <div className={`text-center  ${Styles.active}`}>
                  <img src={img1} alt="" className={`text-center ${Styles.iconactive}`} />
                </div>
                <div className="">
                  <p className={`text-end ${Styles.activetext}`}>ACTIVE RETAILERS</p>
                  <h1 className={`text-end ${Styles.activetext1}`}>{box.RETAILERS}</h1>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className={Styles.dashbottom}>
                <div className={`text-center  ${Styles.active}`}>
                  <img src={img2} alt="" className={`text-center ${Styles.iconactive}`} />
                </div>
                <div className="">
                  <p className={`text-end ${Styles.activetext}`}>GROWTH 2023 VS 2024</p>
                  <h1 className={`text-end ${Styles.activetext1}`}>
                    {box.GROWTH}<span>%</span>
                  </h1>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className={Styles.dashbottom}>
                <div className={`text-center  ${Styles.active}`}>
                  <img src={img3} alt="" className={`text-center ${Styles.iconactive3}`} />
                </div>
                <div className="">
                  <p className={`text-end ${Styles.activetext}`}>TOTAL NO. OF ORDERS</p>
                  <h1 className={`text-end ${Styles.activetext1}`}>{box.ORDERS >= 1000 ? Number((Number(box.ORDERS) / 1000).toFixed(0)) + 'K' : box.ORDERS}</h1>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className={Styles.dashbottom}>
                <div className={`text-center  ${Styles.active}`}>
                  <img src={img4} alt="" className={`text-center ${Styles.iconactive4}`} />
                </div>
                <div className="">
                  <p className={`text-end ${Styles.activetext}`}>REVENUE</p>
                  <h1 className={`text-end ${Styles.activetext1}`}>${box.REVENUE >= 1000 ? (Number((Number(box.REVENUE) / 1000).toFixed(0)) + 'K') : box.REVENUE}</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="">
              <p className={Styles.Tabletext}>Total Sale By Brand</p>
              <div className={Styles.graphmain}>
                <Chart options={dataa.options} series={manufacturerSalesYear} type="area" width="100%" height="100%" />
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Dashboard;