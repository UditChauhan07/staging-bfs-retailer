/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
import Styles from "./Styles.module.css";
import QuantitySelector from "../BrandDetails/Accordion/QuantitySelector";
import { Link, useNavigate } from "react-router-dom";
import { GetAuthData, OrderPlaced, POGenerator, ShareDrive, fetchBeg, getProductImageAll } from "../../lib/store";
import OrderLoader from "../loader";
import ModalPage from "../Modal UI";
import StylesModal from "../Modal UI/Styles.module.css";
import LoaderV2 from "../loader/v2";
import ProductDetails from "../../pages/productDetails";
import Loading from "../Loading";
import { useCart } from "../../context/CartContent";
import { DeleteIcon } from "../../lib/svg";

function MyBagFinal() {
  let Img1 = "/assets/images/dummy.png";
  const { order, updateProductQty, removeProduct, deleteOrder, keyBasedUpdateCart, getOrderTotal,fetchCart } = useCart();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [alert, setAlert] = useState(0);
  const [PONumber, setPONumber] = useState();
  const [buttonActive, setButtonActive] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(0);
  const [orderStatus, setorderStatus] = useState({ status: false, message: "" })
  const [isPOEditable, setIsPOEditable] = useState(false);
  const [PONumberFilled, setPONumberFilled] = useState(true);
  const [clearConfim, setClearConfim] = useState(false)
  const [productDetailId, setProductDetailId] = useState(null)
  const [confirm, setConfirm] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false)
  // console.log({aa:Object.values(bagValue?.orderList)?.length});
  const [limitInput, setLimitInput] = useState(PONumber);
  const [isLoading, setIsLoading] = useState(true);
  const [limitCheck, setLimitCheck] = useState(false)

  const fetchBag = fetchBeg({});
  const productLists = fetchBag?.items ?? [];
  const handleNameChange = (event) => {
    const limit = 20;
    setLimitInput(event.target.value.slice(0, limit));
  };

  useEffect(() => {
    setTotal(getOrderTotal() ?? 0)
  }, [order])

  

  useEffect(() => {
    fetchCart();
    const FetchPoNumber = async () => {
      try {
        const res = await POGenerator();
        if (res) {
          let isPreOrder = productLists.some(product => (product.Category__c?.toUpperCase()?.includes("PREORDER") || product.Category__c?.toUpperCase()?.includes("EVENT")))
          let poInit = res;
          if (isPreOrder) {
            poInit = `PRE-${poInit}`
          }
          keyBasedUpdateCart({ PoNumber: poInit });
          setPONumber(poInit);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching PO number:", error);
        setIsLoading(false);
      } finally {

      }
    };

    FetchPoNumber();
  }, []);


  useEffect(() => {

    if (order?.Account?.id && order?.Manufacturer?.id && order?.items?.length > 0) {
      setButtonActive(true);
    }
  }, []);

  const [productImage, setProductImage] = useState({ isLoaded: false, images: {} });

  useEffect(() => {
    let data = ShareDrive();
    if (!data) {
      data = {};
    }
    if (order) {
      if (order?.Manufacturer) {
        if (order?.Manufacturer?.id) {
          if (!data[order?.Manufacturer?.id]) {
            data[order?.Manufacturer?.id] = {};
          }
          if (Object.values(data[order.Manufacturer.id]).length > 0) {
            setProductImage({ isLoaded: true, images: data[order.Manufacturer.id] })
          } else {
            setProductImage({ isLoaded: false, images: {} })
          }
        }
      }
      if (order.items) {
        if (order.items.length > 0) {
          let productCode = "";
          order.items.map((element, index) => {
            productCode += `'${element.product?.ProductCode}'`
            if (order.items.length - 1 != index) productCode += ', ';
          })
          getProductImageAll({ rawData: { codes: productCode } }).then((res) => {
            if (res) {
              console.log({ res });
              if (data[order.Manufacturer.id]) {
                data[order.Manufacturer.id] = { ...data[order.Manufacturer.id], ...res }
              } else {
                data[order.Manufacturer.id] = res
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
      }
    }
    if (order?.Account?.id && order?.Manufacturer?.id && order?.items?.length > 0 && total > 0) {
      setButtonActive(true);
    }
  }, [order]);

  const orderPlaceHandler = () => {

    if (order?.Account?.SalesRepId) {
      setIsOrderPlaced(1);
      setIsDisabled(true)
      GetAuthData()
        .then((user) => {
          // let bagValue = fetchBeg()
          if (order.Account.id && order.Manufacturer.id) {
            // setButtonActive(true)
            let list = [];
            let orderType = "Wholesale Numbers";
            if (order.items.length) {
              order.items.map((product) => {

                let productCategory = product?.Category__c?.toUpperCase()?.trim();

                // Set orderType based on product category and prepend "PRE" to PONumber if "PREORDER"
                if (productCategory?.toUpperCase()?.includes("PREORDER") || productCategory?.toUpperCase()?.match("EVENT")?.length > 0) {
                  orderType = "Pre Order";
                }
                let temp = {
                  Id: product.Id,
                  ProductCode: product.ProductCode,
                  qty: product.qty,
                  price: product?.price,
                  discount: product?.discount,
                };
                list.push(temp);
              });
            }
            let begToOrder = {
              AccountId: order?.Account?.id,
              Name: order?.Account?.name,
              ManufacturerId__c: order?.Manufacturer?.id,
              PONumber: PONumber,
              desc: order?.Note,
              SalesRepId: order?.Account?.SalesRepId,
              Type: orderType,
              ShippingCity: order?.Account?.address?.city,
              ShippingStreet: order?.Account?.address?.street,
              ShippingState: order?.Account?.address?.state,
              ShippingCountry: order?.Account?.address?.country,
              ShippingZip: order?.Account?.address?.postalCode,
              list,
              key: user.data.x_access_token,
              shippingMethod: order.Account.shippingMethod
            };
            OrderPlaced({ order: begToOrder, cartId: order.id })
              .then((response) => {
                if (response) {
                  if (response.length) {
                    setIsDisabled(false)
                    setIsOrderPlaced(0);
                    setorderStatus({ status: true, message: response[0].message });
                  } else {
                    setIsDisabled(false)
                    let status = deleteOrder();
                    navigate("/order-list");
                    setIsOrderPlaced(2);
                  }
                }
              })
              .catch((err) => {
                console.error({ err });
              });
          }
        })
        .catch((error) => {
          console.error({ error });
        });
    } else {
      alert("no sales rep.")
    }
  };



  const deleteBag = () => {
    // localStorage.removeItem("AA0KfX2OoNJvz7x")
    deleteOrder().then((res) => {
      if (res) {
        window.location.reload();
      }
    }).catch(err => console.error({ err }))
  }
  // console.log("fetch bag", fetchBag)

  const OrderQuantity = () => {
    const { getOrderQuantity } = useCart();

    return getOrderQuantity() || 0;
  }
  if (isOrderPlaced === 1) return <OrderLoader />;
  return (
    <div className="mt-4">
      {isLoading ? (
        <Loading height={'50vh'} /> // Display full-page loader while data is loading
      ) : (
        <section>
          {alert == 1 && (
            <ModalPage
              open
              content={
                <>
                  <div style={{ maxWidth: "309px" }}>
                    <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                    <p className={` ${Styles.ModalContent}`}>Please Select Products of Minimum Order Amount</p>
                    {/* <p className={` ${Styles.ModalContent}`}><b>Current Order Total:</b> ${formentAcmount(orderTotal)}</p> */}
                    <div className="d-flex justify-content-center">
                      <button className={Styles.btnHolder} onClick={() => setAlert(0)}>
                        OK
                      </button>
                    </div>
                  </div>
                </>
              }
              onClose={() => setAlert(0)}
            />
          )}
          {alert == 2 && (
            <ModalPage
              open
              content={
                <>
                  <div style={{ maxWidth: "309px" }}>
                    <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                    <p className={` ${Styles.ModalContent}`}>Please Select Tester Product of Minimum Order Amount</p>
                    <div className="d-flex justify-content-center">
                      <button className={Styles.btnHolder} onClick={() => setAlert(0)}>
                        OK
                      </button>
                    </div>
                  </div>
                </>
              }
              onClose={() => {
                setAlert(0);
              }}
            />
          )}
          <ModalPage
            open={limitCheck || false}
            content={
              <>
                <div style={{ maxWidth: "309px" }}>
                  <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                  <p className={` ${Styles.ModalContent}`}>Please upload file with less than 100 products</p>
                  <div className="d-flex justify-content-center">
                    <button className={StylesModal.modalButton} onClick={() => setLimitCheck(false)}>
                      OK
                    </button>
                  </div>
                </div>
              </>
            }
            onClose={() => setLimitCheck(false)}
          />
          <ModalPage
            open={confirm || false}
            content={
              <div className="d-flex flex-column gap-3">
                <h2 style={{ textDecoration: 'underline' }}>
                  Confirm
                </h2>
                <p>
                  Are you sure you want to generate a order?<br /> This action cannot be undone.
                </p>
                <div className="d-flex justify-content-around ">
                  <button className={Styles.btnHolder} onClick={orderPlaceHandler} disabled={isDisabled}>
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
          {clearConfim ? (
            <ModalPage
              open
              content={
                <div className="d-flex flex-column gap-3">
                  <h2 className={`${Styles.warning} `}>Warning</h2>
                  <p className={`${Styles.warningContent} `}>
                    Are you Sure you want to clear bag?
                  </p>
                  <div className="d-flex justify-content-around ">
                    <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={deleteBag}>
                      Yes
                    </button>
                    <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => setClearConfim(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              }
              onClose={() => {
                setClearConfim(false);
              }}
            />
          ) : null}
          {orderStatus?.status ? (
            <ModalPage
              open
              content={
                <div className="d-flex flex-column gap-3" style={{ maxWidth: '700px' }}>
                  <h2 className={`${Styles.warning} `}>Error while Generating order</h2>
                  <p className={`${Styles.warningContent} `} style={{ lineHeight: '22px' }}>
                    We apologize for inconvenience, But we are facing trouble placing your order.
                    <br />
                    <p style={{ fontSize: '14px' }}>Please contact your SalesRep or Portal Support.</p>
                    <small>
                      {orderStatus.message}
                    </small>
                  </p>
                  <div className="d-flex justify-content-around ">
                    <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => setorderStatus({ status: false, message: "" })}>
                      OK
                    </button>
                  </div>
                </div>
              }
              onClose={() => {
                setorderStatus({ status: false, message: "" });
              }}
            />
          ) : null}
          <div className="">
            <div>
              <div className={Styles.MyBagFinalTop}>
                <div className={Styles.MyBagFinalRight}>
                  <button onClick={() => navigate("/orders")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" fill="none">
                      <path
                        d="M8.94284 2.27615C9.46349 1.75544 9.46349 0.911229 8.94284 0.390521C8.42213 -0.130174 7.57792 -0.130174 7.05721 0.390521L2.3911 5.05666C2.39092 5.05684 2.39128 5.05648 2.3911 5.05666L0.390558 7.05721C0.153385 7.29442 0.024252 7.59868 0.00313201 7.90895C-0.00281464 7.99562 -0.000321319 8.08295 0.010852 8.17002C0.0431986 8.42308 0.148118 8.66868 0.325638 8.87322C0.348651 8.89975 0.372651 8.92535 0.397585 8.94989L7.05721 15.6095C7.57792 16.1302 8.42213 16.1302 8.94284 15.6095C9.46349 15.0888 9.46349 14.2446 8.94284 13.7239L4.55231 9.33335H22.6667C23.4031 9.33335 24 8.73642 24 8.00002C24 7.26362 23.4031 6.66668 22.6667 6.66668H4.55231L8.94284 2.27615Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <h4>
                    {buttonActive ? (
                      <>
                        <span> <Link style={{ color: '#000' }} to={`/Brand/${order?.Manufacturer?.id}`}>{order?.Manufacturer?.name}</Link> |</span>&nbsp;<Link style={{ color: '#000' }} to={`/store/${order?.Account?.id}`}>{order?.Account?.name}</Link>
                      </>
                    ) : (
                      <span>Empty bag</span>
                    )}
                  </h4>
                </div>

                <div className={Styles.MyBagFinalleft}>
                  <h5>
                    PO Number{" "}
                    {!isPOEditable ? (
                      <b>
                        {buttonActive ? (
                          // If it's a Pre Order and PONumber doesn't already start with "PRE", prepend "PRE"
                          PONumber
                        ) : (
                          "---"
                        )}
                      </b>
                    ) : (
                      <input
                        type="text"
                        defaultValue={PONumber}
                        onKeyUp={(e) => setPONumber(e.target.value)}
                        placeholder=" Enter PO Number"
                        style={{ borderBottom: "1px solid black" }}
                        id="limit_input"
                        name="limit_input"
                        value={limitInput}
                        onChange={handleNameChange}
                        onKeyPress={(e) => {
                          if (e.key === " ") {
                            e.preventDefault(); // Prevent space character from being entered
                          }
                        }}
                      />
                    )}
                  </h5>

                  {!isPOEditable && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      onClick={() => setIsPOEditable(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <path
                        d="M19.3078 10.6932V19.2841C19.3078 19.6794 18.9753 20 18.5652 20H0.742642C0.332504 20 0 19.6794 0 19.2841V2.10217C0 1.70682 0.332504 1.38627 0.742642 1.38627H9.65389C10.064 1.38627 10.3965 1.70682 10.3965 2.10217C10.3965 2.49754 10.064 2.81809 9.65389 2.81809H1.48519V18.5682H17.8226V10.6932C17.8226 10.2979 18.1551 9.97731 18.5652 9.97731C18.9753 9.97731 19.3078 10.2979 19.3078 10.6932ZM17.9926 5.11422L15.6952 2.89943L7.72487 10.5832L7.09297 13.4072L10.0223 12.7981L17.9926 5.11422ZM21 2.2148L18.7027 0L16.8541 1.78215L19.1515 3.99692L21 2.2148Z"
                        fill="black"
                      />
                    </svg>
                  )}
                </div>

              </div>

              <div className={Styles.MyBagFinalMain}>
                <div className="row">
                  <div className="col-lg-7 col-md-8 col-sm-12">
                    <div className={Styles.MainBag}>
                      <h3>SHOPPING BAG (<OrderQuantity />)</h3>
                      <div className={Styles.scrollP}>
                        <div className={`${Styles.MainInner} overflow-auto`} style={{ minHeight: "400px" }}>
                          {order && order.items?.length > 0 ? (
                            order.items?.map((ele) => {

                              let salesPrice = ele?.price;
                              let listPrice = Number().toFixed(2);
                              if (salesPrice == 'NaN') {
                                salesPrice = 0;
                              }
                              listPrice = Number(ele?.usdRetail__c?.replace('$', '').replace(',', '')).toFixed(2);
                              if (ele?.usdRetail__c.includes("$")) {
                                if (listPrice == 'NaN') {
                                  listPrice = 0;
                                }
                              }

                              return (
                                <div className={Styles.Mainbox}>
                                  <div className={Styles.Mainbox1M}>
                                    <div className={Styles.Mainbox2} style={{ cursor: 'pointer' }}>
                                      {
                                        ele?.ContentDownloadUrl ? <img src={ele?.ContentDownloadUrl} f className="zoomInEffect" alt="img" width={50} onClick={() => { setProductDetailId(ele?.Id) }} /> : ele?.ProductImage ? <img src={ele?.ProductImage} f className="zoomInEffect" alt="img" width={50} onClick={() => { setProductDetailId(ele?.Id) }} /> : !productImage.isLoaded ? <LoaderV2 /> :
                                          productImage.images?.[ele?.ProductCode] ?
                                            productImage.images[ele?.ProductCode]?.ContentDownloadUrl ?
                                              <img src={productImage.images[ele?.ProductCode]?.ContentDownloadUrl} alt="img" width={25} onClick={() => { setProductDetailId(ele?.Id) }} />
                                              : <img src={productImage.images[ele?.ProductCode]} alt="img" width={25} onClick={() => { setProductDetailId(ele?.Id) }} />
                                            : <img src={Img1} alt="img" onClick={() => { setProductDetailId(ele?.Id) }} />
                                      }
                                    </div>
                                    <div className={Styles.Mainbox3}>
                                      <h2 onClick={() => { setProductDetailId(ele?.Id) }} style={{ cursor: 'pointer' }}>{ele?.Name}</h2>
                                      <p>
                                        <span className={Styles.Span1}>
                                          {`$${listPrice}`}
                                        </span>
                                        <span className={Styles.Span2}>${Number(salesPrice).toFixed(2)}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className={Styles.Mainbox2M}>
                                    <div className={Styles.Mainbox4} onClick={() => removeProduct(ele.Id)}>
                                      <DeleteIcon fill="red" />
                                    </div>
                                    <div className={Styles.Mainbox5}>
                                      <QuantitySelector
                                        min={ele?.Min_Order_QTY__c || 0}
                                        onChange={(quantity) => {
                                          updateProductQty(ele.Id, quantity);
                                        }}
                                        value={ele.qty}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <>
                              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "35vh" }}>
                                No Products in Bag
                              </div>
                            </>
                          )}
                        </div>
                        <div className={Styles.TotalPricer}>
                          <div>
                            <h2>Total</h2>
                          </div>
                          <div>
                            <h2>${Number(total).toFixed(2)}</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5 col-md-4 col-sm-12">
                    <div className={Styles.ShippControl}>
                      <h2>Shipping Address</h2>

                      <div className={Styles.ShipAdress}>
                        {buttonActive ? (
                          <p>
                            {order?.Account?.address?.street}, {order?.Account?.address?.city} <br />
                            {order?.Account?.address?.state}, {order?.Account?.address?.country} {order?.Account?.address?.postalCode}
                            <br />
                            {order?.Account?.address?.email} {order?.Account?.address?.contact && `{ |  ${order?.Account?.address?.contact}}`}
                          </p>
                        ) : (
                          <p>No Shipping Address</p>
                        )}
                      </div>

                      <div className={Styles.ShipAdress2}>
                        <textarea onKeyUp={(e) => { keyBasedUpdateCart({ Note: e.target.value }) }} placeholder="NOTE" className="placeholder:font-[Arial-500] text-[14px] tracking-[1.12px] ">{order?.Note}</textarea>
                      </div>
                      {!PONumberFilled ? (
                        <ModalPage
                          open
                          content={
                            <>
                              <div style={{ maxWidth: "309px" }}>
                                <h1 className={`fs-5 ${StylesModal.ModalHeader}`}>Warning</h1>
                                <p className={` ${StylesModal.ModalContent}`}> Please Enter PO Number</p>
                                <div className="d-flex justify-content-center">
                                  <button
                                    className={`${StylesModal.modalButton}`}
                                    onClick={() => {
                                      setPONumberFilled(true);
                                    }}
                                  >
                                    OK
                                  </button>
                                </div>
                              </div>
                            </>
                          }
                          onClose={() => {
                            setPONumberFilled(true);
                          }}
                        />
                      ) : null}
                      <div className={Styles.ShipBut}>
                        <button
                          onClick={() => {
                            if (order?.items?.length) {
                              if (PONumber.length) {
                                if (order?.items?.length > 100) {
                                  setLimitCheck(true)
                                } else {
                                  if (order.Account.discount.MinOrderAmount > total) {
                                    setAlert(1);
                                  } else {
                                    // if (testerInBag && order.Account.discount.testerproductLimit > total) {
                                    //   setAlert(2);
                                    // } else {
                                    setConfirm(true);
                                    // }
                                  }
                                }
                              } else {
                                setPONumberFilled(false);

                              }
                            }
                          }}
                          disabled={!buttonActive}
                        >
                          ${Number(total).toFixed(2)} PLACE ORDER
                        </button>
                        <p className={`${Styles.ClearBag}`} style={{ textAlign: 'center', cursor: 'pointer' }}
                          onClick={() => {
                            if (buttonActive) {
                              setClearConfim(true)
                            }
                          }
                          }
                          disabled={!buttonActive}
                        >Clear Bag</p>
                        {/* {Number(total) ? null : window.location.reload()} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} AccountId={[order?.Account?.id]} />
    </div>
  );
}

export default MyBagFinal;
