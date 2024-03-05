import { useEffect, useState } from "react";
import Styles from "./index.module.css";
import { ShareDrive, getProductImageAll } from "../../lib/store";
import LoaderV2 from "../loader/v2";
import { Link } from "react-router-dom";
import ProductDetails from "../../pages/productDetails";
import { useBag } from "../../context/BagContext";
import ModalPage from "../Modal UI";
import QuantitySelector from "../BrandDetails/Accordion/QuantitySelector";
import { DeleteIcon } from "../../lib/svg";

const TopProductCard = ({ data, productImages, to = null, accountDetails = {}, addToCart = true }) => {
    const [productDetailId, setProductDetailId] = useState(null)
    const { orders, setOrders, setOrderQuantity, addOrder, setOrderProductPrice } = useBag();
    const [product, setProduct] = useState({ isLoaded: false, data: [], discount: {} });
    const [replaceCartModalOpen, setReplaceCartModalOpen] = useState(false);
    const [replaceCartProduct, setReplaceCartProduct] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(true)
    useEffect(() => {
    }, [productDetailId, productImages])

    const orderSetting = (element, quantity) => {
        setReplaceCartModalOpen(false);
        addOrder(element, quantity, product.discount);
    };
    const onQuantityChange = (element, quantity, salesPrice = null, discount = null) => {
        element.salesPrice = salesPrice;
        if (Object.values(orders).length) {
            if (
                Object.values(orders)[0]?.manufacturer?.id === localStorage.getItem("ManufacturerId__c") &&
                Object.values(orders)[0].account.id === localStorage.getItem("AccountId__c") &&
                Object.values(orders)[0].productType === (element.Category__c === "PREORDER" ? "pre-order" : "wholesale")
            ) {
                orderSetting(element, quantity);
                setReplaceCartModalOpen(false);
            } else {
                setReplaceCartModalOpen(true);
                setReplaceCartProduct({ product: element, quantity });
            }
        } else {
            orderSetting(element, quantity);
        }
    };

    const onPriceChangeHander = (element, price = '0') => {
        if (price == '') price = 0;
        setOrderProductPrice(element, price)
    }
    const replaceCart = () => {
        localStorage.removeItem("orders");
        setReplaceCartModalOpen(false);
        setOrderQuantity(0);
        setOrders({});
        addOrder(replaceCartProduct.product, replaceCartProduct.quantity, product.discount);
    };
    return (<section>
        {replaceCartModalOpen ? (
            <ModalPage
                open
                content={
                    <div className="d-flex flex-column gap-3">
                        <h2>Warning</h2>
                        <p>
                            Adding this item will replace <br></br> your current cart
                        </p>
                        <div className="d-flex justify-content-around ">
                            <button className={Styles.btn} onClick={replaceCart}>
                                OK
                            </button>
                            <button className={Styles.btn} onClick={() => setReplaceCartModalOpen(false)}>
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
        <div>
            <div className={Styles.dGrid}>
                {data.map((product) => {
                    let listPrice = Number(product?.usdRetail__c?.replace('$', '').replace(',', ''));
                    let salesPrice = 0;
                    let discount = accountDetails?.Discount?.margin;
                    let inputPrice = Object.values(orders)?.find((order) => order.product.Id === product?.Id && order.manufacturer.name === product?.ManufacturerName__c && order.account.id === localStorage.getItem("AccountId__c"))?.product?.salesPrice;
                    if (product?.Category__c === "TESTER") {
                        discount = accountDetails?.Discount?.testerMargin
                        salesPrice = (+listPrice - (accountDetails?.Discount?.testerMargin / 100) * +listPrice).toFixed(2)
                    } else if (product?.Category__c === "Samples") {
                        discount = accountDetails?.Discount?.sample
                        salesPrice = (+listPrice - (accountDetails?.Discount?.sample / 100) * +listPrice).toFixed(2)
                    } else {
                        salesPrice = (+listPrice - (accountDetails?.Discount?.margin / 100) * +listPrice).toFixed(2)
                    }
                    return (
                    <div className={Styles.cardElement}>
                        <div className={Styles.salesHolder}>{product.Sales}</div>
                        {productImages?.isLoaded ? <img className={Styles.imgHolder} onClick={() => { setProductDetailId(product.Id) }} src={productImages?.images?.[product.ProductCode]?.ContentDownloadUrl ?? '/assets/images/makeup1.png'} /> : <LoaderV2 />}
                        <p className={Styles.brandHolder}>{product?.ManufacturerName__c}</p>
                        <p className={Styles.titleHolder} onClick={() => { setProductDetailId(product.Id) }}>{product?.Name.substring(0, 20)}...</p>
                        {product?.Category__c === "PREORDER" && <small className={Styles.preOrderBadge}>Pre-Order</small>}
                        <p className={Styles.priceHolder}>
                            <p className={Styles.priceCrossed}>${listPrice.toFixed(2)}</p>&nbsp;{orders[product?.Id]?<Link to={'/my-bag'}>${salesPrice}</Link>:<p>${salesPrice}</p>}</p>
                        {orders[product?.Id] ? <>
                            {/* <b className={Styles.priceHolder}>{inputPrice * orders[product?.Id]?.quantity}</b> */}
                            <div className="d-flex">
                                <QuantitySelector min={product?.Min_Order_QTY__c || 0} value={orders[product?.Id]?.quantity} onChange={(quantity) => {
                                    onQuantityChange(product, quantity, inputPrice || parseFloat(salesPrice), accountDetails?.Discount);
                                }} />
                                <button className="ml-4" onClick={() => onQuantityChange(product, 0, inputPrice || parseFloat(salesPrice), accountDetails?.Discount)}><DeleteIcon fill="red" /></button>
                            </div>
                        </> : to ?
                            <Link to={to} className={Styles.linkHolder}><p className={Styles.btnHolder}>add to Cart</p></Link>
                            : <p className={Styles.btnHolder} onClick={() => onQuantityChange(product, product?.Min_Order_QTY__c || 1, inputPrice || parseFloat(salesPrice), accountDetails?.Discount)} style={{ cursor: 'pointer' }}>Add to Cart</p>}
                    </div>)
                })}
            </div>
        </div>
        <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} accountDetails={accountDetails} AccountId={localStorage.getItem("AccountId__c")} ManufacturerId={localStorage.getItem("ManufacturerId__c")}/>
    </section>)
}
export default TopProductCard;