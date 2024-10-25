import React, { useState } from "react";
import styles from "./Style.module.css";
import CollapsibleRow from "../../CollapsibleRow";
import QuantitySelector from "./QuantitySelector";
import ModalPage from "../../Modal UI";
import LoaderV2 from "../../loader/v2";
import ProductDetails from "../../../pages/productDetails";
import { useCart } from "../../../context/CartContent";

const Accordion = ({ data, formattedData, productImage = [], productCartSchema = {} }) => {
  const { testerInclude, sampleInclude } = productCartSchema || true;

  let Img1 = "/assets/images/dummy.png";
  const { order, updateProductQty, addOrder, removeProduct, deleteOrder, isProductCarted, isCategoryCarted } = useCart();
  const [replaceCartModalOpen, setReplaceCartModalOpen] = useState(false);
  // console.log(productCartSchema)
  const [replaceCartProduct, setReplaceCartProduct] = useState({});
  const [showName, setShowName] = useState(false);
  const [productDetailId, setProductDetailId] = useState(null)
  const [msg, setMsg] = useState('');
  


  const onQuantityChange = (element, quantity) => {
    if (!quantity) {
      quantity = element.Min_Order_QTY__c;
    }
    let checkProduct = isProductCarted(element.Id);
    if (checkProduct) {
      let cartStatus = updateProductQty(element.Id, quantity);
    } else {
      let listPrice = Number(element?.usdRetail__c?.replace("$", "")?.replace(",", ""));
      let account = {
        name: localStorage.getItem("Account"),
        id: localStorage.getItem("AccountId__c"),
        address: JSON.parse(localStorage.getItem("address")),
        shippingMethod: JSON.parse(localStorage.getItem("shippingMethod")),
        discount: data.discount,
        SalesRepId: localStorage.getItem("Sales_Rep__c"),
      }

      let manufacturer = {
        name: element.ManufacturerName__c,
        id: element.ManufacturerId__c,
      }
      let orderType = 'wholesale';
      if (element?.Category__c?.toUpperCase() === "PREORDER" || element?.Category__c?.toUpperCase()?.match("EVENT")) {
        orderType = 'pre-order'
      }
      element.orderType = orderType;
      let discount = 0;
      if (element?.Category__c === "TESTER") {
        discount = data.discount?.testerMargin || 0;
      } else if (element?.Category__c === "Samples") {
        discount = data.discount?.sample || 0;
      } else {
        discount = data.discount?.margin || 0;
      }
      let salesPrice = (+listPrice - ((discount || 0) / 100) * +listPrice).toFixed(2);
      element.price = salesPrice;
      element.qty = quantity;
      // element.discount = discount;
      let cartStatus = addOrder(element, account, manufacturer);
    }
  }

  const orderSetting = (product, quantity) => {
    setReplaceCartModalOpen(false);
    addOrder(product, quantity, data.discount);
  };

  const replaceCart = () => {
    localStorage.removeItem("orders");
    setReplaceCartModalOpen(false);
    deleteOrder();
    addOrder(replaceCartProduct.product, replaceCartProduct.quantity, data.discount);
  };

  const sendProductIdHandler = ({ productId, productName }) => {
    // navigate('/product/'+productName.replaceAll(" ","-").replaceAll("=","-"), { state: { productId } });
    setProductDetailId(productId)
  }
  return (
    <>
      {replaceCartModalOpen ? (
        <ModalPage
          open
          content={
            <div className="d-flex flex-column gap-3">
              <h2 className={`${styles.warning} `}>Warning</h2>
              <p className={`${styles.warningContent} `} dangerouslySetInnerHTML={{ __html: msg ? msg : "Adding this item will replace </br> your current cart" }}>
              </p>
              <div className="d-flex justify-content-around ">
                <button className={`${styles.modalButton}`} style={msg ? { width: '150px' } : {}} onClick={replaceCart}>
                  {msg ? "Replace cart" : "OK"}
                </button>
                <button className={`${styles.modalButton}`} onClick={() => setReplaceCartModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          }
          onClose={() => {
            setReplaceCartModalOpen(false);
          }}
        />
      ) : null}
      <div className={styles.OverFloweClass}>
        <div className={styles.accordion}>
          <table className="table table-hover ">
            <thead>
              <tr>
                <th>Image</th>
                <th style={{ width: "200px" }}>Title</th>
                <th>Product Code</th>
                <th>UPC</th>
                <th>List Price</th>
                <th style={{ width: "175px" }}>Sale Price</th>
                <th>Min Qty</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            {Object.keys(formattedData).length ? (
              <>
                <tbody>
                  {Object.keys(formattedData)?.map((key, index) => {
                    let categoryOrderQuantity  = false;
                    if(order?.Account?.id == localStorage.getItem("AccountId__c")&&order?.Manufacturer?.id==localStorage.getItem("ManufacturerId__c")){
                    categoryOrderQuantity = isCategoryCarted(key);
                    }
                    return (
                      <CollapsibleRow title={key != "null" ? key : "No Category"} quantity={categoryOrderQuantity} key={index} index={index} >
                        {Object.values(formattedData)[index]?.map((value, indexed) => {
                          let cartProduct = isProductCarted(value.Id);

                          let listPrice = Number(value?.usdRetail__c?.replace('$', '').replace(',', ''));
                          if (isNaN(listPrice)) {
                            listPrice = 0;
                          }
                          let salesPrice = 0;
                          let discount = 0;
                          let inputPrice = cartProduct?.items?.price;
                          let qtyofItem = cartProduct?.items?.qty || 0;
                          
                          if (value?.Category__c === "TESTER") {
                            discount = data?.discount?.testerMargin
                          } else if (value?.Category__c === "Samples") {
                            discount = data?.discount?.sample
                          } else {
                            discount = data?.discount?.margin
                          }
                          salesPrice = (+listPrice - (discount / 100) * +listPrice).toFixed(2)
                          return (
                            <tr className={`${styles.ControlTR} w-full `} key={indexed}>
                              <td className={styles.ControlStyle} style={{ cursor: 'pointer' }}>
                                {
                                  value.ContentDownloadUrl ? <img src={value.ContentDownloadUrl} className="zoomInEffect" alt="img" width={50} onClick={() => sendProductIdHandler({ productId: value.Id, productName: value.Name })} /> :
                                    !productImage.isLoaded ? <LoaderV2 /> :
                                      productImage.images?.[value?.ProductCode] ?
                                        productImage.images[value?.ProductCode]?.ContentDownloadUrl ?
                                          <img src={productImage.images[value?.ProductCode]?.ContentDownloadUrl} className="zoomInEffect" alt="img" width={35} onClick={() => sendProductIdHandler({ productId: value.Id, productName: value.Name })} />
                                          : <img src={productImage.images[value?.ProductCode]} className="zoomInEffect" alt="img" width={35} onClick={() => sendProductIdHandler({ productId: value.Id, productName: value.Name })} />
                                        : <img src={Img1} className="zoomInEffect" alt="img" onClick={() => sendProductIdHandler({ productId: value.Id, productName: value.Name })} width={50} />
                                }
                                {/* {!productImage.isLoaded?<LoaderV2/>:productImage.images[value.ProductCode]?<img src={productImage.images[value.ProductCode]?.ContentDownloadUrl?productImage.images[value.ProductCode]?.ContentDownloadUrl:productImage.images[value.ProductCode]} alt="img" width={35} />:<img src={Img1} alt="img" />} */}
                              </td>
                              <td className="text-capitalize linkEffect" style={{ fontSize: '13px', cursor: 'pointer' }} onMouseEnter={() => setShowName({ index: indexed, type: true })}
                                onMouseLeave={() => setShowName({ index: indexed })} onClick={() => sendProductIdHandler({ productId: value.Id, productName: value.Name })}>
                                {indexed !== showName?.index && value.Name.length >= 23 ? `${value.Name.substring(0, 23)}...` : value.Name}
                              </td>
                              <td>{value.ProductCode}</td>
                              <td>{(value.ProductUPC__c === null || value.ProductUPC__c === "n/a") ? "--" : value.ProductUPC__c}</td>
                              <td>{value?.usdRetail__c?.includes("$") ? `$${listPrice}` : `$${Number(value.usdRetail__c).toFixed(2)}`}</td>
                              <td>
                                <div className="d-flex">
                                  ${salesPrice}
                                </div>
                              </td>
                              <td>{value.Min_Order_QTY__c || 0}</td>
                              <td>
                                <QuantitySelector
                                  min={value.Min_Order_QTY__c || 0}
                                  onChange={(quantity) => {
                                    if (quantity) {
                                      onQuantityChange(value, quantity);
                                    } else {
                                      removeProduct(value.Id);
                                    }
                                  }}
                                  value={qtyofItem}
                                />
                              </td>
                              <td>{(qtyofItem > 0) ? '$' + (inputPrice * qtyofItem).toFixed(2) : '----'}</td>
                            </tr>
                          );
                        })}
                      </CollapsibleRow>
                    );
                  })}{" "}
                </tbody>
              </>
            ) : (
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="flex justify-start items-center py-4 w-full lg:min-h-[300px] xl:min-h-[380px]">No Data Found</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
      <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} ManufacturerId={localStorage.getItem("ManufacturerId__c")} AccountId={[localStorage.getItem("AccountId__c")]} />
    </>
  );
};

export default Accordion;
