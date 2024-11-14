import { useSearchParams } from "react-router-dom";
import FullQuearyDetail from "../components/CustomerSupportPage/FullQuearyDetail";
import Layout from "../components/Layout/Layout";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { GetAuthData, getSupportDetails } from "../lib/store";
import Loading from "../components/Loading";
import AppLayout from "../components/AppLayout";
import LoaderV3 from "../components/loader/v3";
import dataStore from "../lib/dataStore";

const CustomerSupportDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deatilsId, setDetailsId] = useState(searchParams.get("id"));
  const [detailsData, setDetailsData] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const [reset, setRest] = useState(false);
  useEffect(() => {
    GetAuthData()
      .then(async (user) => {
        let rawData = { key: user?.data?.x_access_token, caseId: deatilsId };
        const cachedData = await dataStore.retrieve(location.pathname + location.search);
        if (cachedData) {
          cachedData.salesRepName = user.Name;
          setDetailsData(cachedData);
          setLoaded(true);
          setRest(false)
        }

        dataStore.getPageData(location.pathname + location.search, () => getSupportDetails({ rawData }))
          .then((deatils) => {
            deatils.salesRepName = user.Name;
            setDetailsData(deatils);
            setLoaded(true);
            setRest(false)
          })
          .catch((err) => {
            console.error({ err });
          });
      })
      .catch((error) => {
        console.error({ error });
      });
  }, [deatilsId]);

  const setRestHandler = () => {
    GetAuthData()
      .then((user) => {
        let rawData = { key: user?.data?.x_access_token, caseId: deatilsId };
        dataStore.update(location.pathname + location.search, () => getSupportDetails({ rawData }))
          .then((deatils) => {
            deatils.salesRepName = user.Name;
            setDetailsData(deatils);
            setLoaded(true);
            // setRest(false)
          })
          .catch((err) => {
            console.error({ err });
          });
      })
      .catch((error) => {
        console.error({ error });
      });
  }
  if (!deatilsId || deatilsId == "") return navigate("/customer-support");
  if (!isLoaded) return <AppLayout><LoaderV3 text={"Loading Support Details"} /></AppLayout>;
  return (
    <AppLayout>
      <FullQuearyDetail data={detailsData} setRest={setRestHandler} />
    </AppLayout>
  );
};
export default CustomerSupportDetails;
