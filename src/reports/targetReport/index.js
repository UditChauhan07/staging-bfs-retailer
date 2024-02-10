import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/AppLayout";
import Styles from "./index.module.css";
import { GetAuthData, getTargetReportAll } from "../../lib/store";
import Loading from "../../components/Loading";
import { useManufacturer } from "../../api/useManufacturer";
import { FilterItem } from "../../components/FilterItem";
import FilterSearch from "../../components/FilterSearch";
import { MdOutlineDownload } from "react-icons/md";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import ModalPage from "../../components/Modal UI";
import styles from "../../components/Modal UI/Styles.module.css";
import { useLocation } from 'react-router-dom';
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const TargetReport = () => {
    const location = useLocation();
    const {state} = location||{};
    const { data: manufacturers } = useManufacturer();
    const [isLoaded, setIsLoaded] = useState(false);
    const [target, setTarget] = useState({ ownerPermission: false, list: [] });
    const [manufacturerFilter, setManufacturerFilter] = useState();
    const [searchBy, setSearchBy] = useState("");
    const [searchSaleBy, setSearchSaleBy] = useState("");
    const [salesRepList,setSalesRepList] = useState([]);
    const [exportToExcelState, setExportToExcelState] = useState(false);
    useEffect(() => {
        GetAuthData().then((user) => {
            getTargetReportAll({ user }).then((targetRes) => {
                if (targetRes) {
                    setIsLoaded(true)
                }
                let salesRep = [];
                targetRes.list.map((tar)=>{
                    if(!salesRep.includes(tar.SalesRepName)){
                        salesRep.push(tar.SalesRepName)
                    }
                })
                setSalesRepList(salesRep)
                setTarget(targetRes)
                setManufacturerFilter(targetRes.ownerPermission ? state?.manufacturerId:null)
                setSearchSaleBy(targetRes.ownerPermission ? state?.salesRepId:null)
            }).catch((targetErr) => {
                console.error({ targetErr });
            })
        }).catch((userErr) => {
            console.error({ userErr });
        })
    }, [])
    const filteredTargetData = useMemo(() => {
        let filtered = target.list.filter((ele) => {
            if (!manufacturerFilter || !ele.ManufacturerId.localeCompare(manufacturerFilter)) {
                return ele;
            }
        });
        if (searchBy) {
            console.log({searchBy});
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
        setSearchSaleBy("")
    };
    const PriceDisplay = (value) => {
        return `$${Number(value).toFixed(2)}`;
    };
    const csvData = () => {
        let finalData = [];
        if (filteredTargetData.length) {
            filteredTargetData.map((target) => {
                let temp = {
                    SalesRepName: target.SalesRepName,
                    AccountName: target.AccountName,
                    ManufacturerName: target.ManufacturerName,
                    JanuaryTarget: target.January.target,
                    JanuarySale: target.January.sale,
                    JanuaryDiff: target.January.diff,

                    FebruaryTarget: target.February.target,
                    FebruarySale: target.February.sale,
                    FebruaryDiff: target.February.diff,

                    MarchTarget: target.March.target,
                    MarchSale: target.March.sale,
                    MarchDiff: target.March.diff,

                    AprilTarget: target.April.target,
                    AprilSale: target.April.sale,
                    AprilDiff: target.April.diff,

                    MayTarget: target.May.target,
                    MaySale: target.May.sale,
                    MayDiff: target.May.diff,

                    JuneTarget: target.June.target,
                    JuneSale: target.June.sale,
                    JuneDiff: target.June.diff,

                    JulyTarget: target.July.target,
                    JulySale: target.July.sale,
                    JulyDiff: target.July.diff,

                    AugustTarget: target.August.target,
                    AugustSale: target.August.sale,
                    AugustDiff: target.August.diff,

                    SeptemberTarget: target.September.target,
                    SeptemberSale: target.September.sale,
                    SeptemberDiff: target.September.diff,

                    OctoberTarget: target.October.target,
                    OctoberSale: target.October.sale,
                    OctoberDiff: target.October.diff,

                    NovemberTarget: target.November.target,
                    NovemberSale: target.November.sale,
                    NovemberDiff: target.November.diff,

                    DecemberTarget: target.December.target,
                    DecemberSale: target.December.sale,
                    DecemberDiff: target.December.diff,

                    TotalTarget: target.Total.target,
                    TotalSale: target.Total.sale,
                    TotalDiff: target.Total.diff,
                }
                finalData.push(temp)
            })
        }
        return finalData;
    };

    const handleExportToExcel = () => {
        setExportToExcelState(true);
    };
    const exportToExcel = () => {
        setExportToExcelState(false);
        const ws = XLSX.utils.json_to_sheet(csvData());
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, `Target Report ${new Date().toDateString()}` + fileExtension);
    };
    let monthTotalAmount = {
        Jan: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Feb: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Mar: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Apr: {
            target: 0,
            sale: 0,
            diff: 0
        },
        May: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Jun: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Jul: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Aug: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Sep: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Oct: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Nov: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Dec: {
            target: 0,
            sale: 0,
            diff: 0
        },
        Total: {
            target: 0,
            sale: 0,
            diff: 0
        }
    };
    return (<AppLayout filterNodes={<>
        {target.ownerPermission &&
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
        />}
                    
        <FilterSearch onChange={(e) => setSearchBy(e.target.value)} value={searchBy} placeholder={"Search by account"} minWidth={"167px"} />
        <FilterItem
            minWidth="220px"
            label="All Manufacturers"
            value={manufacturerFilter}
            options={manufacturers?.data?.map((manufacturer) => ({
                label: manufacturer.Name,
                value: manufacturer.Id,
            }))}
            onChange={(value) => setManufacturerFilter(value)}
        />
        <div className="d-flex gap-3">
            <button className="border px-2.5 py-1 leading-tight" onClick={resetFilter}>
                CLEAR ALL
            </button>
            <button className="border px-2.5 py-1 leading-tight flex justify-center align-center gap-1" onClick={handleExportToExcel}>
                EXPORT
                <MdOutlineDownload size={16} />
            </button>
        </div>

        {/* <button className="border px-2.5 py-1 leading-tight flex justify-center align-center gap-1" onClick={handleExportToExcel}>
            EXPORT
            <MdOutlineDownload size={16} />
          </button> */}
    </>}>
        {exportToExcelState && (
            <ModalPage
                open
                content={
                    <>
                        <div style={{ maxWidth: "370px" }}>
                            <h1 className={`fs-5 ${styles.ModalHeader}`}>Warning</h1>
                            <p className={` ${styles.ModalContent}`}>Do you want to download Target Report?</p>
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
        {!isLoaded ? (<Loading />) :
            <section>
                {false && <div className={Styles.inorderflex}>
                    <div>
                        <h2>
                            {target.ownerPermission ? `${searchSaleBy ? searchSaleBy + "`s" : "All"} Sales Report` : "Your Target Report"}
                            {manufacturerFilter && " for " + manufacturerFilter}
                        </h2>
                    </div>
                    <div>
                        <div className={`d-flex align-items-center ${Styles.InputControll}`}>
                            <select onChange={(e) => null}>
                                {/* selected={yearFor == 2023 ? true : false} */}
                                <option value={2023} >
                                    2023
                                </option>
                                <option value={2024}>
                                    2024
                                </option>
                            </select>
                            <select onChange={(e) => null}>
                                {/* selected={yearFor == 2023 ? true : false} */}
                                <option value={null} >
                                    With Pre-Order
                                </option>
                                <option value={'WOPO'}>
                                    With out Pre-Order
                                </option>
                            </select>
                            {/* onClick={() => sendApiCall()} */}
                            <button >Search Sales</button>
                        </div>
                    </div>
                </div>}
                <div className={`d-flex p-3 ${Styles.tableBoundary} mb-5`}>
                    <div
                        className=""
                        style={{ maxHeight: "73vh", minHeight: "40vh", overflow: "auto", width: '100%' }}
                    >
                        <table id="salesReportTable" className="table table-responsive">
                            <thead>
                                <tr>
                                    <th
                                        className={`${Styles.th} ${Styles.stickyFirstColumnHeading} `}
                                        style={{ minWidth: "170px" }}
                                    >
                                        Sales Rep
                                    </th>
                                    <th
                                        className={`${Styles.th} ${Styles.stickySecondColumnHeading}`}
                                        style={{ minWidth: "150px" }}
                                    >
                                        Account
                                    </th>
                                    <th
                                        className={`${Styles.th} ${Styles.stickyThirdColumnHeading}`}
                                        style={{ minWidth: "200px" }}
                                    >
                                        Manufacturer
                                    </th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Jan Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Jan Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Jan Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Feb Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Feb Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Feb Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Mar Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Mar Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Mar Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Apr Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Apr Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Apr Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>May Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>May Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>May Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Jun Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Jun Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Jun Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Jul Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Jul Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Jul Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Aug Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Aug Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Aug Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Sep Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Sep Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Sep Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Oct Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Oct Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Oct Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Nov Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Nov Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Nov Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Dec Target</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Dec Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyMonth}`} style={{ minWidth: "125px" }}>Dec Diff</th>

                                    <th className={`${Styles.month} ${Styles.stickyThirdLastColumnHeading}`} style={{ minWidth: "150px" }}>Total Year Target</th>
                                    <th className={`${Styles.month} ${Styles.stickySecondLastColumnHeading}`} style={{ minWidth: "150px" }}>Total Year Sales</th>
                                    <th className={`${Styles.month} ${Styles.stickyLastColumnHeading}`} style={{ minWidth: "150px" }}>Total Year Diff</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTargetData.map((element, index) => {
                                    monthTotalAmount.Jan.target += Number(element.January.target);
                                    monthTotalAmount.Jan.sale += Number(element.January.sale);
                                    monthTotalAmount.Jan.diff += Number(element.January.diff);
                                    monthTotalAmount.Feb.target += Number(element.February.target);
                                    monthTotalAmount.Feb.sale += Number(element.February.sale);
                                    monthTotalAmount.Feb.diff += Number(element.February.diff);
                                    monthTotalAmount.Mar.target += Number(element.March.target);
                                    monthTotalAmount.Mar.sale += Number(element.March.sale);
                                    monthTotalAmount.Mar.diff += Number(element.March.diff);
                                    monthTotalAmount.Apr.target += Number(element.April.target);
                                    monthTotalAmount.Apr.sale += Number(element.April.sale);
                                    monthTotalAmount.Apr.diff += Number(element.April.diff);
                                    monthTotalAmount.May.target += Number(element.May.target);
                                    monthTotalAmount.May.sale += Number(element.May.sale);
                                    monthTotalAmount.May.diff += Number(element.May.diff);
                                    monthTotalAmount.Jun.target += Number(element.June.target);
                                    monthTotalAmount.Jun.sale += Number(element.June.sale);
                                    monthTotalAmount.Jun.diff += Number(element.June.diff);
                                    monthTotalAmount.Jul.target += Number(element.July.target);
                                    monthTotalAmount.Jul.sale += Number(element.July.sale);
                                    monthTotalAmount.Jul.diff += Number(element.July.diff);
                                    monthTotalAmount.Aug.target += Number(element.August.target);
                                    monthTotalAmount.Aug.sale += Number(element.August.sale);
                                    monthTotalAmount.Aug.diff += Number(element.August.diff);
                                    monthTotalAmount.Sep.target += Number(element.September.target);
                                    monthTotalAmount.Sep.sale += Number(element.September.sale);
                                    monthTotalAmount.Sep.diff += Number(element.September.diff);
                                    monthTotalAmount.Oct.target += Number(element.October.target);
                                    monthTotalAmount.Oct.sale += Number(element.October.sale);
                                    monthTotalAmount.Oct.diff += Number(element.October.diff);
                                    monthTotalAmount.Nov.target += Number(element.November.target);
                                    monthTotalAmount.Nov.sale += Number(element.November.sale);
                                    monthTotalAmount.Nov.diff += Number(element.November.diff);
                                    monthTotalAmount.Dec.target += Number(element.December.target);
                                    monthTotalAmount.Dec.sale += Number(element.December.sale);
                                    monthTotalAmount.Dec.diff += Number(element.December.diff);
                                    monthTotalAmount.Total.target += Number(element.Total.target);
                                    monthTotalAmount.Total.sale += Number(element.Total.sale);
                                    monthTotalAmount.Total.diff += Number(element.Total.diff);
                                    return (
                                        <tr key={index}>
                                            <td
                                                className={`${Styles.td} ${Styles.stickyFirstColumn}`}
                                            >
                                                {element?.SalesRepName}
                                            </td>
                                            <td
                                                className={`${Styles.td} ${Styles.stickySecondColumn}`}
                                            >
                                                {element?.AccountName}
                                            </td>
                                            <td
                                                className={`${Styles.td} ${Styles.stickyThirdColumn}`}
                                            >
                                                {element.ManufacturerName}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.January.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.January.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.January.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.February.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.February.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.February.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.March.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.March.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.March.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.April.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.April.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.April.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.May.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.May.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.May.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.June.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.June.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.June.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.July.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.July.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.July.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.August.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.August.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.August.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.September.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.September.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.September.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.October.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.October.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.October.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.November.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.November.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.November.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td}`}>
                                                ${Number(element.December.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.December.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td}`}>
                                                ${Number(element.December.diff).toFixed(2)}
                                            </td>

                                            <td className={`${Styles.td} ${Styles.stickyThirdLastColumn}`}>
                                                ${Number(element.Total.target).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td} ${Styles.stickySecondLastColumn}`}>
                                                ${Number(element.Total.sale).toFixed(2)}
                                            </td>
                                            <td className={`${Styles.td} ${Styles.stickyLastColumn}`}>
                                                ${Number(element.Total.diff).toFixed(2)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td
                                        className={`${Styles.lastRow} ${Styles.stickyFirstColumn} ${Styles.stickyLastRow}`}
                                        colSpan={3}
                                    >
                                        TOTAL
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Jan.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Jan.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Jan.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Feb.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Feb.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Feb.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Mar.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Mar.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Mar.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Apr.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Apr.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Apr.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.May.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.May.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.May.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Jun.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Jun.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Jun.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Jul.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Jul.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Jul.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Aug.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Aug.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Aug.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Sep.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Sep.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Sep.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Oct.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Oct.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Oct.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Nov.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Nov.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Nov.diff).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Dec.target).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Dec.sale).toFixed(2)}
                                    </td>
                                    <td className={`${Styles.lastRow}  ${Styles.lastRowMonth}  ${Styles.stickyLastRow}`}>
                                        ${Number(monthTotalAmount.Dec.diff).toFixed(2)}
                                    </td>
                                    <td
                                        className={`${Styles.lastRow} ${Styles.stickyLastRow} ${Styles.stickyThirdLastColumn}`}
                                    >
                                        ${Number(monthTotalAmount.Total.target).toFixed(2)}
                                    </td>
                                    <td
                                        className={`${Styles.lastRow} ${Styles.stickyLastRow} ${Styles.stickySecondLastColumn}`}
                                    >
                                        ${Number(monthTotalAmount.Total.sale).toFixed(2)}
                                    </td>
                                    <td
                                        className={`${Styles.lastRow} ${Styles.stickyLastRow} ${Styles.stickyLastColumn}`}
                                    >
                                        ${Number(monthTotalAmount.Total.diff).toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>        </section>}
    </AppLayout>)
}
export default TargetReport