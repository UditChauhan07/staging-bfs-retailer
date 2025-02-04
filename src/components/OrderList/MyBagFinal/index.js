import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Styles from "./Styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import { GetAuthData, ShareDrive, defaultLoadTime, getOrderDetailId, getOrderDetailsInvoice, getProductImageAll, postSupport, supportShare } from "../../../lib/store";
import { MdOutlineDownload } from "react-icons/md";
import LoaderV2 from "../../loader/v2";
import ProductDetails from "../../../pages/productDetails";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { TbEyeClosed } from "react-icons/tb";
import { RxEyeOpen } from "react-icons/rx";
import LoaderV3 from "../../loader/v3";
import ModalPage from "../../Modal UI";
import { CustomerServiceIcon, OrderStatusIcon } from "../../../lib/svg";
import dataStore from "../../../lib/dataStore";
import useBackgroundUpdater from "../../../utilities/Hooks/useBackgroundUpdater";

function MyBagFinal({ setOrderDetail, generateXLSX, generatePdfServerSide }) {
  const [OrderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const OrderId = JSON.parse(localStorage.getItem("OpportunityId"));
  const [productImage, setProductImage] = useState({ isLoaded: false, images: {} });
  const [productDetailId, setProductDetailId] = useState(null)
  const [invoices, setInvoice] = useState([]);
  const [showTracking, setShowTracking] = useState(false)
  const [helpId, setHelpId] = useState();
  const [reason, setReason] = useState();
  const [restrict, setRestrict] = useState();
  const [oldSupport, setOldSupport] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false)



  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json;charset=UTF-8",
  };

  const handleOrderDetailReady = (orderDetails) => {
    let data = ShareDrive();
    if (!data) {
      data = {};
    }
    GetAuthData().then((user) => {
      if (orderDetails.support?.length) {
        let cases = {}
        orderDetails.support.map((support) => {
          if (!cases[support.RecordTypeId]) {
            cases[support.RecordTypeId] = {}
          }
          if (!cases[support.RecordTypeId][support.Reason]) {
            cases[support.RecordTypeId][support.Reason] = {}
          }
          cases[support.RecordTypeId][support.Reason] = support
        })
        setOldSupport(cases)
      }

      if (orderDetails?.ManufacturerId__c) {
        if (!data[orderDetails?.ManufacturerId__c]) {
          data[orderDetails?.ManufacturerId__c] = {};
        }
        if (Object.values(data[orderDetails?.ManufacturerId__c])?.length > 0) {
          setProductImage({ isLoaded: true, images: data[orderDetails?.ManufacturerId__c] })
        } else {
          setProductImage({ isLoaded: false, images: {} })
        }
      }
      setOrderData(orderDetails);
      setOrderDetail(orderDetails)
      setIsLoading(true);
      if (orderDetails.OpportunityLineItems?.length > 0) {
        let productCode = "";
        orderDetails.OpportunityLineItems?.map((element, index) => {
          productCode += `'${element?.ProductCode}'`
          if (orderDetails.OpportunityLineItems?.length - 1 != index) productCode += ', ';
        })
        getProductImageAll({ rawData: { codes: productCode } }).then((res) => {
          if (res) {
            if (data[orderDetails?.ManufacturerId__c]) {
              data[orderDetails?.ManufacturerId__c] = { ...data[orderDetails?.ManufacturerId__c], ...res }
            } else {
              data[orderDetails?.ManufacturerId__c] = res
            }
            ShareDrive(data)
            setProductImage({ isLoaded: true, images: data });
          } else {
            setProductImage({ isLoaded: true, images: {} });
          }
        }).catch((err) => {
          console.log({ err });
        })
      }
      dataStore.getPageData(`/orderDetails/invoice/?id=${OrderId}`, () => getOrderDetailsInvoice({ rawData: { key: user.data.x_access_token, id: OrderId } })).then((response) => {
        setInvoice(response?.data)
      }).catch((error) => {
        console.error({ error });
      })
    }).catch((err) => {
      console.log({ err });
    })
  }

  const getOrderDetails = async () => {
    let data = ShareDrive();
    if (!data) {
      data = {};
    }
    GetAuthData().then((user) => {
      let rawData = { key: user.data.x_access_token, opportunity_id: OrderId }
      dataStore.getPageData(`/orderDetails?id=${OrderId}`,
        () => getOrderDetailId({ rawData })).then((res) => {
          if (res) {
            handleOrderDetailReady(res)
          }
        }).catch((err1) => {
          console.log({ err1 });
        })
    }).catch((err) => {
      console.log({ err });
    })
  };


  useBackgroundUpdater(getOrderDetails, defaultLoadTime)

  useEffect(() => {
    dataStore.subscribe(`/orderDetails?id=${OrderId}`, handleOrderDetailReady);
    dataStore.subscribe(`/orderDetails/invoice/?id=${OrderId}`, (data) => { setInvoice(data.data) });
    getOrderDetails();
    return () => {
      dataStore.unsubscribe(`/orderDetails?id=${OrderId}`, handleOrderDetailReady);
      dataStore.unsubscribe(`/orderDetails/invoice/?id=${OrderId}`, (data) => { setInvoice(data.data) });
    }
  }, []);
  const handleback = () => {
    navigate("/order-list");
  };
  const invoiceHandler = (reason) => {
    setIsDisabled(true)
    if (reason) {
      GetAuthData().then((user) => {
        let ticket = {
          orderStatusForm: {
            accountId: OrderData?.AccountId,
            contactId: user.data.retailerId,
            desc: null,
            manufacturerId: OrderData.ManufacturerId__c,
            opportunityId: OrderData.Id,
            orderNumber: OrderData.Order_Number__c ?? "Not Available",
            invoiceNumber: OrderData.Wholesale_Invoice__c ? OrderData.Wholesale_Invoice__c ?? "Not Available" : "Not Available",
            poNumber: OrderData.PO_Number__c,
            priority: "Medium",
            reason,
            salesRepId: OrderData.OwnerId,
            sendEmail: true,
          },
          key: user?.data?.x_access_token
        };
        postSupport({ rawData: ticket })
          .then((response) => {
            setConfirm()
            setIsDisabled(false)
            if (response) {
              navigate("/CustomerSupportDetails?id=" + response);
            }
          })
          .catch((err) => {
            console.error({ err });
          });
      }).catch((err) => {
        console.error({ err });
      })
    }
  };

  function downloadFiles(invoices) {
    GetAuthData().then((user) => {
      invoices.forEach(file => {
        const link = document.createElement("a");
        link.href = `${file.VersionDataUrl}`;
        link.download = `${file.VersionDataUrl}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }).catch((err) => {
      console.log({ err });
    })
  }

  if (!isLoading) return <LoaderV3 text={"Loading Order details"} />;
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  const supportHandler = (value) => {
    setReason(value)
    if (helpId == "0123b0000007zc8AAA") {
      setConfirm(value)
    } else if (helpId == "0123b0000007z9pAAA") {
      navigate("/customerService", { state: { Reason: value, OrderId: OrderData.Id, SalesRepId: OrderData.OwnerId, PONumber: OrderData.PO_Number__c } })
    } else {
      alert("do nothing")
    }
  }

  const SupportTransporter = ({ Type, Reason }) => {
    if (oldSupport?.[Type]?.[Reason]?.Id) {
      return (<Link to={"/CustomerSupportDetails?id=" + oldSupport[Type][Reason].Id} className={Styles.supportLinkHolder}>{oldSupport[Type][Reason]?.CaseNumber}</Link>)
    } else {
      return null;
    }
  }

  const ReasonCardHandler = ({ reasonType, label = null, haveValue = false }) => {
    if (reasonType) {
      if (!oldSupport?.[helpId]?.[reasonType]?.Id) {
        if (!haveValue) {
          return (<p onClick={() => { supportHandler(reasonType) }} style={reason == reasonType ? { color: '#0d6efd' } : {}}>&bull;&nbsp;{label ?? reasonType}</p>)
        }
      } else {
        return (<p onClick={() => setRestrict(reasonType)} style={reason == reasonType ? { color: '#0d6efd' } : {}}>&bull;&nbsp;{label ?? reasonType}<SupportTransporter Type={helpId} Reason={reasonType} /></p>)
      }
    } else {
      return null;
    }
  }

  return (
    <div>
      <ModalPage
        open={restrict || false}
        content={
          <div className="d-flex flex-column gap-3">
            <h2 style={{ textDecoration: 'underline' }}>
              Warning!
            </h2>
            <p>
              You can't create Support Request for this Order. <br />Please contact your Sales Representative for further assistance.
            </p>
            <div className="d-flex justify-content-around ">
              <button className={Styles.btnHolder} onClick={() => setRestrict()} style={{ width: 'max-content', padding: '5px 10px' }}>
                I Understand
              </button>
            </div>
          </div>
        }
        onClose={() => {
          setRestrict()
        }}
      />
      <ModalPage
        open={confirm || false}
        content={
          <div className="d-flex flex-column gap-3">
            <h2 style={{ textDecoration: 'underline' }}>
              Confirm
            </h2>
            <p>
              Are you sure you want to generate a ticket?<br /> This action cannot be undone.
            </p>
            <div className="d-flex justify-content-around ">
              <button className={Styles.btnHolder} onClick={() => invoiceHandler(confirm)} disabled={isDisabled}>
                Submit
              </button>
              <button className={Styles.btnHolder} onClick={() => setConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        }
        onClose={() => {
          setConfirm(false);
        }}
      />
      <style>
        {`@media print {
  .MainInnerPrint {
    height: unset;
  }
  .filter-container,.d-none-print {
    display: none;
  }
}`}
      </style>
      <section>
        <div className=" mt-4">
          <div id="orderDetailerContainer">
            <div className={Styles.MyBagFinalTop}>
              <div className={Styles.MyBagFinalRight}>
                <svg
                  data-html2canvas-ignore
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ cursor: "pointer" }}
                  width="24"
                  height="16"
                  viewBox="0 0 24 16"
                  fill="none"
                  onClick={handleback}
                  className="d-none-print"
                >
                  <path
                    d="M8.94284 2.27615C9.46349 1.75544 9.46349 0.911229 8.94284 0.390521C8.42213 -0.130174 7.57792 -0.130174 7.05721 0.390521L2.3911 5.05666C2.39092 5.05684 2.39128 5.05648 2.3911 5.05666L0.390558 7.05721C0.153385 7.29442 0.024252 7.59868 0.00313201 7.90895C-0.00281464 7.99562 -0.000321319 8.08295 0.010852 8.17002C0.0431986 8.42308 0.148118 8.66868 0.325638 8.87322C0.348651 8.89975 0.372651 8.92535 0.397585 8.94989L7.05721 15.6095C7.57792 16.1302 8.42213 16.1302 8.94284 15.6095C9.46349 15.0888 9.46349 14.2446 8.94284 13.7239L4.55231 9.33335H22.6667C23.4031 9.33335 24 8.73642 24 8.00002C24 7.26362 23.4031 6.66668 22.6667 6.66668H4.55231L8.94284 2.27615Z"
                    fill="black"
                  />
                </svg>
                <h4>
                  {" "}
                  <span> {OrderData.ManufacturerName__c} |&nbsp;</span>
                  {OrderData.accountName}
                </h4>{" "}
              </div>

              <div className={Styles.MyBagFinalleft}>
                <h5>
                  PO Number <b>{OrderData.PO_Number__c}</b>{" "}
                </h5>
              </div>
            </div>
            <div className={Styles.MyBagFinalMain}>
              <div className="row">
                <div className="col-lg-7 col-md-8 col-sm-12">
                  <div className={Styles.MainBag}>
                    <h3>
                      Order Details ({OrderData?.OpportunityLineItems?.length})
                    </h3>
                    <div className={Styles.scrollP}>
                      <div className={`${Styles.MainInner} MainInnerPrint`}>
                        <div className={Styles.Mainbox3}>
                          {OrderData.OpportunityLineItems?.length > 0 ? (
                            OrderData.OpportunityLineItems?.map((item) => {
                              return (
                                <div className={Styles.Mainbox}>
                                  <div className={Styles.Mainbox1M}>
                                    <div className={Styles.Mainbox2} style={{ cursor: 'pointer' }}>
                                      {
                                        !productImage.isLoaded ? <LoaderV2 /> :
                                          item?.ProductImage ? <img src={item.ProductImage} className="zoomInEffect 1111" alt="img" width={25} onClick={() => { setProductDetailId(item?.Product2Id) }} /> :
                                            productImage.images?.[item.ProductCode] ?
                                              productImage.images[item.ProductCode]?.ContentDownloadUrl ?
                                                <img src={productImage.images[item.ProductCode]?.ContentDownloadUrl} alt="img" width={25} onClick={() => { setProductDetailId(item?.Product2Id) }} />
                                                : <img src={productImage.images[item.ProductCode]} alt="img" width={25} onClick={() => { setProductDetailId(item?.Product2Id) }} />
                                              : <img src={"/assets/images/dummy.png"} alt="img" onClick={() => { setProductDetailId(item?.Product2Id) }} />
                                      }
                                    </div>
                                    <div className={Styles.Mainbox3}>
                                      <h2 onClick={() => { setProductDetailId(item?.Product2Id) }} style={{ cursor: 'pointer' }}>{item.Name.split(OrderData.Name)}</h2>
                                      <p>
                                        <span className={Styles.Span1} data-html2canvas-ignore>
                                          ${Number(item.ListPrice).toFixed(2)}
                                        </span>
                                        <span className={Styles.Span2}>
                                          ${Number(item.UnitPrice).toFixed(2)}
                                        </span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className={Styles.Mainbox2M}>
                                    <div className={Styles.Mainbox5}>
                                      <button
                                        className={Styles.qtyLabelHolder}
                                        style={{ cursor: "default" }}
                                      >
                                        {item.Quantity}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <>No Products.</>
                          )}
                        </div>
                      </div>

                      {/* <div className={Styles.TotalPricer}>
                        <div>
                          <h2>Total</h2>
                        </div>
                        <div>
                          <h2>${Number(OrderData.Amount).toFixed(2)}</h2>
                        </div>
                      </div> */}
                      <div className={Styles.TotalPricer}>
                        <div className="d-flex justify-content-between">
                          <h2>{OrderData?.Shipment_cost__c ? 'Sub-' : null}Total</h2>
                          <h2>${Number(OrderData.Amount).toFixed(2)}</h2>
                        </div>
                        {OrderData?.Shipment_cost__c ?
                          <div className="d-flex justify-content-between">
                            <h2 className="text-capitalize">Shipping by ({OrderData?.Shipping_method__c})</h2>
                            <h2>${OrderData?.Shipment_cost__c ? Number(OrderData?.Shipment_cost__c).toFixed(2) : 0}</h2>
                          </div> : null}
                        {OrderData?.Shipment_cost__c ?
                          <div className="d-flex justify-content-between">
                            <h2>Total</h2>
                            <h2>${Number(OrderData.Amount + Number(OrderData?.Shipment_cost__c)).toFixed(2)}</h2>
                          </div> : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-4 col-sm-12">
                  <div className={Styles.ShippControl}>
                    <h2>Shipping Address</h2>
                    <div className={Styles.ShipAdress}>
                      <p>
                        {OrderData?.Shipping_Street__c ? (
                          <>
                            {OrderData?.Shipping_Street__c},{" "}
                            {OrderData?.Shipping_City__c} <br />
                            {OrderData?.Shipping_State__c},{" "}
                            {OrderData?.Shipping_Country__c}{" "}
                            {OrderData?.Shipping_Zip__c}
                            <br />
                            {OrderData?.email}{" "}
                            {OrderData?.contact
                              ? ` | ${OrderData?.contact}`
                              : null}
                          </>
                        ) : (
                          "No Shipping Address"
                        )}
                      </p>
                    </div>
                    {OrderData.Order_Number__c && <>
                      <h2>Order Number</h2>
                      <div className={Styles.ShipAdress}>
                        <p>
                          {OrderData.Order_Number__c}
                        </p>
                      </div></>}
                    {showTracking && OrderData.Tracking__c && <>
                      <h2>Tracking Number</h2>
                      <div className={Styles.ShipAdress} style={{ transition: 'all 250s linear' }}>
                        {OrderData.Tracking_URL__c ? <button role="link" style={{ textDecoration: 'underline' }}
                          onClick={() => openInNewTab(OrderData.Tracking_URL__c)}>{OrderData.Tracking__c}</button> :
                          <p>
                            {OrderData.Tracking__c}
                          </p>}
                      </div></>}
                    {OrderData?.Payment_Status__c || OrderData?.Transaction_ID__c|| OrderData?.PBL_Status__c ?
                      <>
                        <h2 style={{ marginTop: '10px' }}>Payment Details</h2>
                        <div className={Styles.paymentCheck}>
                          {OrderData?.Payment_Status__c ? <p>Payment Status : {OrderData?.Payment_Status__c} </p> : null}
                          {OrderData?.Transaction_ID__c ? <p>Transaction ID : {OrderData?.Transaction_ID__c} </p> : null}
                          {OrderData?.Status__c !== "Order Cancelled" && OrderData?.PBL_Status__c && ((!OrderData?.Payment_Status__c || OrderData?.Payment_Status__c != 'succeeded') && !OrderData?.Transaction_ID__c) ?
                            <div className={Styles.ShipBut}>
                              <button role="link"
                                onClick={() => openInNewTab(OrderData.PBL_Status__c)}>Payment Link</button></div>
                            : null}
                        </div>
                      </> : null}

                    <div className={Styles.ShipAdress2}>
                      {/* <label>NOTE</label> */}
                      <p
                        className="placeholder:font-[Arial-500] text-[14px] tracking-[1.12px] m-0"
                        style={{ minHeight: "119px" }}
                      >

                        {OrderData.Description}
                      </p>
                    </div>
                  </div>
                  <div className="row" data-html2canvas-ignore>
                    <div className="col-6">
                      <div className={Styles.ShipBut} data-html2canvas-ignore>
                        {invoices?.length > 0 ? (
                          <button className="py-1 d-flex justify-content-center" onClick={() => downloadFiles(invoices)}>
                            <span style={{ margin: 'auto 0' }}><MdOutlineDownload size={16} /></span>&nbsp;Download INVOICE
                          </button>
                        ) : <button className="py-1 d-flex justify-content-center" onClick={() => { oldSupport?.["0123b0000007zc8AAA"]?.["Invoice"]?.Id ? setRestrict("Invoice") : setConfirm("Invoice") }}>
                          <span style={{ margin: 'auto 0' }}><VscGitPullRequestNewChanges size={16} /></span>&nbsp;Request Invoice
                        </button>}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={Styles.ShipBut} data-html2canvas-ignore>
                        {OrderData.Tracking__c ? (
                          <button className="py-1 d-flex justify-content-center" onClick={() => setShowTracking(!showTracking)}>
                            <span style={{ margin: 'auto 0' }} >{showTracking ? <RxEyeOpen size={16} style={{ transition: 'all 500s linear' }} /> : <TbEyeClosed size={16} style={{ transition: 'all 250s linear' }} />}</span>&nbsp;Tracking Status
                          </button>
                        ) : <button className="py-1 d-flex justify-content-center" onClick={() => { oldSupport?.["0123b0000007zc8AAA"]?.["Tracking Status"]?.Id ? setRestrict("Tracking Status") : setConfirm("Tracking Status") }}>
                          <span style={{ margin: 'auto 0' }}><VscGitPullRequestNewChanges size={16} /></span>&nbsp;Request Tracking
                        </button>}
                      </div>
                    </div>
                    <div className={Styles.ShipBut}>
                      <button className="dropdown dropdown-toggle border px-2.5 py-1 leading-tight d-flex justify-content-center align-items-center" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="d-flex justify-content-center" role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false">
                          <MdOutlineDownload size={16} className="m-auto" />&nbsp;
                          <small>Download Order Summary</small>
                        </div>
                        <ul className="dropdown-menu">
                          <li>
                            <div className="dropdown-item rounded topNav_nameText__Jdtjp hover:bg-[#eeeeef] p-1 hover:rounded-lg d-flex align-items-center" onClick={() => generatePdfServerSide()}>&nbsp;Pdf</div>
                          </li>
                          <li>
                            <div className="dropdown-item rounded topNav_nameText__Jdtjp hover:bg-[#eeeeef] p-1 hover:rounded-lg d-flex align-items-center" onClick={() => generateXLSX(OrderData)}>&nbsp;XLSX</div>
                          </li>
                        </ul>
                      </button>
                    </div>
                  </div>
                  <div className={Styles.ShippControl}>
                    <h2>Need Help?</h2>
                    <div className={`${Styles.ShipAdress} ${Styles.dFlex}`}>
                      <div className=" pt-2 pb-2" style={{ cursor: 'pointer' }} onClick={() => { setHelpId("0123b0000007zc8AAA") }}>
                        <div className="d-flex align-items-center" style={helpId == "0123b0000007zc8AAA" ? { color: '#0d6efd' } : {}}>
                          <span style={{ fontSize: '25px' }}>&bull;</span>
                          <div className="d-flex ml-2"><OrderStatusIcon fill={helpId == "0123b0000007zc8AAA" ? "#0d6efd" : "black"} />&nbsp;Order Status</div>
                        </div>
                        {helpId == "0123b0000007zc8AAA" &&
                          <div className={Styles.SupportHolder}>
                            <ReasonCardHandler label={"Request Status Updates"} reasonType={"Status of Order"} haveValue={OrderData.Order_Number__c} />
                            <ReasonCardHandler label={"Request Invoice"} reasonType="Invoice" haveValue={invoices ? invoices?.length != 0 : false} />
                            <ReasonCardHandler label={"Request Tracking number"} reasonType="Tracking Status" haveValue={OrderData.Tracking__c} />
                          </div>}

                      </div>
                      <div className=" pt-2 pb-2" style={{ cursor: 'pointer' }} onClick={() => { setHelpId("0123b0000007z9pAAA") }}>
                        <div className="d-flex align-items-center" style={helpId == "0123b0000007z9pAAA" ? { color: '#0d6efd' } : {}}>

                          <span style={{ fontSize: '25px' }}>&bull;</span>
                          <div className="d-flex ml-2"><CustomerServiceIcon fill={helpId == "0123b0000007z9pAAA" ? "#0d6efd" : "black"} />
                            &nbsp;Customer Service</div>
                        </div>
                        {helpId == "0123b0000007z9pAAA" &&
                          <div className={Styles.SupportHolder}>
                            <ReasonCardHandler reasonType={"Charges"} />
                            <ReasonCardHandler reasonType={"Product Missing"} />
                            <ReasonCardHandler reasonType={"Product Overage"} />
                            <ReasonCardHandler reasonType={"Product Damage"} />
                          </div>}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} AccountId={[OrderData.AccountId]} />
    </div>
  );
}

export default MyBagFinal;
