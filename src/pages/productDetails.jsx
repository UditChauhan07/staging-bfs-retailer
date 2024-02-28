import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useEffect, useState } from "react";
import { GetAuthData, getProductDetails } from "../lib/store";
import Loading from "../components/Loading";
import { useBag } from "../context/BagContext";
import ModalPage from "../components/Modal UI";
import ProductDetailCard from "../components/ProductDetailCard";

const ProductDetails = ({ productId,setProductDetailId,isAddtoCart=true }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location || {};
    const { orders, setOrders, setOrderQuantity, addOrder, setOrderProductPrice } = useBag();
    const [product, setProduct] = useState({ isLoaded: false, data: [], discount: {} });
    const [replaceCartModalOpen, setReplaceCartModalOpen] = useState(false);
    const [replaceCartProduct, setReplaceCartProduct] = useState({});


    useEffect(() => {
        if (state?.productId) {
            GetAuthData().then((user) => {
                let rawData = { productId: state.productId, key: user?.data?.x_access_token, salesRepId: localStorage.getItem("Sales_Rep__c"), accountId: localStorage.getItem("AccountId__c") }
                getProductDetails({ rawData }).then((productRes) => {
                    console.log({productRes});
                    setProduct({ isLoaded: true, data: productRes.data, discount: productRes.discount })
                }).catch((proErr) => {
                    console.log({ proErr });
                })
            }).catch((err) => {
                console.log({ err });
            })
        } else {
            navigate('/product');
        }
    }, [])

    const orderSetting = (element, quantity) => {
        setReplaceCartModalOpen(false);
        addOrder(element, quantity, product.discount);
    };
    const onQuantityChange = (element, quantity, salesPrice = null, discount = null) => {
        element.salesPrice = salesPrice;
        if (Object.values(orders).length) {
            if (
                Object.values(orders)[0]?.manufacturer?.name === localStorage.getItem("manufacturer") &&
                Object.values(orders)[0].account.name === localStorage.getItem("Account") &&
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
    let styles = {}
    let orderofThisProduct = orders[product?.data?.Id];
    if (orderofThisProduct?.manufacturer?.name == product?.data?.ManufacturerName__c && orderofThisProduct?.account?.name == localStorage.getItem("Account")) {
    }
    return (
        <AppLayout>
            {replaceCartModalOpen ? (
                <ModalPage
                    open
                    content={
                        <div className="d-flex flex-column gap-3">
                            <h2 className={`${styles.warning} `}>Warning</h2>
                            <p className={`${styles.warningContent} `}>
                                Adding this item will replace <br></br> your current cart
                            </p>
                            <div className="d-flex justify-content-around ">
                                <button className={`${styles.modalButton}`} onClick={replaceCart}>
                                    OK
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
            {!product?.isLoaded ? <Loading /> :
                <ProductDetailCard product={product} orders={orders} onQuantityChange={onQuantityChange} onPriceChangeHander={onPriceChangeHander} />}
        </AppLayout>
    );
};
export default ProductDetails;