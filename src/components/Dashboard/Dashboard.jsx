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
  const [accountPerformance, setAccountPerformance] = useState({ isLoaded: false, data: [] });
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
    if (!AuthCheck()) {
      // navigate("/");
    }
    getDataHandler({ month: 2, year: 2024 });
  }, []);
  const [salesRepId, setSalesRepId] = useState();
  const getDataHandler = (headers = null) => {
    // setIsLoaded(true);
    GetAuthData()
      .then((user) => {
        setSalesRepId(user.Sales_Rep__c);
        if (headers) {
          user.headers = headers;
        }
        getDashboardata({ user })
          .then((dashboard) => {
            console.log({ dashboard });
            setBox({ RETAILERS: dashboard?.activeAccount || 0, GROWTH: 0, ORDERS: dashboard?.totalOrder || 0, REVENUE: dashboard?.totalPrice || 0, TARGET: dashboard.salesRepTarget || 0 })
            if (dashboard.rawPerformance) {
              setAccountPerformance({ isLoaded: true, data: dashboard.rawPerformance })
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
  }, []);
  useEffect(() => {
    setNeedle_data([
      { name: "A", value: parseInt(targetValue > 0 ? targetValue : achievedSales), color: "#16BC4E" },
      { name: "B", value: parseInt(targetValue > 0 ? targetValue - achievedSales > 0 ? targetValue - achievedSales || 0 : 0 : targetValue), color: "#C7C7C7" },
    ]);
  }, [targetValue, achievedSales]);
  let lowPerformanceArray = accountPerformance?.data?.slice(0).reverse().map((ele) => ele);

  const changeMonthHandler = (value) => {
    setIsLoading(false);
    setAccountPerformance({ isLoaded: false, data: [] })
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
    if (value == 0 && value < total) {
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
                  {targetValue && achievedSales ? (
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