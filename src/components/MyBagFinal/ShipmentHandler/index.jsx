import { useEffect } from 'react';
import { useCart } from '../../../context/CartContent';
import Styles from './Styles.module.css';

const ShipmentHandler = ({ data = [], total = 0 }) => {
    const { order, keyBasedUpdateCart } = useCart();

    // Function to determine the initial selected shipping method
    const getInitialSelectedShippingMethod = () => {
        if (!order?.Account) return null;

        const { shippingMethod } = order.Account;

        // Check if shippingMethod has an ID
        if (shippingMethod?.id) {
            return data.find(element => element.id === shippingMethod.id) || null;
        }

        // Check if shippingMethod has 'own'
        if (shippingMethod?.own) {
            return data.find(element => element.own === shippingMethod.own) || null;
        }

        // Match by method and number
        const matchedMethod = data.find(element => 
            element.number === shippingMethod?.number && 
            element.method === shippingMethod?.method
        );

        if (matchedMethod) {
            return matchedMethod;
        }
        if(data.length == 1){
            return data[0];
        }

        // Fallback to find a method with brandDefault true
        const defaultMethod = data.find(element => element.brandDefault === true);
        return defaultMethod || null;
    };

    // Set the initial selected shipping method
    const initialSelectedMethod = getInitialSelectedShippingMethod();

    useEffect(() => {
        // If there's an initial selected method, update the order
        if (initialSelectedMethod) {
            const tempOrder = { ...order.Account, shippingMethod: initialSelectedMethod };
            keyBasedUpdateCart({ Account: tempOrder });
        }
    }, [initialSelectedMethod]);

    const onChangeHandler = (element) => {
        const tempOrder = { ...order.Account, shippingMethod: element };
        keyBasedUpdateCart({ Account: tempOrder });
    };

    if (data.length === 0) return null;

    return (
        <div className={`${Styles.dFlex} ${Styles.gap10} m-1`}>
            {data.map((element, index) => {
                const isSelected = (order?.Account?.shippingMethod?.id === element.id ||
                    (order?.Account?.shippingMethod?.own && order?.Account?.shippingMethod.own === element.own) ||
                    (element.number && order?.Account?.shippingMethod?.number === element.number && order?.Account?.shippingMethod?.method === element.method));

                return (
                    <div
                        key={element?.Id || index}
                        className={`${Styles.templateHolder} ${isSelected ? Styles.selected : ''}`}
                        onClick={() => { onChangeHandler(element) }}>
                        <input
                            type="radio"
                            name="brand"
                            checked={isSelected}
                            value={element?.Id || index}
                            className={Styles.hiddenRadio} />
                        <p className={Styles.labelHolder}>{element.name}</p>
                        <small className={Styles.descHolder}>
                            {element?.desc}. For this order, shipping cost will be <b>${Number(total * element?.cal).toFixed(2) || 0}</b>
                        </small>
                    </div>
                );
            })}
        </div>
    );
};

export default ShipmentHandler;
// import { useEffect } from 'react';
// import { useCart } from '../../../context/CartContent';
// import Styles from './Styles.module.css';


// const ShipmentHandler = ({ data = [], total = 0 }) => {
//     console.log({data});
    
//     const { order, keyBasedUpdateCart } = useCart();
//     useEffect(() => { }, [data])
//     if (data.length == 0) return null

//     const onChangeHandler = (element) => {
//         let tempOrder = order?.Account;
//         if (tempOrder) {
//             tempOrder = { ...tempOrder, shippingMethod: element }
//         }
//         keyBasedUpdateCart({ Account: tempOrder })
//     }
//     return (
//         <div className={`${Styles.dFlex} ${Styles.gap10} mt-4`}>
//             {data.length ?
//                 data.map((element, index) => (
//                     <div
//                         key={element?.Id || index}
//                         className={`${Styles.templateHolder} ${(order?.Account?.shippingMethod?.id == element.id || order?.Account?.shippingMethod?.own ? order?.Account?.shippingMethod?.own == element?.own : false || (element?.number ? order?.Account?.shippingMethod?.number == element?.number : false && order?.Account?.shippingMethod?.method == element?.method)) ? Styles.selected : ''}`}
//                         onClick={() => { onChangeHandler(element) }}>
//                         <input
//                             type="radio"
//                             name="brand"
//                             checked={(order?.Account?.shippingMethod?.id == element.id || order?.Account?.shippingMethod?.own ? order?.Account?.shippingMethod?.own == element?.own : false || (element?.number ? order?.Account?.shippingMethod?.number == element?.number : false && order?.Account?.shippingMethod?.method == element?.method))}
//                             value={element?.Id || index}
//                             className={Styles.hiddenRadio} />
//                         <p className={Styles.labelHolder}>{element.name}</p>
//                         <small className={Styles.descHolder}>{element?.desc}. for this order, shipping cost will be <b>${Number(total * element?.cal).toFixed(2) || 0}</b>
//                         </small>
//                     </div>
//                 ))
//                 : null}
//         </div>
//     )
// }
// export default ShipmentHandler; 