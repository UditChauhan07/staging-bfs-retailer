import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useLocation, useParams } from "react-router-dom";
import { defaultLoadTime, GetAuthData, getStoreDetails } from "../lib/store";
import { useNavigate } from "react-router-dom";
import StoreDetailCard from "../components/StoreDetail";
import LoaderV3 from "../components/loader/v3";
import dataStore from "../lib/dataStore";
import useBackgroundUpdater from "../utilities/Hooks/useBackgroundUpdater";

const StoreDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [account, setAccount] = useState({ isLoaded: false, data: {} });

    const handlePageData =async ()=>{
        GetAuthData().then((user) => {
            dataStore.getPageData(location.pathname + location.search, () => getStoreDetails({ key: user.data.x_access_token, Id: id })).then((actDetails) => {
                setAccount({ isLoaded: true, data: actDetails })
            }).catch((actErr) => {
                console.log({ actErr });
            })
        }).catch((userErr) => {
            console.log({ userErr });
        })
    }
    useEffect(() => {
        dataStore.subscribe(location.pathname + location.search,(data)=>setAccount({ isLoaded: true, data: data }))
        if (id) {

            handlePageData();
        } else {
            navigate("/");
        }
        return ()=>{
            dataStore.unsubscribe(location.pathname + location.search,(data)=>setAccount({ isLoaded: true, data: data }))
        }
    }, [id])
    useBackgroundUpdater(handlePageData,defaultLoadTime)
    const { isLoaded, data } = account;
    return (<AppLayout>
        {isLoaded ? <StoreDetailCard account={data} /> : <LoaderV3 text={"Please wait..."} />}
    </AppLayout>)
}
export default StoreDetails;