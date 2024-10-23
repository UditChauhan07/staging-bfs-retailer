import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContent";
import styles from "./index.module.css";

const CartHover = () => {
    const { order } = useCart();
    const navigate = useNavigate();
    const path = window.location.pathname;
    console.log({ order });
    if (!order?.items?.length) return null;
    const addMoreHandler = () => {
        localStorage.setItem("manufacturer", order.Manufacturer.name);
        localStorage.setItem("ManufacturerId__c", order.Manufacturer.id);
        localStorage.setItem("Sales_Rep__c", order.Account.SalesRepId);
        localStorage.setItem("shippingMethod", JSON.stringify({ number: order.Account.shippingMethod, method: order.Account.shippingMethod }));
        localStorage.setItem("Account", order.Account.name);
        localStorage.setItem("AccountId__c", order.Account.id);
        localStorage.setItem("address", JSON.stringify(order.Account.address));
        navigate("/orders");
    }
    return (
        <div className={styles.holder}>
            {path != "/my-bag" ?
                <Link to={'/my-bag'} className={styles.button}>
                    Go to My Bag
                </Link> : null}
            {path != "/orders" ?
                <button className={styles.button} onClick={addMoreHandler}>
                    Add More
                </button> : null}
        </div>
    )
}
export default CartHover;