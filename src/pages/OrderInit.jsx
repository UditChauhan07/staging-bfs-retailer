import { useEffect, useState } from "react";
import MyRetailersPage from "./MyRetailersPage";
import BrandsPage from "./BrandsPage";
import { GetAuthData } from "../lib/store";


const OrderInit = () => {
    const [isGridView, setIsGridView] = useState(true);
    useEffect(()=>{
        GetAuthData().then((user)=>{
            if(user.data.accountIds.length>1){
                setIsGridView(false);
            }
        }).catch((err)=>{
            console.log(err);
        })
    },[])
    if (isGridView) { return(<BrandsPage />) } else { return(<MyRetailersPage />) }
}
export default OrderInit;