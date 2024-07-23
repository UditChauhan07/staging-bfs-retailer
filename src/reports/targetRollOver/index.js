import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/AppLayout";
import Styles from "./index.module.css";
import { GetAuthData, getAllAccountBrand, getRollOver } from "../../lib/store";
import { FilterItem } from "../../components/FilterItem";
import { MdOutlineDownload } from "react-icons/md";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import ModalPage from "../../components/Modal UI";
import styles from "../../components/Modal UI/Styles.module.css";
import { useLocation } from "react-router-dom";
import { CloseButton, SearchIcon } from "../../lib/svg";
import LoaderV3 from "../../components/loader/v3";
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const TargetRollOver = () => {
    const location = useLocation();
    const { state } = location || {};
    const [manufacturerData, setManufacturerData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [target, setTarget] = useState({ ownerPermission: false, list: [] });
    const [manufacturerFilter, setManufacturerFilter] = useState();
    const [searchBy, setSearchBy] = useState("");
    let currentDate = new Date();
    const [year, setYear] = useState(currentDate.getFullYear());
    const [preOrder, setPreOrder] = useState(true);
    const [searchSaleBy, setSearchSaleBy] = useState("");
    const [salesRepList, setSalesRepList] = useState([]);
    const [exportToExcelState, setExportToExcelState] = useState(false);
    const [accountList, setAccountList] = useState([]);
    const [accountIds, setAccountIds] = useState(null);

    useEffect(() => {
        GetAuthData()
            .then((user) => {
                setAccountList(user.data.accountList)
                getRollOver({ key: user.data.x_access_token, accountIds: JSON.stringify( user.data.accountIds) })
                    .then((targetRes) => {
                        console.log({ targetRes });
                        if (targetRes) {
                            setIsLoaded(true);
                        }
                        let salesRep = [];
                        targetRes.map((tar) => {
                            if (!salesRep.includes(tar.SalesRepName)) {
                                salesRep.push(tar.SalesRepName);
                            }
                        });
                        setSalesRepList(salesRep);
                        setTarget({ ownerPermission: false, list: targetRes });
                        // setManufacturerFilter(targetRes.ownerPermission ? state?.manufacturerId : null);
                        setSearchSaleBy(targetRes.ownerPermission ? state?.salesRepId : null);
                    })
                    .catch((targetErr) => {
                        console.error({ targetErr });
                    });
                getAllAccountBrand({ key: user.data.x_access_token, accountIds: JSON.stringify(user.data.accountIds) })
                    .then((resManu) => {
                        setManufacturerData(resManu);
                    })
                    .catch((err) => {
                        console.log({ err });
                    });
            })
            .catch((userErr) => {
                console.error({ userErr });
            });
    }, []);
    const filteredTargetData = useMemo(() => {
        let filtered = target.list.filter((ele) => {
            if (!manufacturerFilter || !ele.ManufacturerId.localeCompare(manufacturerFilter)) {
                return ele;
            }
        });
        if (searchBy) {
            console.log({ searchBy });
            filtered = filtered.filter((item) => {
                if (item.AccountName?.toLowerCase().includes(searchBy?.toLowerCase())) {
                    return item;
                }
            });
        }
        if (searchSaleBy) {
            filtered = filtered.filter((item) => {
                if (item.SalesRepName?.toLowerCase().includes(searchSaleBy?.toLowerCase())) {
                    return item;
                }
            });
        }
        return filtered;
    }, [manufacturerFilter, searchBy, searchSaleBy, isLoaded]);
    const resetFilter = () => {
        setManufacturerFilter(null);
        setSearchBy("");
        setSearchSaleBy("");
        setYear(currentDate.getFullYear());
        setPreOrder(true);
        sendApiCall();
    };
    const PriceDisplay = (value) => {
        return `$${Number(value).toFixed(2)}`;
    };
    const allOrdersEmpty = filteredTargetData.every((item) => item.Orders?.length <= 0);
    const exportToExcel2 = () => {
        setExportToExcelState(false);

        const totalRow = {
            SalesRepName: "TOTAL",
            AccountName: "",
            ManufacturerName: "",
            JanuaryTarget: 0,
            JanuarySale: 0,
            JanuaryDiff: 0,

            FebruaryTarget: 0,
            FebruarySale: 0,
            FebruaryDiff: 0,

            MarchTarget: 0,
            MarchSale: 0,
            MarchDiff: 0,

            AprilTarget: 0,
            AprilSale: 0,
            AprilDiff: 0,

            MayTarget: 0,
            MaySale: 0,
            MayDiff: 0,

            JuneTarget: 0,
            JuneSale: 0,
            JuneDiff: 0,

            JulyTarget: 0,
            JulySale: 0,
            JulyDiff: 0,

            AugustTarget: 0,
            AugustSale: 0,
            AugustDiff: 0,

            SeptemberTarget: 0,
            SeptemberSale: 0,
            SeptemberDiff: 0,

            OctoberTarget: 0,
            OctoberSale: 0,
            OctoberDiff: 0,

            NovemberTarget: 0,
            NovemberSale: 0,
            NovemberDiff: 0,

            DecemberTarget: 0,
            DecemberSale: 0,
            DecemberDiff: 0,


            TotalTarget: 0,
            TotalSale: 0,
            TotalDiff: 0,
        };

        filteredTargetData.forEach(element => {
            totalRow.JanuaryTarget += parseFloat(element.January.target);
            totalRow.JanuarySale += parseFloat(element.January.sale);
            totalRow.JanuaryDiff += parseFloat(element.January.diff);

            totalRow.FebruaryTarget += parseFloat(element.February.target);
            totalRow.FebruarySale += parseFloat(element.February.sale);
            totalRow.FebruaryDiff += parseFloat(element.February.diff);

            totalRow.MarchTarget += parseFloat(element.March.target);
            totalRow.MarchSale += parseFloat(element.March.sale);
            totalRow.MarchDiff += parseFloat(element.March.diff);

            totalRow.AprilTarget += parseFloat(element.April.target);
            totalRow.AprilSale += parseFloat(element.April.sale);
            totalRow.AprilDiff += parseFloat(element.April.diff);

            totalRow.MayTarget += parseFloat(element.May.target);
            totalRow.MaySale += parseFloat(element.May.sale);
            totalRow.MayDiff += parseFloat(element.May.diff);

            totalRow.JuneTarget += parseFloat(element.June.target);
            totalRow.JuneSale += parseFloat(element.June.sale);
            totalRow.JuneDiff += parseFloat(element.June.diff);

            totalRow.JulyTarget += parseFloat(element.July.target);
            totalRow.JulySale += parseFloat(element.July.sale);
            totalRow.JulyDiff += parseFloat(element.July.diff);

            totalRow.AugustTarget += parseFloat(element.August.target);
            totalRow.AugustSale += parseFloat(element.August.sale);
            totalRow.AugustDiff += parseFloat(element.August.diff);

            totalRow.SeptemberTarget += parseFloat(element.September.target);
            totalRow.SeptemberSale += parseFloat(element.September.sale);
            totalRow.SeptemberDiff += parseFloat(element.September.diff);

            totalRow.OctoberTarget += parseFloat(element.October.target);
            totalRow.OctoberSale += parseFloat(element.October.sale);
            totalRow.OctoberDiff += parseFloat(element.October.diff);

            totalRow.NovemberTarget += parseFloat(element.November.target);
            totalRow.NovemberSale += parseFloat(element.November.sale);
            totalRow.NovemberDiff += parseFloat(element.November.diff);

            totalRow.DecemberTarget += parseFloat(element.December.target);
            totalRow.DecemberSale += parseFloat(element.December.sale);
            totalRow.DecemberDiff += parseFloat(element.December.diff);


            // Repeat the same for other months and total columns
            // ...
            totalRow.TotalTarget += parseFloat(element.Total.target);
            totalRow.TotalSale += parseFloat(element.Total.sale);
            totalRow.TotalDiff += parseFloat(element.Total.diff);
        });

        const dataWithTotalRow = [...csvData(), totalRow];
        const ws = XLSX.utils.json_to_sheet(dataWithTotalRow);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });

        let title = target.ownerPermission ? `${searchSaleBy ? searchSaleBy + "`s" : "All"} Target Report` : "Target Report";
        if (manufacturerFilter) {
            title += " for " + getManufactureName(manufacturerFilter);
        }
        title += ` ${new Date().toDateString()}`;

        FileSaver.saveAs(data, title + fileExtension);
    };

    const csvData = () => {
        let finalData = [];
        if (filteredTargetData.length) {
            filteredTargetData.map((target) => {
                let temp = {
                    SalesRepName: target.salesRepName,
                    Store: target.AccountName,
                    ManufacturerName: target.ManufacturerName,
                    JanuaryTarget: target.January.monthTarget,
                    JanuaryPurchase: target.January.sales,
                    JanuaryDiff: target.January.diff,

                    FebruaryTarget: target.February.monthTarget,
                    FebruaryPurchase: target.February.sales,
                    FebruaryDiff: target.February.diff,

                    MarchTarget: target.March.monthTarget,
                    MarchPurchase: target.March.sales,
                    MarchDiff: target.March.diff,

                    AprilTarget: target.April.monthTarget,
                    AprilPurchase: target.April.sales,
                    AprilDiff: target.April.diff,

                    MayTarget: target.May.monthTarget,
                    MayPurchase: target.May.sales,
                    MayDiff: target.May.diff,

                    JuneTarget: target.June.monthTarget,
                    JunePurchase: target.June.sales,
                    JuneDiff: target.June.diff,

                    JulyTarget: target.July.monthTarget,
                    JulyPurchase: target.July.sales,
                    JulyDiff: target.July.diff,

                    AugustTarget: target.August.monthTarget,
                    AugustPurchase: target.August.sales,
                    AugustDiff: target.August.diff,

                    SeptemberTarget: target.September.monthTarget,
                    SeptemberPurchase: target.September.sales,
                    SeptemberDiff: target.September.diff,

                    OctoberTarget: target.October.monthTarget,
                    OctoberPurchase: target.October.sales,
                    OctoberDiff: target.October.diff,

                    NovemberTarget: target.November.monthTarget,
                    NovemberPurchase: target.November.sales,
                    NovemberDiff: target.November.diff,

                    DecemberTarget: target.December.monthTarget,
                    DecemberPurchase: target.December.sales,
                    DecemberDiff: target.December.diff,

                    TotalTarget: target.Total.monthTarget,
                    TotalPurchase: target.Total.sales,
                    TotalDiff: target.Total.diff,
                };
                finalData.push(temp);
            });
        }
        return finalData;
    };

    const handleExportToExcel = () => {
        setExportToExcelState(true);
    };
    const getManufactureName = (id = null) => {
        if (id) {
            let name = null;
            manufacturerData?.map((manufacturer) => {
                if (manufacturer.Id == id) name = manufacturer.Name;
            });
            return name;
        }
    };
    const exportToExcel = () => {
        setExportToExcelState(false);
        const ws = XLSX.utils.json_to_sheet(csvData());
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        let title = target.ownerPermission ? `${searchSaleBy ? searchSaleBy + "`s" : "All"} Target Report` : "Target Report";
        if (manufacturerFilter) {
            title += " for " + getManufactureName(manufacturerFilter);
        }
        title += ` ${new Date().toDateString()}`;
        FileSaver.saveAs(data, title + fileExtension);
    };
    let monthTotalAmount = {
        Jan: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Feb: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Mar: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Apr: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        May: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Jun: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Jul: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Aug: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Sep: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Oct: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Nov: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Dec: {
            target: 0,
            sale: 0,
            diff: 0,
        },
        Total: {
            target: 0,
            sale: 0,
            diff: 0,
        },
    };
    const sendApiCall = () => {
        setIsLoaded(false);
        GetAuthData()
            .then((user) => {
                getRollOver({ key: user.data.x_access_token, accountIds })
                    .then((targetRes) => {
                        if (targetRes) {
                            setIsLoaded(true);
                        }
                        let salesRep = [];
                        targetRes.map((tar) => {
                            if (!salesRep.includes(tar.SalesRepName)) {
                                salesRep.push(tar.SalesRepName);
                            }
                        });
                        setSalesRepList(salesRep);
                        setTarget({ ownerPermission: false, list: targetRes });
                        // setManufacturerFilter(targetRes.ownerPermission ? state?.manufacturerId : manufacturerFilter);
                        setSearchSaleBy(targetRes.ownerPermission ? state?.salesRepId : searchSaleBy);
                    })
                    .catch((targetErr) => {
                        console.error({ targetErr });
                    });
            })
            .catch((userErr) => {
                console.error({ userErr });
            });
    };
    const formentAcmount = (amount, totalorderPrice, monthTotalAmount) => {
        return `${Number(amount, totalorderPrice, monthTotalAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }
    return (
        <AppLayout
            filterNodes={
                <div className="d-flex justify-content-between m-auto" style={{ width: "99%" }}>
                    <div className="d-flex justify-content-start col-6 gap-4">
                        {accountList?.length > 1 &&
                            <FilterItem
                                minWidth="220px"
                                label="All Store"
                                value={(accountIds && JSON.parse(accountIds)?.length == 1) ? JSON.parse(accountIds)[0] : null}

                                options={[...accountList.map((month, i) => ({
                                    label: month.Name,
                                    value: month.Id,
                                })), { label: 'All Accounts', value: null }]}
                                onChange={(value) => {
                                    if (value) {
                                        setAccountIds(JSON.stringify([value]))
                                    } else {
                                        setAccountIds()
                                    }
                                }}
                                name={"Account-menu"}
                            />}
                        <button onClick={() => sendApiCall()} className="border px-2 d-grid py-1 leading-tight flex justify-center align-center gap-1">
                            <SearchIcon fill="#fff" width={20} height={20} />
                            <small style={{ fontSize: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>search</small>
                        </button>
                    </div>
                    <div className="d-flex justify-content-start col-1">
                        <hr className={Styles.breakHolder} />
                    </div>
                    <div className="d-flex justify-content-end col-5 gap-4">
                        {target.ownerPermission && (
                            <FilterItem
                                minWidth="220px"
                                label="All Sales Rep"
                                value={searchSaleBy}
                                options={salesRepList.map((salerep) => ({
                                    label: salerep,
                                    value: salerep,
                                }))}
                                onChange={(value) => setSearchSaleBy(value)}
                                name="salesRepSearch"
                            />
                        )}
                        <FilterItem
                            minWidth="220px"
                            label="All Manufacturers"
                            value={manufacturerFilter}
                            options={manufacturerData?.map((manufacturer) => ({
                                label: manufacturer.Name,
                                value: manufacturer.Id,
                            }))}
                            onChange={(value) => setManufacturerFilter(value)}
                        />
                        <div className="d-flex gap-3">
                            <button className="border px-2.5 py-1 leading-tight d-grid" onClick={resetFilter}>
                                <CloseButton crossFill={"#fff"} height={20} width={20} />
                                <small style={{ fontSize: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>clear</small>
                            </button>
                            <button className="border px-2.5 py-1 leading-tight d-grid" onClick={handleExportToExcel}>
                                <MdOutlineDownload size={16} className="m-auto" />
                                <small style={{ fontSize: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>EXPORT</small>
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            {exportToExcelState && (
                <ModalPage
                    open
                    content={
                        <>
                            <div style={{ maxWidth: "370px" }}>
                                <h1 className={`fs-5 ${styles.ModalHeader}`}>Warning</h1>
                                <p className={` ${styles.ModalContent}`}>Do you want to download Target Report?</p>
                                <div className="d-flex justify-content-center gap-3 ">
                                    <button className={`${styles.modalButton}`} onClick={exportToExcel2}>
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
            {!isLoaded ? (
                <LoaderV3 text={"Loading Target Report, Please wait..."} />
            ) : (
                <section>
                    {true && (
                        <div className={Styles.inorderflex}>
                            <div>
                                <h2>
                                    {target.ownerPermission ? `${searchSaleBy ? searchSaleBy + "`s" : "All"} Target Report` : "Your Target Report"}
                                    {manufacturerFilter && " for " + getManufactureName(manufacturerFilter)}
                                </h2>
                            </div>
                            <div></div>
                        </div>
                    )}
                    <div className={`d-flex p-3 ${Styles.tableBoundary} mb-5`}>
                        <div className="" style={{ maxHeight: "73vh", minHeight: "40vh", overflow: "auto", width: "100%" }}>
                            <table id="salesReportTable" className="table table-responsive" style={{ minHeight: "600px" }}>
                                <thead>
                                    <tr>
                                        <th className={`${Styles.th} ${Styles.stickyFirstColumnHeading} `} style={{ minWidth: "170px" }}>
                                            Sales Rep
                                        </th>
                                        <th className={`${Styles.th} ${Styles.stickySecondColumnHeading}`} style={{ minWidth: "150px" }}>
                                            Store
                                        </th>
                                        <th className={`${Styles.th} ${Styles.stickyThirdColumnHeading}`} style={{ minWidth: "200px" }}>
                                            Manufacturer
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Jan Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Jan Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Jan Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Feb Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Feb Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Feb Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Mar Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Mar Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Mar Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Apr Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Apr Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Apr Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            May Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "155px" }}>
                                            May Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            May Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Jun Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Jun Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Jun Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Jul Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Jul Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Jul Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Aug Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Aug Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Aug Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Sep Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Sep Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Sep Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Oct Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Oct Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Oct Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Nov Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Nov Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Nov Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Dec Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "150px" }}>
                                            Dec Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>
                                            Dec Diff
                                        </th>

                                        <th className={`${Styles.month} ${Styles.stickyThirdLastColumnHeading}`} style={{ minWidth: "150px" }}>
                                            Yearly Target
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickySecondLastColumnHeading}`} style={{ minWidth: "200px" }}>
                                            Yearly Purchase
                                        </th>
                                        <th className={`${Styles.month} ${Styles.stickyLastColumnHeading}`} style={{ minWidth: "150px" }}>
                                            Yearly Diff
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allOrdersEmpty ? (
                                        <div className={`${styles.NodataText} py-4 w-full lg:min-h-[300px] xl:min-h-[380px]`} key="no-data">
                                            <p>No data found</p>
                                        </div>
                                    ) : (
                                        filteredTargetData.map((element, index) => {
                                            monthTotalAmount.Jan.target += Number(element.January.monthTarget);
                                            monthTotalAmount.Jan.sale += Number(element.January.sales);
                                            monthTotalAmount.Jan.diff += Number(element.January.diff);
                                            monthTotalAmount.Feb.target += Number(element.February.monthTarget);
                                            monthTotalAmount.Feb.sale += Number(element.February.sales);
                                            monthTotalAmount.Feb.diff += Number(element.February.diff);
                                            monthTotalAmount.Mar.target += Number(element.March.monthTarget);
                                            monthTotalAmount.Mar.sale += Number(element.March.sales);
                                            monthTotalAmount.Mar.diff += Number(element.March.diff);
                                            monthTotalAmount.Apr.target += Number(element.April.monthTarget);
                                            monthTotalAmount.Apr.sale += Number(element.April.sales);
                                            monthTotalAmount.Apr.diff += Number(element.April.diff);
                                            monthTotalAmount.May.target += Number(element.May.monthTarget);
                                            monthTotalAmount.May.sale += Number(element.May.sales);
                                            monthTotalAmount.May.diff += Number(element.May.diff);
                                            monthTotalAmount.Jun.target += Number(element.June.monthTarget);
                                            monthTotalAmount.Jun.sale += Number(element.June.sales);
                                            monthTotalAmount.Jun.diff += Number(element.June.diff);
                                            monthTotalAmount.Jul.target += Number(element.July.monthTarget);
                                            monthTotalAmount.Jul.sale += Number(element.July.sales);
                                            monthTotalAmount.Jul.diff += Number(element.July.diff);
                                            monthTotalAmount.Aug.target += Number(element.August.monthTarget);
                                            monthTotalAmount.Aug.sale += Number(element.August.sales);
                                            monthTotalAmount.Aug.diff += Number(element.August.diff);
                                            monthTotalAmount.Sep.target += Number(element.September.monthTarget);
                                            monthTotalAmount.Sep.sale += Number(element.September.sales);
                                            monthTotalAmount.Sep.diff += Number(element.September.diff);
                                            monthTotalAmount.Oct.target += Number(element.October.monthTarget);
                                            monthTotalAmount.Oct.sale += Number(element.October.sales);
                                            monthTotalAmount.Oct.diff += Number(element.October.diff);
                                            monthTotalAmount.Nov.target += Number(element.November.monthTarget);
                                            monthTotalAmount.Nov.sale += Number(element.November.sales);
                                            monthTotalAmount.Nov.diff += Number(element.November.diff);
                                            monthTotalAmount.Dec.target += Number(element.December.monthTarget);
                                            monthTotalAmount.Dec.sale += Number(element.December.sales);
                                            monthTotalAmount.Dec.diff += Number(element.December.diff);
                                            monthTotalAmount.Total.target += Number(element.Total.monthTarget);
                                            monthTotalAmount.Total.sale += Number(element.Total.sales);
                                            monthTotalAmount.Total.diff += Number(element.Total.diff);
                                            return (
                                                <tr key={index}>
                                                    <td className={`${Styles.td} ${Styles.stickyFirstColumn}`}>{element?.salesRepName}</td>
                                                    <td className={`${Styles.td} ${Styles.stickySecondColumn}`}>{element?.AccountName}</td>
                                                    <td className={`${Styles.td} ${Styles.stickyThirdColumn}`}>{element.ManufacturerName ?? '---'}</td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.January.monthTarget)}
                                                        {element.January.totalRoll ? (element.January.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.January.totalRoll)}</small>+{formentAcmount(element.January.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.January.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.January.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.January.sales)}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${element.January.diff>=0?formentAcmount(element.January.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.January.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.February.monthTarget)}
                                                        {element.February.totalRoll ? (element.February.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.February.totalRoll)}</small>+{formentAcmount(element.February.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.February.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.February.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.February.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.February.diff>=0?formentAcmount(element.February.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.February.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.March.monthTarget)}
                                                        {element.March.totalRoll ? (element.March.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.March.totalRoll)}</small>+{formentAcmount(element.March.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.March.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.March.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.March.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.March.diff>=0?formentAcmount(element.March.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.March.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.April.monthTarget)}
                                                        {element.April.totalRoll ? (element.April.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.April.totalRoll)}</small>+{formentAcmount(element.April.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.April.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.April.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.April.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.April.diff>=0?formentAcmount(element.April.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.April.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.May.monthTarget)}
                                                        {element.May.totalRoll ? (element.May.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.May.totalRoll)}</small>+{formentAcmount(element.May.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.May.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.May.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.May.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.May.diff>=0?formentAcmount(element.May.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.May.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.June.monthTarget)}
                                                        {element.June.totalRoll ? (element.June.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.June.totalRoll)}</small>+{formentAcmount(element.June.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.June.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.June.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.June.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.June.diff>=0?formentAcmount(element.June.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.June.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.July.monthTarget)}
                                                        {element.July.totalRoll ? (element.July.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.July.totalRoll)}</small>+{formentAcmount(element.July.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.July.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.July.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.July.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.July.diff>=0?formentAcmount(element.July.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.July.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.August.monthTarget)}
                                                        {element.August.totalRoll ? (element.August.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.August.totalRoll)}</small>+{formentAcmount(element.August.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.August.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.August.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.August.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.August.diff>=0?formentAcmount(element.August.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.August.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.September.monthTarget)}
                                                        {element.September.totalRoll ? (element.September.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.September.totalRoll)}</small>+{formentAcmount(element.September.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.September.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.September.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.September.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.September.diff>=0?formentAcmount(element.September.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.September.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.October.monthTarget)}
                                                        {element.October.totalRoll ? (element.October.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.October.totalRoll)}</small>+{formentAcmount(element.October.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.October.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.October.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.October.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.October.diff>=0?formentAcmount(element.October.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.October.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.November.monthTarget)}
                                                        {element.November.totalRoll ? (element.November.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.November.totalRoll)}</small>+{formentAcmount(element.November.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.November.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.November.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.November.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.November.diff>=0?formentAcmount(element.November.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.November.diff))}</b>}</td>

                                                    <td className={`${Styles.td}`}>${formentAcmount(element.December.monthTarget)}
                                                        {element.December.totalRoll ? (element.December.totalRoll > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formentAcmount(element.December.totalRoll)}</small>+{formentAcmount(element.December.staticTarget)}</p></> : false?<><br /><p className={Styles.calHolder}>{formentAcmount(element.December.staticTarget)}-<small style={{ color: 'green' }}>{formentAcmount(-element.December.totalRoll)}</small></p></>:null) : null}
                                                    </td>
                                                    <td className={`${Styles.td}`}>${formentAcmount(element.December.sales)}</td>
                                                    <td className={`${Styles.td}`}>${element.December.diff>=0?formentAcmount(element.December.diff):<b style={{ color: 'green' }}>{formentAcmount(Math.abs(element.December.diff))}</b>}</td>

                                                    <td className={`${Styles.td} ${Styles.stickyThirdLastColumn}`}>${formentAcmount(element.Total.monthTarget)}
                                                    </td>
                                                    <td className={`${Styles.td} ${Styles.stickySecondLastColumn}`}>${formentAcmount(element.Total.sales)}</td>
                                                    <td className={`${Styles.td} ${Styles.stickyLastColumn}`}>${formentAcmount(element.Total.diff)}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className={`${Styles.lastRow} ${Styles.stickyFirstColumn} ${Styles.stickyLastRow}`} colSpan={3}>
                                            TOTAL
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Jan.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Jan.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Jan.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Feb.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Feb.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Feb.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Mar.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Mar.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Mar.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Apr.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Apr.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Apr.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.May.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.May.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.May.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Jun.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Jun.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Jun.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Jul.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Jul.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Jul.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Aug.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Aug.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Aug.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Sep.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Sep.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Sep.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Oct.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Oct.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Oct.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Nov.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Nov.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Nov.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Dec.target)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Dec.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                            ${formentAcmount(monthTotalAmount.Dec.diff)}
                                        </td>
                                        <td className={`${Styles.lastRow} ${Styles.stickyLastRow} ${Styles.stickyThirdLastColumn}`}>
                                            ${formentAcmount(monthTotalAmount.Total.target)}
                                        </td>
                                        <td className={`${Styles.lastRow} ${Styles.stickyLastRow} ${Styles.stickySecondLastColumn}`}>
                                            ${formentAcmount(monthTotalAmount.Total.sale)}
                                        </td>
                                        <td className={`${Styles.lastRow} ${Styles.stickyLastRow} ${Styles.stickyLastColumn}`}>
                                            ${formentAcmount(monthTotalAmount.Total.diff)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>{" "}
                </section>
            )}
        </AppLayout>
    );
};
export default TargetRollOver;
