import React, { useState , useEffect} from 'react';
import { GetAuthData, OrderPlaced } from '../../lib/store';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useCart } from "../../context/CartContent";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './style.css'
import { originAPi } from '../../lib/store';
import axios from 'axios';
const CheckoutForm = ({ amount, clientSecretkKey, PONumber, orderDes, setIsDisabled = null, setorderStatus = null }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cardHolderName, setCardHolderName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [cardErrors, setCardErrors] = useState({});
    const { order, deleteOrder , deleteCartForever } = useCart();
    const [orderDesc, setOrderDesc] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const handleCardInput = (event) => {
        const { error, elementType } = event;


        if (error && error.message !== "Your card number is incomplete") {
            setCardErrors(prevErrors => ({
                ...prevErrors,
                [elementType]: error.message
            }));
        } else {
            setCardErrors(prevErrors => ({
                ...prevErrors,
                [elementType]: ''
            }));
        }
    };
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!paymentSuccess) {
                const message = "If you reload, the data you entered will be lost, and your payment has not been processed successfully.";
                event.preventDefault();
                event.returnValue = message;  // Standard way to display message
                return message;  // For some browsers like Chrome
            }
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [paymentSuccess]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setErrorMessage('');
        setCardErrors({});
        var user = await GetAuthData()
       
        const cardElement = elements.getElement(CardNumberElement);
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: { name: cardHolderName , email : user?.data?.email  },
        });
        localStorage.setItem('isEditaAble' , 1)

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        const clientSecret = clientSecretkKey;
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethod.id,
        });

        if (confirmError) {
            setErrorMessage(confirmError.message);
            setLoading(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
         
            await orderPlaceHandler(paymentIntent.status, paymentIntent.id);
        } else {
            setErrorMessage("Payment failed. Please try again.");
           localStorage.removeItem("isEditaAble")
        }

        setLoading(false);

    };

    const orderPlaceHandler = async (paymentStatus, paymentId) => {
        if (order?.Account?.SalesRepId) {
            try {
                setLoading(true);
                const user = await GetAuthData();
                if (order.Account.id && order.Manufacturer.id) {
                    let orderItems = order.items.map(product => ({
                        Id: product.Id,
                        ProductCode: product.ProductCode,
                        qty: product.qty,
                        price: product?.price,
                        discount: product?.discount,
                    }));

                    let orderType = order.items.some(product =>
                        product?.Category__c?.toUpperCase()?.includes("PREORDER") ||
                        product?.Category__c?.toUpperCase()?.match("EVENT")
                    ) ? "Pre Order" : "Wholesale Numbers";

                    const orderData = {
                        AccountId: order?.Account?.id,
                        Name: order?.Account?.name,
                        ManufacturerId__c: order?.Manufacturer?.id,
                        PONumber,
                        desc: orderDes,
                        SalesRepId: order?.Account?.SalesRepId,
                        Type: orderType,
                        ShippingCity: order?.Account?.address?.city,
                        ShippingStreet: order?.Account?.address?.street,
                        ShippingState: order?.Account?.address?.state,
                        ShippingCountry: order?.Account?.address?.country,
                        ShippingZip: order?.Account?.address?.postalCode,
                        list: orderItems,
                        key: user.data.x_access_token,
                        shippingMethod: order.Account.shippingMethod,
                        Payment_Status__c: paymentStatus,
                        Transaction_ID__c: paymentId
                    };

                    const response = await OrderPlaced({ order: orderData, cartId: order.id });
                    if (response) {
                        if (response?.err) {
                            setIsDisabled?.(false);
                            setorderStatus?.({
                                status: true,
                                message: response?.err[0].message,
                            });
                        }
                        if (response?.orderId) {
                            localStorage.setItem(
                                "OpportunityId",
                                JSON.stringify(response.orderId)
                            );
                            setPaymentSuccess(true);
                            Swal.fire({
                                title: 'Payment Successful!',
                                text: 'Your payment is successful and order has been placed.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                                customClass: {
                                    confirmButton: 'swal2-confirm'
                                }
                            }).then(() => {
                                localStorage.removeItem("isEditaAble")
                                deleteOrder();
                                deleteCartForever()
                                 
                                setTimeout(()=>{
                                    window.location.href = window.location.origin + '/orderDetails';
                                },[800])
                               
                            });
                        }
                    }
                    else {
                        Swal.fire({
                            title: 'Order Creation fail',
                            text: 'Your payment is successful and order has not been placed.',
                            icon: 'fail',
                            confirmButtonText: 'view',
                            customClass: {
                                confirmButton: 'swal2-confirm'
                            }
                        })
                    }
                    if (response?.length) {
                        setErrorMessage(response[0].message);
                    } else {
                        console.log("Order placed successfully.");
                    }
                } else {
                    console.error("Missing Account ID or Manufacturer ID in order.");
                }
            } catch (error) {
                setErrorMessage("Order placement failed.");
            } finally {
                setLoading(false);
            }
        } else {
            alert("No sales rep found.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-2">
            <div className="mb-4">
                <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 uppercase tracking-wider">Cardholder Name</label>
                <input
                    type="text"
                    id="cardHolderName"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter cardholder name"
                    required
                />
                {cardErrors.cardHolderName && <p className="text-red-500 text-sm">{cardErrors.cardHolderName}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 uppercase tracking-wider">Card Number</label>
                <CardNumberElement
                    id="cardNumber"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    options={{
                        style: {
                            base: { color: '#32325d', fontSize: '16px', lineHeight: '24px', '::placeholder': { color: '#aab7c4' } },
                            invalid: { color: '#fa755a', iconColor: '#fa755a' },
                        },
                    }}
                    onChange={handleCardInput}
                />
                {cardErrors.cardNumber && <p className="text-red-500 text-sm">{cardErrors.cardNumber}</p>}
            </div>

            <div className="mb-4 flex space-x-4">
                <div className="w-1/2">
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 uppercase tracking-wider">Expiration Date (MM/YY)</label>
                    <CardExpiryElement
                        id="cardExpiry"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        options={{
                            style: {
                                base: { color: '#32325d', fontSize: '16px', lineHeight: '24px', '::placeholder': { color: '#aab7c4' } },
                                invalid: { color: '#fa755a', iconColor: '#fa755a' },
                            },
                        }}
                        onChange={handleCardInput}
                    />
                    {cardErrors.cardExpiry && <p className="text-red-500 text-sm">{cardErrors.cardExpiry}</p>}
                </div>
                <div className="w-1/2">
                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 uppercase tracking-wider">CVC</label>
                    <CardCvcElement
                        id="cardCvc"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        options={{
                            style: {
                                base: { color: '#32325d', fontSize: '16px', lineHeight: '24px', '::placeholder': { color: '#aab7c4' } },
                                invalid: { color: '#fa755a', iconColor: '#fa755a' },
                            },
                        }}
                        onChange={handleCardInput}
                    />
                    {cardErrors.cardCvc && <p className="text-red-500 text-sm">{cardErrors.cardCvc}</p>}
                </div>
            </div>


            <div className="text-center">
                <button type="submit" disabled={!stripe || loading} className={`mt-4 w-full py-2 px-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-black hover:bg-black'} transition`}>
                    {loading ? "Processing..." : `PAY $${Number(amount).toFixed(2)}`}
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;
