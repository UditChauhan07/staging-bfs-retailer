import { useEffect, useState, forwardRef } from "react";
import CustomerSupportLayout from "../components/customerSupportLayout";
import BMAIHandler from "../components/IssuesHandler/BMAIHandler";
import Attachements from "../components/IssuesHandler/Attachements";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getAllAccountBrand, getAllAccountOrders, GetAuthData } from "../lib/store";
import { CalenderIcon } from "../lib/svg";
const PortalHelp = () => {
    const [vType, setVType] = useState({ main: null, child: null });
    const [files, setFile] = useState([]);
    const [desc, setDesc] = useState();
    const [confirm, setConfirm] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState();
    const [browserInfo, setBrowserInfo] = useState();
    const [manufacturer, setManufacturer] = useState();
    const [orderId, setOrderId] = useState();
    const [subject, setSubject] = useState();
    const [orderType, setOrderType] = useState();
    const [orderDate, setOrderDate] = useState();
    const [manufacturerList, setManufacturerList] = useState([]);
    const [pageAffected, setPageAffected] = useState();

    useEffect(() => {
        GetAuthData().then((user) => {
            getAllAccountBrand({ key: user.data.x_access_token, accountIds: JSON.stringify(user.data.accountIds) }).then((brands) => {
                setManufacturerList(brands);
            }).catch((brandErr) => {
                console.log({ brandErr });
            })
        }).catch((err) => {
            console.log({ err });

        })
    }, [])
    let visitType = [
        { name: "Portal Issues", icon: '/assets/images/portalIssuesicon.svg', desc: "Get Support for All Things Portal" },
        { name: "Order Issues", icon: '/assets/images/orderIssuesIcon.svg', desc: "Find Solutions for Your Order Problems" },
        { name: "Information Issues", icon: '/assets/images/infoIcon.svg', desc: "Unlocking Solutions for Information Issues" },
    ]
    let orderIssues = [
        {
            name: "Where is my order?", icon: '/assets/images/orderUnknownIcon.png',
            desc: "Your Order Journey: Where is it Now?"
        },
        {
            name: "Not able to Order", icon: '/assets/images/orderFailedIcon.png',
            desc: "Addressing Your Concerns About Ordering"
        },
    ]












    let orderTypes = [
        { label: "Wholesale Numbers", value: "Wholesale Numbers" },
        { label: "New Business", value: "New Business" },
        { label: "Tester Order", value: "Tester Order" },
        { label: "Pre order", value: "Pre order" },
        { label: "GWP", value: "GWP" },
        { label: "Display/ Display Updates", value: "Display/ Display Updates" },
        { label: "Cancelled Order", value: "Cancelled Order" },
        { label: "Holiday 2023", value: "Holiday 2023" },
        { label: "Spring 2024", value: "Spring 2024" },
        { label: "Spring 2024-A", value: "Spring 2024-A" },
        { label: "Cancelled and Re-entered", value: "Cancelled and Re-entered" },
        { label: "Event Order", value: "Event Order" }
    ]
    const devices = [
        { label: 'Android', value: 'Android' },
        { label: 'iOS', value: 'iOS' },
        { label: 'Windows', value: 'Windows' },
        { label: 'Mac', value: 'Mac' },
        { label: 'Linux', value: 'Linux' },
        { label: 'Chrome OS', value: 'Chrome OS' },
        { label: 'iPadOS', value: 'iPadOS' },
        { label: 'Other', value: 'Other' }
    ];
    const browsers = [
        { label: 'Google Chrome', value: 'Chrome' },
        { label: 'Mozilla Firefox', value: 'Firefox' },
        { label: 'Microsoft Edge', value: 'Edge' },
        { label: 'Apple Safari', value: 'Safari' },
        { label: 'Opera', value: 'Opera' },
        { label: 'Brave', value: 'Brave' },
        { label: 'Vivaldi', value: 'Vivaldi' },
        { label: 'Samsung Internet', value: 'Samsung Internet' },
        { label: 'Tor Browser', value: 'Tor' },
        { label: 'DuckDuckGo Privacy Browser', value: 'DuckDuckGo' },
        { label: 'Opera Mini', value: 'Opera Mini' },
        { label: 'Internet Explorer', value: 'Internet Explorer' }
    ];
    const pages = [
        { label: "Dashboard", value: "Dashboard" },
        { label: "Orders", value: "Orders" },
        { label: "Marketing Calendar", value: "Marketing Calendar" },
        { label: "Reports", value: "Reports" }
    ]
    let styles = {
        holder: {
            border: '1px dashed #ccc',
            padding: '10px',
            width: '100%',
            marginBottom: '20px'
        },
        title: {
            color: '#000',
            textAlign: 'left',
            fontFamily: 'Montserrat',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '24px',
            letterSpacing: '2.2px',
            textTransform: 'uppercase'
        },
        field: {
            width: '100%',
            minHeight: '40px',
            borderBottom: '1px solid #ccc',
            borderRadius: '10px',
            background: '#f4f4f4'
        }
    }


    // Function to get the browser information
    const getBrowserInfo = () => {
        const userAgent = navigator.userAgent;
        let browser = "Unknown";

        if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1 && userAgent.indexOf("OPR") === -1) {
            browser = "Chrome"; // Google Chrome
        } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
            browser = "Safari"; // Apple Safari
        } else if (userAgent.indexOf("Firefox") > -1) {
            browser = "Firefox"; // Mozilla Firefox
        } else if (userAgent.indexOf("Edg") > -1) {
            browser = "Edge"; // Microsoft Edge
        } else if (userAgent.indexOf("OPR") > -1 || userAgent.indexOf("Opera") > -1) {
            browser = "Opera"; // Opera
        } else if (userAgent.indexOf("Brave") > -1) {
            browser = "Brave"; // Brave
        } else if (userAgent.indexOf("Vivaldi") > -1) {
            browser = "Vivaldi"; // Vivaldi
        } else if (userAgent.indexOf("SamsungBrowser") > -1) {
            browser = "Samsung Internet"; // Samsung Internet
        } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
            browser = "Internet Explorer"; // Internet Explorer
        } else if (userAgent.indexOf("DuckDuckGo") > -1) {
            browser = "DuckDuckGo"; // DuckDuckGo Privacy Browser
        } else if (userAgent.indexOf("OPiMini") > -1) {
            browser = "Opera Mini"; // Opera Mini
        }

        return browser;
    };

    // Use useEffect to run the function when the component mounts
    useEffect(() => {
        const browser = getBrowserInfo();
        setBrowserInfo({ value: browser });
    }, []);

    // Function to detect the device type
    const getDeviceInfo = () => {
        const userAgent = navigator.userAgent;

        // Device detection logic to match your predefined options
        if (/Android/i.test(userAgent)) {
            return 'Android';
        } else if (/iPhone|iPod/i.test(userAgent)) {
            return 'iOS'; // iOS for iPhones
        } else if (/iPad/i.test(userAgent)) {
            return 'iPadOS'; // iPadOS for iPads
        } else if (/Windows NT/i.test(userAgent)) {
            return 'Windows';
        } else if (/Mac OS/i.test(userAgent) && !/iPhone|iPad/i.test(userAgent)) {
            return 'Mac';
        } else if (/Linux/i.test(userAgent)) {
            return 'Linux';
        } else if (/CrOS/i.test(userAgent)) {
            return 'Chrome OS';
        } else {
            return 'Other'; // Default case for unmatched devices
        }
    };


    // Use useEffect to run the function when the component mounts
    useEffect(() => {
        const device = getDeviceInfo();
        setDeviceInfo({ value: device });
    }, []);


    const HtmlFieldInput = ({ id, title, value, onChange, type = 'text' }) => {
        return (<div style={styles.holder}>
            <p style={styles.title}>{title}</p>
            <input type={type} style={styles.field} id={id} value={value} onKeyUp={onChange} />
        </div>)
    }

    const HtmlFieldSelect = ({ title, list = [], value, onChange }) => {
        return (<div style={styles.holder}>
            <p style={styles.title}>{title}</p>
            <Select
                type="text"
                options={list}
                onChange={(option) => {
                    onChange?.(option)
                }}
                value={list ? list.find((option) => option.value === value?.value) : ""}
            />
        </div>)
    }
    console.log({
        form: {
            reason: vType.main,
            type: vType.child,
            device: deviceInfo?.value || "NA",
            browser: browserInfo?.value || "NA",
            files, desc, manufacturer, orderId, subject, orderDate, orderType, pageAffected: pageAffected?.value
        }
    });

    const ResetHandler = () => {
        setDesc('');
        const device = getDeviceInfo();
        setDeviceInfo({ value: device });
        const browser = getBrowserInfo();
        setBrowserInfo({ value: browser });
        setFile([])
        setPageAffected();
    }
    const DatePickerLabel = forwardRef(({ value, onClick }, ref) => (
        <button type='button' className='w-[100%] d-flex justify-content-between align-items-center m-0' style={{ background: '#fff', color: '#000', height: '38px', padding: '15px' }} onClick={onClick} ref={ref}>
            <span>{value}</span>
            <CalenderIcon fill='#000' />
        </button>
    ));

    const getSelectDateOrder = (value) => {
        let date = new Date(value);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD
        console.log({formattedDate});
        
        setOrderDate(value)
        // GetAuthData()
        //     .then((response) => {
        //         getAllAccountOrders({
        //             key: response.data.x_access_token,
        //             accountIds: JSON.stringify(response.data.accountIds),
        //             date: formattedDate,
        //         })
        //             .then((order) => {
        //                 console.log({ order });
        //             })
        //             .catch((error) => {
        //                 console.log({ error });
        //             });
        //     })
        //     .catch((err) => {
        //         console.log({ err });
        //     });
    }

    return (<CustomerSupportLayout>
        <BMAIHandler reasons={visitType} setReason={(reason) => setVType({ main: reason })} reason={vType.main} resetHandler={ResetHandler} />
        {vType?.main == "Order Issues" ? <BMAIHandler reasons={orderIssues} setReason={(reason) => {
            setVType((prevState) => ({
                ...prevState,        // Spread the previous state
                child: reason // Update the child value
            }));
        }} reason={vType.child} resetHandler={null} /> : null}
        <Attachements files={files} setFile={setFile} setDesc={setDesc} orderConfirmed={(vType?.main == "Order Issues" && vType.child) ? true : (vType?.main && vType?.main != "Order Issues") ? true : false} setConfirm={setConfirm}>
            {vType?.main == "Information Issues" ?
                <HtmlFieldInput id={"subject"} title={"Issues Related to"} value={subject} onChange={(value) => setSubject(value.target.value)
                } />
                : vType?.main == "Order Issues" ? <>
                    {vType.child == "Where is my order?" ?
                        <>
                            <div className=" mr-2 w-full">
                                {/* <HtmlFieldInput title={'Order Date'} id={'OD'} type="date" value={orderDate} onChange={(value) => setOrderDate(value)
                            }/> */}
                                <div id="needHelpDatePickerHolder" style={styles.holder}>
                                    <p style={styles.title}>{'Order Date'}</p>
                                    <DatePicker
                                        selected={orderDate}
                                        onChange={(value) => getSelectDateOrder(value)}
                                        dateFormat="MMM/dd/yyyy"
                                        popperPlacement="auto"
                                        // minDate={minDate}
                                        // maxDate={maxDate}
                                        popperModifiers={{
                                            preventOverflow: {
                                                enabled: true,
                                            },
                                        }}
                                        customInput={<DatePickerLabel />}
                                    />
                                </div>
                            </div>
                            <div className="ml-2 mr-2 w-full">
                                <HtmlFieldSelect title={"List of Orders"} list={[]} value={orderId} onChange={(value) => setOrderId(value)
                                } />
                            </div>
                        </>
                        : vType.child == "Not able to Order" ?
                            <>
                                <div className=" mr-2 w-full">
                                    <HtmlFieldSelect title={"Choose Brand"} list={manufacturerList.map((manufacturer) => ({
                                        label: manufacturer.Name,
                                        value: manufacturer.Id,
                                    }))} value={manufacturer} onChange={(value) => setManufacturer(value)
                                    } />
                                </div>
                                <div className="ml-2 mr-2 w-full">
                                    <HtmlFieldSelect title={"Choose Order Type"} list={orderTypes} value={orderType} onChange={(value) => setOrderType(value)
                                    } />
                                </div>
                            </>
                            :
                            null}
                </> : vType?.main == "Portal Issues" ?
                    <>
                        <div className=" mr-2 w-full">
                            <HtmlFieldSelect title={"Device"} list={devices} value={deviceInfo} onChange={(value) => setDeviceInfo(value)
                            } />
                        </div>
                        <div className="ml-2 mr-2 w-full">
                            <HtmlFieldSelect title={"Browser"} list={browsers} value={browserInfo} onChange={(value) => setBrowserInfo(value)
                            } />
                        </div>
                        <div className="ml-2 w-full">
                            <HtmlFieldSelect title={"Page Affected"} list={pages} value={pageAffected} onChange={(value) => setPageAffected(value)
                            } />
                        </div>
                    </> : null}
        </Attachements>
    </CustomerSupportLayout>)
}
export default PortalHelp;