import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useLocation, useParams } from "react-router-dom";
import { GetAuthData, getStoreDetails } from "../lib/store";
import { useNavigate } from "react-router-dom";
import StoreDetailCard from "../components/StoreDetail";
import LoaderV3 from "../components/loader/v3";
import dataStore from "../lib/dataStore";

const StoreDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [account, setAccount] = useState({ isLoaded: false, data: {} });
    useEffect(() => {
        if (id) {
            GetAuthData().then((user) => {
                console.log({ user });
                dataStore.getPageData(location.pathname + location.search, () => getStoreDetails({ key: user.data.x_access_token, Id: id })).then((actDetails) => {
                    setAccount({ isLoaded: true, data: actDetails })
                }).catch((actErr) => {
                    console.log({ actErr });
                })
            }).catch((userErr) => {
                console.log({ userErr });
            })
        } else {
            navigate("/");
        }
    }, [id])

    const { isLoaded, data } = account;
    return (<AppLayout>
        {isLoaded ? <StoreDetailCard account={data} /> : <LoaderV3 text={"Please wait..."} />}
    </AppLayout>)
}
export default StoreDetails;