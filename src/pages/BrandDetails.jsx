import AppLayout from "../components/AppLayout"
import {useParams} from "react-router-dom";
import BrandDetailCard from "../components/BrandDetail";
import { useEffect } from "react";
const BrandDetails = ()=>{
    const {id} = useParams();
    useEffect(()=>{},[id])
    return(<AppLayout>
        <BrandDetailCard brandId={id}/>
    </AppLayout>)
}
export default BrandDetails