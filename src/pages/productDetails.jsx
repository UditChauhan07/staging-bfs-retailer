import AppLayout from "../components/AppLayout";
import { useEffect, useState } from "react";
import { defaultLoadTime, GetAuthData, getProductDetails } from "../lib/store";
import Loading from "../components/Loading";
import ModalPage from "../components/Modal UI";
import ProductDetailCard from "../components/ProductDetailCard";
import { CloseButton } from "../lib/svg";
import { useCart } from "../context/CartContent";
import Select from "react-select";
import dataStore from "../lib/dataStore";
import useBackgroundUpdater from "../utilities/Hooks/useBackgroundUpdater";




const ProductDetails = ({ productId, setProductDetailId, AccountId = null, isPopUp = true }) => {
    const { addOrder, isProductCarted } = useCart();
    const [product, setProduct] = useState({ isLoaded: false, data: [], discount: {} });
    const [replaceCartModalOpen, setReplaceCartModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(isPopUp);
    const [isModalNoRepOpen, setIsModalNoRepOpen] = useState(false);
    const [dealAccountList, setAccountList] = useState([]); // Default to empty array
    const [selectAccount, setSelectAccount] = useState();
    const [replaceCartProduct, setReplaceCartProduct] = useState({});

    const handlePageData = async () => {
        setProduct({ isLoaded: false, data: [], discount: {} });
        GetAuthData()
            .then(async (user) => {
                const rawData = {
                    productId,
                    key: user?.data?.x_access_token,
                    accountIds: JSON.stringify(AccountId ? [AccountId] : user.data.accountIds),
                };
                dataStore.getPageData("/productPage/" + productId, () =>
                    getProductDetails({ rawData }))
                    .then(async (productRes) => {
                        if (productRes) {
                            setProduct({ isLoaded: true, data: productRes.data, discount: productRes.discount });
                        }
                    })
                    .catch((proErr) => console.log({ proErr }));
            })
            .catch((err) => console.log({ err }));
    }

    useEffect(() => {
        if (productId) {
            dataStore.subscribe("/productPage/" + productId, (data) => setProduct({ isLoaded: true, data: data.data, discount: data.discount }));
            setIsModalOpen(isPopUp);
            handlePageData();
            return () => {
                dataStore.unsubscribe("/productPage/" + productId, (data) => setProduct({ isLoaded: true, data: data.data, discount: data.discount }));
            }
        }
    }, [productId, isPopUp]);

    useBackgroundUpdater(handlePageData, defaultLoadTime)

    if (!productId) return null;

    const onQuantityChange = (element, quantity) => {
        let listPrice = Number(element?.usdRetail__c?.replace("$", "").replace(",", ""));
        let selectProductDealWith = product?.discount || {};
        let listOfAccounts = Object.keys(selectProductDealWith);
        let addProductToAccount = null;

        if (listOfAccounts.length) {
            if (listOfAccounts.length === 1) {
                addProductToAccount = listOfAccounts[0];
            } else {
                if (selectAccount) {
                    if (selectAccount?.value) addProductToAccount = selectAccount.value;
                } else {
                    const accounts = listOfAccounts.map((actId) => ({
                        value: actId,
                        label: selectProductDealWith[actId].Name,
                    }));
                    setReplaceCartProduct({ product: element, quantity });
                    setAccountList(accounts); // Populate account options for modal
                    return; // Stop further processing to await account selection
                }
            }

            if (addProductToAccount) {
                const accountDetails = selectProductDealWith[addProductToAccount];
                const account = {
                    name: accountDetails?.Name,
                    id: addProductToAccount,
                    address: accountDetails?.ShippingAddress,
                    shippingMethod: accountDetails?.ShippingMethod,
                    discount: accountDetails?.Discount,
                    SalesRepId: accountDetails?.SalesRepId,
                };
                const manufacturer = {
                    name: element.ManufacturerName__c,
                    id: element.ManufacturerId__c,
                };
                let orderType = element?.Category__c?.toUpperCase().includes("PREORDER") || element?.Category__c?.toUpperCase().includes("EVENT") ? 'pre-order' : 'wholesale';
                element.orderType = orderType;

                let discount = 0;
                if (element?.Category__c === "TESTER") {
                    discount = accountDetails?.Discount?.testerMargin || 0;
                } else if (element?.Category__c === "Samples") {
                    discount = accountDetails?.Discount?.sample || 0;
                } else {
                    discount = accountDetails?.Discount?.margin || 0;
                }
                element.price = (+listPrice - ((discount || 0) / 100) * +listPrice).toFixed(2);
                element.qty = element.Min_Order_QTY__c;

                addOrder(element, account, manufacturer);
            }
        }
    };

    const accountSelectionHandler = () => {
        onQuantityChange(replaceCartProduct.product, replaceCartProduct.quantity);
        accountSelectionCloseHandler();
    };

    const accountSelectionCloseHandler = () => {
        setReplaceCartProduct({});
        setAccountList([]); // Reset to empty array instead of undefined
        setSelectAccount(null);
    };

    const HtmlFieldSelect = ({ title, list = [], value, onChange }) => (
        <div style={{ border: '1px dashed #ccc', padding: '10px', width: '100%', marginBottom: '20px' }}>
            <p style={{ color: '#000', textAlign: 'left', fontFamily: 'Montserrat', fontSize: '14px', fontWeight: 500 }}>
                {title}
            </p>
            <Select
                options={list}
                onChange={onChange}
                value={list.find((option) => option.value === value?.value) || ""}
            />
        </div>
    );

    const btnStyles = { color: '#fff', backgroundColor: '#000', width: '100px', height: '30px', cursor: 'pointer' };

    return (
        <>
            {(Array.isArray(dealAccountList) && dealAccountList.length > 0) && (
                <ModalPage
                    styles={{ zIndex: 1022 }}
                    open={true} // Always open if dealAccountList has items
                    content={
                        <div className="d-flex flex-column gap-3">
                            <h2>Attention!</h2>
                            <p>Please select store you want to order for</p>
                            <HtmlFieldSelect value={selectAccount} list={dealAccountList} onChange={setSelectAccount} />
                            <div className="d-flex justify-content-around">
                                <button style={btnStyles} onClick={accountSelectionHandler}>OK</button>
                                <button style={btnStyles} onClick={accountSelectionCloseHandler}>Cancel</button>
                            </div>
                        </div>
                    }
                    onClose={accountSelectionCloseHandler}
                />
            )}

            {isPopUp && isModalOpen ? (
                <ModalPage
                    open
                    content={
                        <div className="d-flex flex-column gap-3" style={{ width: '75vw' }}>
                            <div style={{ position: 'sticky', top: '-20px', background: '#fff', zIndex: 1, padding: '15px 0' }}>
                                <div className="d-flex align-items-center justify-content-between" style={{ minWidth: '75vw' }}>
                                    <h1 className="font-[Montserrat-500] text-[22px] m-0 p-0">Product Details</h1>
                                    <button onClick={() => { setIsModalOpen(false); setProductDetailId(null); }}>
                                        <CloseButton />
                                    </button>
                                </div>
                                <hr />
                            </div>
                            {isModalNoRepOpen ? (
                                <ModalPage
                                    open
                                    content={<div className="d-flex flex-column gap-3"><h2>Warning</h2><p>You cannot order from this brand. Please contact your Sales Rep.</p></div>}
                                    onClose={() => setIsModalNoRepOpen(false)}
                                />
                            ) : null}
                            {!product.isLoaded ? <Loading /> : (
                                <ProductDetailCard
                                    product={product}
                                    orders={isProductCarted(productId)}
                                    onQuantityChange={onQuantityChange}
                                />
                            )}
                        </div>
                    }
                    onClose={() => { setIsModalOpen(false); setProductDetailId(null); }}
                />
            ) : (
                <div className="product-details-content">
                    <h1 className="font-[Montserrat-500] text-[22px] m-0 p-0">Product Details</h1>
                    {!product.isLoaded ? <Loading /> : (
                        <ProductDetailCard
                            product={product}
                            orders={isProductCarted(productId)}
                            onQuantityChange={onQuantityChange}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default ProductDetails;

