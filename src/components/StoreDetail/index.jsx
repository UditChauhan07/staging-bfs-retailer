import { BiDownload } from "react-icons/bi";
import Styles from "./index.module.css";

const StoreDetailCard = ({ account }) => {
    const bgColors = {
        "Kevyn Aucoin Cosmetics": "KevynAucoinCosmeticsBg",
        "Bumble and Bumble": "BumbleandBumbleBg",
        "BY TERRY": "BYTERRYBg",
        "Bobbi Brown": "BobbiBrownBg",
        "ReVive": "ReViveBg",
        "Maison Margiela": "MaisonMargielaBg",
        "Smashbox": "SmashboxBg",
        "RMS Beauty": "RMSBeautyBg",
        "ESTEE LAUDER": "esteeLauderBg",
        "AERIN": "RMSBeautyBg",
        "ESTEE LAUDER": "esteeLauderBg",
        "ESTEE LAUDER": "esteeLauderBg",
        "ESTEE LAUDER": "esteeLauderBg",
      };
      let bgColor = ["KevynAucoinCosmeticsBg", "BumbleandBumbleBg","BYTERRYBg","BobbiBrownBg","ReViveBg","MaisonMargielaBg","SmashboxBg","RMSBeautyBg"]
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
    return (<section className={Styles.container}>
        <div className={Styles.sectionHolder}>
            <h1 className={Styles.titleHolder}>{account.Name} | {account.BillingCity}, {account.BillingState}</h1>
            <div className={Styles.brandGrid}>
                {account.Brands && account.Brands.length > 0 && account.Brands.map((brand) => (
                    <>
                        <div className={`${Styles.brandHolder} ${Styles[bgColor[getRandomInt(bgColor.length)]]} dropdown dropdown-toggle`} role="button" data-bs-toggle="dropdown" aria-expanded="false" key={brand.ManufacturerId__c} >{brand.ManufacturerName__c}</div>
                        <ul className="dropdown-menu">
                            <li className="d-flex ml-2">
                                <BiDownload/>&nbsp;Audit Report
                            </li>
                        </ul>
                    </>
                ))}
            </div>
            <div className={Styles.bullets}>
                <b>
                    Billing Address:
                </b>
                <p>
                    {account.BillingAddress.street},{account.BillingAddress.city}<br />
                    {account.BillingAddress.state},{account.BillingAddress.country} {account.BillingAddress.postalCode}
                </p>
            </div>
            <div className={Styles.bullets}>
                <b>
                    Shipping Address:
                </b>
                <p>
                    {account.ShippingAddress.street},{account.ShippingAddress.city}<br />
                    {account.ShippingAddress.state},{account.ShippingAddress.country} {account.ShippingAddress.postalCode}
                </p>
            </div>
            <div className={Styles.bullets}>
                <b>
                    Business Type:
                </b>
                <p>
                    {account.Type_of_Business__c}
                </p>
            </div>
            {account.Display_or_Assortment__c&&
            <div className={Styles.bullets}>
                <b>
                    Display & Assortment:
                </b>
                <p>
                    {account.Display_or_Assortment__c}
                </p>
            </div>}
        </div>
    </section>)
}
export default StoreDetailCard;