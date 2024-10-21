import React, { createContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
let orderCartKey = "AA0KfX2OoNJvz7x"

// Create the context
const CartContext = createContext();

const initialOrder = {
    ordertype: null, // Initially null, will be set on the first product addition
    Account: {
        name: null,
        id: null,
        address: null,
        shippingMethod: null,
        discount: {
            MinOrderAmount: null,
            margin: null,
            sample: null,
            testerMargin: null,
            testerproductLimit: null,
        },
    },
    Manufacturer: {
        name: null,
        id: null,
    },
    items: [], // Cart items
    orderQuantity: 0, // Total quantity of products
    total: 0, // Total price
};

// Cart Provider component
const CartProvider = ({ children }) => {
    const [order, setOrder] = useState(() => {
        const savedCart = localStorage.getItem(orderCartKey);
        return savedCart ? JSON.parse(savedCart) : initialOrder;
    });

    useEffect(() => {
        localStorage.setItem(orderCartKey, JSON.stringify(order));
    }, [order]);

    // Helper function to confirm cart replacement
    // const confirmReplaceCart = () => {
    //     return window.confirm("Account, Manufacturer, or Order Type do not match the current cart. Do you want to replace the cart with the new details?");
    // };
    const confirmReplaceCart = (accountMatch, manufacturerMatch, orderTypeMatch) => {
        let message = "Account, Manufacturer, or Order Type do not match the current cart. Do you want to replace the cart with the new details?";

        if (accountMatch && manufacturerMatch && orderTypeMatch) {
            message = "The account, manufacturer, and order type match. Do you want to proceed with the cart replacement?";
        } else if (!accountMatch) {
            message = "The account does not match the current cart. Do you want to replace the cart with the new account details?";
        } else if (!manufacturerMatch) {
            message = "The manufacturer does not match the current cart. Do you want to replace the cart with the new manufacturer details?";
        } else if (!orderTypeMatch) {
            message = "The order type does not match the current cart. Do you want to replace the cart with the new order type?";
        }

        return Swal.fire({
            title: 'Replace Cart?',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',  // Black
            cancelButtonColor: '#000',   // White
            confirmButtonText: 'Yes, replace it!',
            cancelButtonText: 'No, keep current',
            background: '#f9f9f9',
            color: '#333',
        }).then((result) => {
            return result.isConfirmed;  // Returns true if user confirms, false otherwise
        });
    };

    // Initialize the order (always replace the existing cart)
    const initializeOrder = (account, manufacturer) => {
        setOrder({
            ...initialOrder,
            Account: account,
            Manufacturer: manufacturer,
        });

        return {
            status: 'success',
            message: 'New cart initialized with provided account and manufacturer.',
        };
    };

    // Add a product to the cart with validation and cart replacement logic
    const addOrder = async (product, account, manufacturer) => {
        // If the cart is empty or just initialized, set the orderType based on the first product added
        let qty = product.qty || product.Min_Order_QTY__c || 1
        if (!order.ordertype) {
            setOrder({
                ...order,
                ordertype: product.orderType,
                Account: account,
                Manufacturer: manufacturer,
                items: [{ ...product, qty }],
                orderQuantity: qty,
                total: product.price * (qty),
            });

            return {
                status: 'success',
                message: 'Product added to the new cart',
            };
        }

        // Check if the account, manufacturer, and order type match
        const isAccountMatch = order.Account.id === account.id;
        const isManufacturerMatch = order.Manufacturer.id === manufacturer.id;
        const isOrderTypeMatch = order.ordertype === product.orderType;

        if (isAccountMatch && isManufacturerMatch && isOrderTypeMatch) {
            // If all match, add the product to the existing cart
            setOrder((prevOrder) => {
                const existingProduct = prevOrder.items.find(item => item.Id === product.Id);
                console.log({ existingProduct });


                if (existingProduct) {
                    const updatedItems = prevOrder.items.map(item =>
                        item.Id === product.Id
                            ? { ...item, qty }  // Update quantity
                            : item
                    );

                    // Adjust the total quantity and price by removing the old values and adding the new ones
                    const updatedOrderQuantity = prevOrder.orderQuantity - existingProduct.qty + qty;
                    const updatedTotal = prevOrder.total - (existingProduct.price * existingProduct.qty) + (product.price * qty);

                    return {
                        ...prevOrder,
                        items: updatedItems,
                        orderQuantity: updatedOrderQuantity,
                        total: updatedTotal,
                    };
                } else {
                    // For new products, just add to order
                    return {
                        ...prevOrder,
                        items: [...prevOrder.items, { ...product, qty }],
                        orderQuantity: prevOrder.orderQuantity + qty,
                        total: prevOrder.total + product.price * qty,
                    };
                }
            });


            return { status: 'success', message: 'Product added to the existing cart' };
        } else {
            // If account, manufacturer, or orderType don't match, ask for confirmation to replace the cart
            let status = await confirmReplaceCart(isAccountMatch, isManufacturerMatch, isOrderTypeMatch);

            if (status) {
                // If confirmed, replace the cart and add the product
                setOrder({
                    ...initialOrder,
                    ordertype: product.orderType,
                    Account: account,
                    Manufacturer: manufacturer,
                    items: [{ ...product, qty: product.qty || 1 }],
                    orderQuantity: product.qty || 1,
                    total: product.price * (product.qty || 1),
                });

                return {
                    status: 'success',
                    message: 'The cart has been replaced with a new one. The product has been added to the new cart.',
                };
            } else {
                // User cancels the cart replacement
                return {
                    status: 'warning',
                    message: 'Cart replacement was canceled. The current cart remains unchanged, and the product was not added.',
                };
            }
        }
    };

    // Update product quantity
    const updateProductQty = (productId, qty) => {
        // Ensure qty is a valid positive number
        if (isNaN(qty) || qty <= 0) {
            console.log({qty});
            
            if(qty == 0){
                removeProduct(productId)
            }
            return; // Don't update if qty is invalid
        }

        setOrder((prevOrder) => {
            const product = prevOrder.items.find(item => item.Id === productId);
            if (!product) {
                console.warn(`Product with id ${productId} not found.`);
                return prevOrder; // No product found
            }

            const updatedItems = prevOrder.items.map(item =>
                item.Id === productId
                    ? { ...item, qty } // Update the product qty
                    : item
            );

            // Directly update the order quantity and total to avoid unnecessary recalculation
            const updatedOrderQuantity = prevOrder.orderQuantity - product.qty + qty;
            const updatedTotal = prevOrder.total - (product.price * product.qty) + (product.price * qty);

            return {
                ...prevOrder,
                items: updatedItems,
                orderQuantity: updatedOrderQuantity,
                total: updatedTotal,
            };
        });
    };


    // Remove a product from the cart by productId
    const removeProduct = (productId) => {
        setOrder((prevOrder) => {
            const updatedItems = prevOrder.items.filter(item => item.Id !== productId);
            const removedItem = prevOrder.items.find(item => item.Id === productId);
    
            // If the cart is empty after removing the item, reset to initialOrder
            if (updatedItems.length === 0) {
                return initialOrder;
            }
    
            // Otherwise, update the cart normally
            return {
                ...prevOrder,
                items: updatedItems,
                orderQuantity: prevOrder.orderQuantity - (removedItem ? removedItem.qty : 0),
                total: prevOrder.total - (removedItem ? removedItem.price * removedItem.qty : 0),
            };
        });
    };
    

    const isProductCarted = (productId) => {
        // Check if the product exists in the cart
        const matchingProducts = order.items.filter(item => item.Id === productId);
        
        // If found, return the array of matching products; if not, return false
        return matchingProducts.length > 0 ? matchingProducts[0] : false;
    };

    // Delete the entire cart (reset to initial state)
    const deleteOrder = () => {
        setOrder(initialOrder);
    };

    // Get order total
    const getOrderTotal = () => {
        return order.total;
    };

    // Get order quantity
    const getOrderQuantity = () => {
        return order.orderQuantity;
    };

    const contextValue = {
        order,
        initializeOrder,
        addOrder,
        updateProductQty,
        removeProduct,
        deleteOrder,
        getOrderTotal,
        getOrderQuantity,
        isProductCarted
    };

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

// Custom hook to use the CartContext
const useCart = () => {
    return React.useContext(CartContext);
};

export { CartProvider, useCart };