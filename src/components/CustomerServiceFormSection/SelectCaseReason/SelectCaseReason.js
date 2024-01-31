import React, { useEffect, useState } from "react";
import Styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import { CloseButton } from "../../../lib/svg";
import { DestoryAuth, GetAuthData, getAllAccount, getOrderList, getSupportFormRaw, postSupportAny, supportDriveBeg, supportShare } from "../../../lib/store";
import Select from "react-select";
import ModalPage from "../../Modal UI";
import styles from "../../Modal UI/Styles.module.css";

const SelectCaseReason = ({ reasons, onClose, recordType }) => {
  const navigate = useNavigate();
  const [prioritiesList, setPrioritiesList] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderIdChild, setOrderIdChild] = useState([]);
  const [typeId, setTypeId] = useState(recordType.id);
  const [desc, setDesc] = useState();
  const [subject, setSubject] = useState();
  const [initialStep, setInitialStep] = useState(true);
  const [selectedOrderItem, setSelectOrderItem] = useState({ id: null, value: null });
  const [orderData, setOrderData] = useState({
    accountId: null,
    orderNumber: null,
    poNumber: null,
    manufacturerId: null,
    opportunityId: null,
    actualAmount: null,
    invoiceNumber: null,
  });
  const [reason, setReason] = useState(null);
  const [reasonName, setReasonName] = useState(null);
  const [rawData, setRawData] = useState({
    orderStatusForm: {
      salesRepId: null,
      contactId: null,
      desc: null,
      priority: "Medium",
      sendEmail: false,
    },
  });
  const [reasonChangeModalOpen, setReasonChangeModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  useEffect(() => {
    GetAuthData()
      .then((response) => {
        getOrderList({
          user: {
            key: response.x_access_token,
            Sales_Rep__c: false ? "00530000005AdvsAAC" : response.Sales_Rep__c,
          },
          month: "",
        })
          .then((order) => {
            setOrders(order);
          })
          .catch((error) => {
            console.log({ error });
          });
        getAllAccount({ user: response })
          .then((accounts) => {
            setAccountList(accounts);
          })
          .catch((actError) => {
            console.error({ actError });
          });
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [step]);
  const onChangeHandler = (e) => {
    if (initialStep) {
      setReason(e.target.value);
      setReasonName(e.target.value);
      setSelectOrderItem({ id: null, value: null });
      setOrderData({
        accountId: null,
        orderNumber: null,
        poNumber: null,
        manufacturerId: null,
        opportunityId: null,
        actualAmount: null,
        invoiceNumber: null,
      });
      setStep(1);
      setInitialStep(false);
    } else {
      setStep(0);
      setReasonChangeModalOpen(true);
      setReasonName(e.target.value);
    }
    // setSelectOrderItem({ id: null, value: null });
    // setOrderData({
    //   accountId: null,
    //   orderNumber: null,
    //   poNumber: null,
    //   manufacturerId: null,
    //   opportunityId: null,
    //   actualAmount: null,
    //   invoiceNumber: null,
    // });
    // setStep(1);
  };
  const onOrderChangeHandler = (value) => {
    let id = value;
    setSelectOrderItem({ id: null, value: null });
    let orderDetails = orders.filter(function (element) {
      if (element.Id === id) {
        setOrderData({
          accountId: element.AccountId,
          orderNumber: element.Order_Number__c,
          poNumber: element.PO_Number__c,
          manufacturerId: element.ManufacturerId__c,
          opportunityId: element.Id,
          actualAmount: element.Amount,
          invoiceNumber: element.Wholesale_Invoice__c,
        });
        setOrderIdChild(element.OpportunityLineItems.records);
        setStep(2);
        return element;
      }
    });
  };
  const onChnageAccountHander = (value) => {
    setOrderData({ accountId: value });
    setStep(2);
  };
  const onChnageOrderItemHander = (value) => {
    let orderItemDetails = orderIdChild.filter(function (element) {
      let id = value;
      if (element.Id === id) {
        setSelectOrderItem({ id: element.Id, value: element.Quantity });
        return element;
      }
    });
  };
  const submitForm = () => {
    GetAuthData()
      .then((user) => {
        if (user) {
          let rawData = {
            orderStatusForm: {
              typeId,
              salesRepId: user.Sales_Rep__c,
              reason,
              accountId: orderData.accountId,
              orderNumber: orderData?.orderNumber,
              poNumber: orderData.poNumber,
              manufacturerId: orderData.manufacturerId,
              desc,
              opportunityId: orderData.opportunityId,
              priority: "Medium",
              sendEmail: false,
              subject,
            },
            key: user.x_access_token,
          };
          postSupportAny({ rawData })
            .then((response) => {
              if (response) {
                navigate("/CustomerSupportDetails?id=" + response);
              }
            })
            .catch((err) => {
              console.error({ err });
            });
        } else {
          DestoryAuth();
        }
      })
      .catch((error) => {
        DestoryAuth();
      });
  };
  console.log("reasonName", reasonName, "reason:", reason, step);
  return (
    <>
      {reasonChangeModalOpen ? (
        <ModalPage
          open
          content={
            <>
              <div style={{ maxWidth: "403px" }}>
                <h2 className={` ${styles.modalContentMontserrat}`}>
                  Do you want to <span style={{ fontWeight: "600" }}>change</span> the previous selection?
                </h2>
                <div className="d-flex justify-content-center gap-3 mt-4 ">
                  <button
                    className={`${styles.modalButtonCancel}`}
                    onClick={() => {
                      setReasonChangeModalOpen(false);
                      setReason((prev) => prev);
                      setReasonName((prev) => prev);
                      setStep(1);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${styles.modalButton}`}
                    onClick={() => {
                      setReasonChangeModalOpen(false);
                      setReason(reasonName);
                      setStep(1);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </>
          }
          onClose={() => {
            setReasonChangeModalOpen(false);
          }}
        />
      ) : null}
      <div className={`  ${Styles.ModalLast} ${Styles.delaycontent} `}>
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="font-[Montserrat-500] text-[22px] tracking-[2.20px] m-0 p-0">{recordType.name} Issue</h1>
          <button type="button" onClick={onClose}>
            <CloseButton />
          </button>
        </div>
        <hr />
        <section className={` ${Styles.fadeInUp} `}>
          <div className={Styles.BrandInRadio}>
            <p className={Styles.CaseReason}>
              <span className="text-danger">*</span>Select Case Reason
            </p>
            <div className={Styles.ModalResponsive}>
              {Object.values(reasons)?.map((reasonName, index) => {
                return (
                  <div className={Styles.BrandName} key={index}>
                    <input type="radio" name="reason_name" value={reasonName} onChange={onChangeHandler} id={reasonName} checked={reasonName === reason} />
                    <label htmlFor={reasonName}>{reasonName}</label>
                  </div>
                );
              })}
            </div>
          </div>
          <hr style={{ border: "1px dashed #D5D9D9" }}></hr>
          {step >= 1 && (
            <div className={`${Styles.delay} ${Styles.fadeInUp} `}>
              <div className={Styles.selectDiv}>
                {(reason == "Charges" || reason == "Product Missing" || reason == "Product Overage" || reason == "Product Damage") && (
                  <div style={{ textAlign: "left", margin: "10px 0px" }}>
                    <p className={Styles.CaseReason}>
                      <span className="text-danger">*</span>Select Order for last 6 month
                    </p>
                    <Select
                      options={orders.map((element) => {
                        return {
                          value: element.Id,
                          label: `Order from ${element.AccountName} for (${element.ProductCount} Products) Actual Amount ${element.Amount} | ${element.ManufacturerName__c} | PO #${element.PO_Number__c}`,
                        };
                      })}
                      // defaultValue={orderData.opportunityId}
                      onChange={(option) => onOrderChangeHandler(option.value)}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      menuPortalTarget={document.body}
                      isSearchable
                      menuPosition={"fixed"}
                      menuShouldScrollIntoView={false}
                    />
                  </div>
                )}
                {reason == "Update Account Info" && (
                  <div style={{ textAlign: "left", margin: "10px 0px" }}>
                    <p className={Styles.CaseReason}>
                      <span className="text-danger">*</span>Select Account
                    </p>
                    <Select
                      options={accountList.map((element) => {
                        return { value: element.Id, label: element.Name };
                      })}
                      onChange={(option) => onChnageAccountHander(option.value)}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      menuPortalTarget={document.body}
                      isSearchable
                      menuPosition={"fixed"}
                      menuShouldScrollIntoView={false}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {step == 2 && (
            <div className={Styles.fadeInUp}>
              <div style={{ width: "100%" }}>
                {reason == "Charges" && (
                  <div className={Styles.labelAmountDiv}>
                    <div className="d-flex justify-content-start align-items-center gap-3" style={{ width: "40%", borderRight: "1px solid #D9D9D9" }}>
                      <label className={Styles.label}>Actual Amount:</label>
                      <input type="text" className={Styles.labelInput} value={`$${Number(orderData.actualAmount).toFixed(2)}`} />
                    </div>
                    <div className="d-flex justify-content-center align-items-center gap-3 ms-3">
                      <label className={Styles.label}>Associated Invoice Number:</label>
                      <input type="text" value={orderData.invoiceNumber ? orderData.invoiceNumber : "NA"} className={Styles.labelInput} />
                    </div>
                  </div>
                )}
                {(reason == "Product Missing" || reason == "Product Overage") && (
                  <div>
                    <div style={{ textAlign: "left", margin: "20px 0px 10px 0px" }}>
                      <Select
                        options={orderIdChild.map((element) => {
                          return { value: element.Id, label: element.Name };
                        })}
                        onChange={(option) => onChnageOrderItemHander(option.value)}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                        isSearchable
                        menuPosition={"fixed"}
                        menuShouldScrollIntoView={false}
                      />
                    </div>
                    <div>
                      <input className={Styles.input} type="text" placeholder="Quantity Missing" value={selectedOrderItem.value} />
                    </div>
                  </div>
                )}
                <div>
                  <input
                    className={Styles.input}
                    type="text"
                    placeholder="Provide One line Subject"
                    onKeyDown={(e) => {
                      setSubject(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <textarea
                    className={Styles.input}
                    rows={3}
                    placeholder="Describe your issues"
                    onKeyDown={(e) => {
                      setDesc(e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          {step == 2 && (
            <div className={Styles.BrandButton}>
              <button className={Styles.Button1} onClick={onClose}>
                CANCEL
              </button>
              <button
                className={Styles.Button2}
                onClick={() => {
                  submitForm();
                }}
              >
                SUBMIT
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default SelectCaseReason;
