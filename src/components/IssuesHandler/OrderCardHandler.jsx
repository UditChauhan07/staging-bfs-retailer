import { ShareDrive, getProductImageAll, months, originAPi } from "../../lib/store";
import Styles from "../OrderList/style.module.css"
import Styles1 from "./OrderCardHandler.module.css"
import { useEffect, useState } from "react";
import ProductDetails from "../../pages/productDetails";
import ErrorProductCard from "./ErrorProductCard";
import { BiCheck, BiLeftArrow, BiLock, BiRightArrow } from "react-icons/bi";
import Select from "react-select";
import ModalPage from "../Modal UI";

const OrderCardHandler = ({ orders, setOrderId, orderId, reason, orderConfirmedStatus, files = [], desc, errorListObj, manufacturerIdObj, accountIdObj, accountList, contactIdObj,setSubject,Actual_Amount__cObj,contactName,setSalesRepId }) => {
    const { setOrderConfirmed, orderConfirmed } = orderConfirmedStatus || null;
    const { accountId, setAccountId } = accountIdObj || null;
    const { manufacturerId, setManufacturerId } = manufacturerIdObj || null;
    const { errorList, setErrorList } = errorListObj || null;
    const { contactId, setContactId } = contactIdObj || null;
    const { Actual_Amount__c, setActual_Amount__c } = Actual_Amount__cObj || null;
    let size = 3;
    const [Viewmore, setviewmore] = useState(false);
    const [searchPo, setSearchPO] = useState(null);
    const [productImage, setProductImage] = useState({ isLoaded: false, images: {} });
    const [productDetailId, setProductDetailId] = useState(null)
    const [errorProductCount, setErrorProductCount] = useState(0)
    const [contacts, setContacts] = useState([])
    const getOrderDetails = ({ order }) => {
        if (order) {
            let data = ShareDrive();
            if (!data) {
                data = {};
            }
            if (Object.values(data).length > 0) {
                if (data[order.ManufacturerId__c]) {
                    if (Object.values(data[order.ManufacturerId__c]).length > 0) {
                        setProductImage({ isLoaded: true, images: data[order.ManufacturerId__c] })
                    } else {
                        setProductImage({ isLoaded: false, images: {} })
                    }
                }
            }
            if (order.OpportunityLineItems && order.OpportunityLineItems.records.length > 0) {
                let productCode = "";
                order.OpportunityLineItems.records?.map((element, index) => {
                    productCode += `'${element?.ProductCode}'`
                    if (order.OpportunityLineItems.records.length - 1 != index) productCode += ', ';
                })
                getProductImageAll({ rawData: { codes: productCode } }).then((res) => {
                    if (res) {
                        if (data[order.ManufacturerId__c]) {
                            data[order.ManufacturerId__c] = { ...data[order.ManufacturerId__c], ...res }
                        } else {
                            data[order.ManufacturerId__c] = res
                        }
                        ShareDrive(data)
                        setProductImage({ isLoaded: true, images: res });
                    } else {
                        setProductImage({ isLoaded: true, images: {} });
                    }
                }).catch((err) => {
                    console.log({ err });
                })
            }
        };
    }
    const orderSelectHandler = (e) => {
        setOrderId(e.target.value)
        {
            let accountItemID = null;
            orders.map((item) => {
                if (e.target.value == item.Id) {
                    console.log({item});
                    getOrderDetails({ order: item })
                    setManufacturerId(item.ManufacturerId__c)
                    setAccountId(item.AccountId)
                    accountItemID = item.AccountId
                    setActual_Amount__c(item.Amount)
                    setSalesRepId(item.OwnerId)
                }
            })
            setSearchPO(null);
            let inputValue = document.getElementById("poSearchInput");
            if (inputValue) {
                inputValue.value = null;
            }
        }
    }
    useEffect(() => { }, [searchPo, errorProductCount, productImage])

    const resetForm = () => {
        setOrderId(null);
        setContactId(null)
        setErrorList({})
        setOrderConfirmed(false)
    }
    const productErrorHandler = (element) => {
        //can i use memo for errorlist?
        let temp = errorList;
        if (temp.hasOwnProperty(element.Id)) {
            delete temp[element.Id]; // remove the property from the object
        } else {
            element.issue = 0;
            temp[element.Id] = element;
        }

        setErrorList(temp)
        let pCOunt = Object.values(errorList).length;
        setErrorProductCount(pCOunt);
    }

    const ErrorProductQtyHandler = (id, value) => {
            let temp = errorList;
            if (temp.hasOwnProperty(id)) {
                // if (parseInt(value) <= temp[id].Quantity) {
                temp[id].issue = parseInt(value)
                setErrorList(temp)
                // }
            }
    }
    const [emptyProduct,setemptyProduct]= useState(false);

    const orderConfirmationHandler = () => {
        let error = Object.keys(errorList)
        if (error.length) {
            let confimationStatus = true;
            if (reason != "Charges") {

                error.map((id) => {
                    if ((errorList[id].issue == 0 || !errorList[id].issue) || errorList[id].issue > errorList[id].Quantity) {
                        confimationStatus = false;
                        const myElement = document.getElementById(`oP${id}`);
                        if(myElement){
                            myElement.scrollIntoView({ behavior: "smooth", block: "center" });
                            myElement.style.borderBottom = "1px solid red";
                            shakeHandler(`oP${id}`)
                        }
                    } else {
                        const myElement = document.getElementById(`oP${id}`);
                       if(myElement){
                           myElement.style.borderBottom = "1px solid #00FF00"
                        }
                    }
                })
            }
            if (confimationStatus) {
                error.map((id) => {
                    const myElement = document.getElementById(`oP${id}`);
                    if(myElement){
                        myElement.style.borderBottom = "1px solid #ccc"
                    }
                })
                if(!contactId){
                    const myElement = document.getElementById("contactSelector");
                    if(myElement){
                        myElement.scrollIntoView({ behavior: "smooth", block: "center" });
                        myElement.style.borderBottom = "1px solid red"
                        shakeHandler(`contactSelector`)
                        
                    }
                    
                }else{
                    const myElement = document.getElementById("contactSelector");
                    if(myElement){
                        myElement.style.borderBottom = "1px solid #ccc"
                    }
                    document.getElementById("AttachementSection")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    setOrderConfirmed(true)
                }
            }
        } else {
            setemptyProduct(true)
            var element = document.getElementsByTagName("checkbox");
            if (element.length>0) {
              element[0].scrollIntoView({ behavior: "smooth", block: "center" });
            }
            // alert("please select any product...")
        }
    }
    const shakeHandler = (id = null) => {

        let lock1 = document.getElementById(id || "lock1");
        if (lock1) {
            setTimeout(() => {
                lock1.classList.remove(Styles1.shake);
            }, 300)
            lock1.classList.add(Styles1.shake)
        }
    }
    return (<section style={{ borderBottom: '1px solid #ccc' }}>
        {emptyProduct ? (
          <ModalPage
            open
            content={
              <div className="d-flex flex-column gap-3" style={{ maxWidth: '700px' }}>
                <h2 className={`${Styles.warning} `}>Product Empty</h2>
                <p className={`${Styles.warningContent} `} style={{ lineHeight: '22px' }}>
                  Please select Product before processing further
                </p>
                <div className="d-flex justify-content-around ">
                  <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => setemptyProduct(false)}>
                    OK
                  </button>
                </div>
              </div>
            }
            onClose={() => {
              setemptyProduct(false);
            }}
          />
        ) : null}
        <p className={Styles1.reasonTitle}><span style={{ cursor: "pointer" }} onClick={() => shakeHandler()}>Select the order you want to handle:</span> {!orderId && reason && <input type="text" placeholder='Search Order' autoComplete="off" className={Styles1.searchBox} title="You can search by PO Number, Account Name & Brand for last 3 month Orders" onKeyUp={(e) => { setSearchPO(e.target.value) }} id="poSearchInput" style={{width:'120px'}} />} {!reason && <BiLock id="lock1" style={{ float: 'right' }} />}</p>
        {reason && reason != "Update Account Info" &&
            <div className={`${Styles1.orderListHolder} ${Styles1.openListHolder}`} style={(orderId && (!searchPo || searchPo == "")) ? { overflow: 'unset', height: 'auto', border: 0 } : {}}>
                <div>
                    {orders.length>0 ?
                    orders.map((item, index) => {
                        let date = new Date(item.CreatedDate);
                        let cdate = `${date.getDate()} ${months[date.getMonth()]
                            } ${date.getFullYear()}`;
                        let datemonth = `${date.getDate()} ${months[date.getMonth()]
                            }`;
                        if (((searchPo && searchPo != "") ? (item.PO_Number__c?.toLowerCase().includes(
                            searchPo?.toLowerCase()) || item.AccountName?.toLowerCase().includes(
                                searchPo?.toLowerCase()) || item.ManufacturerName__c?.toLowerCase().includes(
                                    searchPo?.toLowerCase())) : !orderId) || orderId == item.Id) {
                            return (
                                <div className={` ${Styles.orderStatement} cardHover ${orderId == item.Id ? Styles1.selOrder : ''}`} style={{ paddingBottom: '15px' }} key={index}>
                                    <label for={`order${item.Id}`} style={{ width: '100%', position: 'relative' }} className={(index % 2 == 0) ? Styles1.cardEnterRight : Styles1.cardEnterLeft}>
                                        <input type="radio" id={`order${item.Id}`} value={item.Id} onClick={(e) => { orderSelectHandler(e) }} name="order" className={Styles1.inputHolder} checked={item.Id == orderId} />
                                        <div className={Styles.poNumber} style={item.Id == orderId ? { background: 'linear-gradient(90deg, #FFFFFF 0%,#000000 100%)' } : {}}>
                                            <div className={Styles1.dFlex}>
                                                <div className={Styles.poNumb1}>
                                                    <h3>PO Number</h3>
                                                    <p>{item.PO_Number__c}</p>
                                                </div>
                                            </div>

                                            <div className={Styles.poNumb1}>
                                                <h3 style={item.Id == orderId ? { color: '#fff' } : {}}>Brand</h3>
                                                <p style={item.Id == orderId ? { color: '#fff' } : {}}>{item.ManufacturerName__c}</p>
                                            </div>

                                            <div className={Styles.PoOrderLast}>
                                                <h3 style={item.Id == orderId ? { color: '#fff' } : {}}>Ship To </h3>
                                                <p style={item.Id == orderId ? { color: '#fff' } : {}}>{item.AccountName}</p>
                                            </div>
                                        </div>

                                        <div className={`${Styles.productDetail} ${item.Id == orderId?Styles.warp:null}`} style={{padding:'0 30px'}}>
                                            <div className={Styles.Prod1}>
                                                <div className={Styles.ProtuctInnerBox}>
                                                    <div className={Styles.BoxBlack}>
                                                        <div className={Styles.Boxwhite}>
                                                            <h1>
                                                                {item.ProductCount} <span>Products</span>
                                                            </h1>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={Styles.ProtuctInnerBox1}>
                                                    {item.OpportunityLineItems && item.OpportunityLineItems?.records.length > 0 ? (
                                                        orderId == item.Id ? (<>
                                                            <table>
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{ width: '225px' }}>Name</th>
                                                                        <th style={{ width: '75px' }}>Code</th>
                                                                        <th style={{ width: '75px' }}>Qty</th>
                                                                        <th style={{ width: '75px' }}>Price</th>
                                                                        {reason && reason != "Charges" && <th>{reason}</th>}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {item.OpportunityLineItems?.records
                                                                        .map((ele, index) => {
                                                                            console.log({ele});
                                                                            if (!orderConfirmed || (orderConfirmed && Object.keys(errorList).includes(ele.Id))) {
                                                                                return (<ErrorProductCard Styles1={Styles1} productErrorHandler={productErrorHandler} errorList={errorList} setProductDetailId={setProductDetailId} product={ele} productImage={productImage} reason={reason} AccountName={item.AccountName} ErrorProductQtyHandler={ErrorProductQtyHandler} readOnly={orderConfirmed} />)
                                                                            }
                                                                        })}

                                                                </tbody>
                                                            </table>
                                                        </>) : (
                                                            <ul>{item.OpportunityLineItems?.records
                                                                .slice(0, size)
                                                                .map((ele, index) => {
                                                                    return (<li>
                                                                        {(Viewmore)
                                                                            ? ele.Name.split(item.AccountName)[1]
                                                                            : ele.Name.split(item.AccountName)
                                                                                .length > 1
                                                                                ? ele.Name.split(item.AccountName)[1]
                                                                                    .length >= 31
                                                                                    ? `${ele.Name.split(
                                                                                        item.AccountName
                                                                                    )[1].substring(0, 28)}...`
                                                                                    : `${ele.Name.split(
                                                                                        item.AccountName
                                                                                    )[1].substring(0, 31)}`
                                                                                : ele.Name.split(item.AccountName)[0]
                                                                                    .length >= 31
                                                                                    ? `${ele.Name.split(
                                                                                        item.AccountName
                                                                                    )[0].substring(0, 28)}...`
                                                                                    : `${ele.Name.split(
                                                                                        item.AccountName
                                                                                    )[0].substring(0, 31)}`}
                                                                    </li>)
                                                                })}</ul>)
                                                    ) : (
                                                        <p className={Styles.noProductLabel}>No Product</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={Styles1.totalProductPrice} >
                                                {(orderId && (!searchPo || searchPo == "")) && <>
                                                    <div className={Styles1.Margitotal}>
                                                        <p className={Styles1.detailsTitleHolder}>Customer Support For</p>
                                                        <p className={Styles1.detailsDescHolder}>Customer Service</p>
                                                    </div>
                                                    <div className={Styles1.Margitotal}>
                                                        <p className={Styles1.detailsTitleHolder}>Customer Service Issue</p>
                                                        <p className={Styles1.detailsDescHolder}>{reason}</p>
                                                    </div>
                                                    <div className={Styles1.Margitotal}>
                                                        <p className={Styles1.detailsTitleHolder}>Subject</p>
                                                        <p className={Styles1.detailsDescHolder}>{setSubject(`Customer Service for ${reason} having PO# ${item.PO_Number__c} Created on ${datemonth}`)}Customer Service for {reason} having <br /> PO# {item.PO_Number__c} Created on {datemonth}</p>
                                                    </div>
                                                </>}
                                                <div className={Styles1.Margitotal}>
                                                    <p className={Styles1.detailsTitleHolder}>Total</p>
                                                    <p className={Styles1.detailsDescHolder}>${Number(item?.Amount||0)?.toFixed(2)}</p>
                                                </div>
                                                <div className={Styles1.Margitotal}>
                                                    <p className={Styles1.detailsTitleHolder}>Order Placed</p>
                                                    <p className={Styles1.detailsDescHolder}>{cdate}</p>
                                                </div>

                                                {(orderId && (!searchPo || searchPo == "")) && <>
                                                    {item.StageName && <div className={Styles1.Margitotal}>
                                                        <p className={Styles1.detailsTitleHolder}>Stage Name</p>
                                                        <p className={Styles1.detailsDescHolder}>{item.StageName}</p>
                                                    </div>}
                                                    {item.Description && <div className={Styles1.Margitotal}>
                                                        <p className={Styles1.detailsTitleHolder}>Notes</p>
                                                        <p className={Styles1.detailsDescHolder}>{item.Description}</p>
                                                    </div>}
                                                    <div className={Styles1.Margitotal}>
                                                        <p className={Styles1.detailsTitleHolder}>Shipping Address</p>
                                                        <p className={Styles1.detailsDescHolder}>{item.Shipping_Street__c}{item.Shipping_City__c && <>,<br /> {item.Shipping_City__c}</>}{item.Shipping_State__c && `, ${item.Shipping_State__c}`}{item.Shipping_Country__c && <>,<br /> {item.Shipping_Country__c}</>}{item.Shipping_Zip__c && `, ${item.Shipping_Zip__c}`}</p>
                                                    </div>
                                                    {item.Order_Number__c && <div className={Styles1.Margitotal}>
                                                        <p className={Styles1.detailsTitleHolder}>Order Number</p>
                                                        <p className={Styles1.detailsDescHolder}>{item.Order_Number__c}</p>
                                                    </div>}
                                                    {files.length > 0 && <div className={Styles1.Margitotal}>
                                                        <p className={Styles1.detailsDescHolder}>
                                                            <p className={Styles1.detailsTitleHolder}>Attachements</p>
                                                            <div className={Styles1.imgHolder}>
                                                                {files.map((file, index) => (
                                                                    <img src={file} key={index} />
                                                                ))}
                                                            </div>
                                                        </p>
                                                    </div>}
                                                    {desc && <div className={Styles1.Margitotal}>
                                                        <p className={Styles1.detailsTitleHolder}>Description</p>
                                                        <p className={Styles1.detailsDescHolder}>{desc}</p>
                                                    </div>}
                                                    <div className={Styles1.Margitotal}>
                                                        <p className={Styles1.detailsTitleHolder}>Contact Person</p>
                                                        <p className={Styles1.detailsDescHolder} style={{display:'flex',justifyContent:'end',marginTop:'5px'}}>
                                                            {/* <Select
                                                                options={contacts}
                                                                defaultValue={{
                                                                    value: null,
                                                                    label: "Select Contact...",
                                                                }}
                                                                value={{
                                                                    value: contacts.filter((ele) => ele.value == contactId)[0]?.["value"] || null,
                                                                    label: contacts.filter((ele) => ele.value == contactId)[0]?.["label"] || "Select Contact...",
                                                                }}
                                                                onChange={(option) => setContactId(option.value)}
                                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                                menuPortalTarget={document.body}
                                                                isSearchable
                                                                menuPosition={"fixed"}
                                                                menuShouldScrollIntoView={false}
                                                            /> */}
                                                            {contactName}
                                                        </p>
                                                    </div>
                                                    {(orderId == item.Id && !orderConfirmed) && <div className={Styles1.Margitotal}>
                                                        <button className={Styles1.btnHolder} title="Click here to Continue" onClick={() => orderConfirmationHandler()}>I'M Done<BiCheck /></button>
                                                    </div>}
                                                    {(orderId == item.Id && orderConfirmed) && <div className={Styles1.Margitotal}>
                                                        <button className={Styles1.btnHolder} title="Click here to Change in Products" onClick={() =>{ setOrderConfirmed(false);}}>Wanna Change?</button>
                                                    </div>}
                                                </>}
                                            </div>
                                        </div>
                                    </label>
                                    {orderId && <b aria-label="Click Here" title="Click here" onClick={() => { resetForm() }} style={{ cursor: 'pointer', marginLeft: '15px', textDecoration: 'underline' }}>Wrong Order. Want to Change Order?</b>}
                                </div>
                            )
                        }
                    }):<p style={{textAlign:'center'}}>No Order Found</p>}
                </div >
            </div >}
        <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} isAddtoCart={false} AccountId={accountId} ManufacturerId={manufacturerId} />
    </section >)
}
export default OrderCardHandler;