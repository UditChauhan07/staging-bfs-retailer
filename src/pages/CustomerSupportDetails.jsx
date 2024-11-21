import FullQuearyDetail from "../components/CustomerSupportPage/FullQuearyDetail";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GetAuthData, getSupportDetails, getAttachment } from "../lib/store";
import { useLocation } from "react-router";
import AppLayout from "../components/AppLayout";
import LoaderV3 from "../components/loader/v3";
import dataStore from "../lib/dataStore";

const CustomerSupportDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reset, setRest] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const detailsId = queryParams.get("id");
  const [detailsData, setDetailsData] = useState({});
  const [attachmentUrls, setAttachmentUrls] = useState([]);
  const [isLoadingAttachments, setLoadingAttachments] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [isAttachmentsLoaded, setAttachmentsLoaded] = useState(false);
  const handleCustomerSupportReady = (data)=>{
    setDetailsData(data);
    setLoaded(true);
    setRest(false);
  }

  const fetchDetails = async () => {
    try {
      const user = await GetAuthData();
      const rawData = { key: user?.data?.x_access_token, caseId: detailsId };
      const details = await dataStore.getPageData(location.pathname+location.search,()=>getSupportDetails({rawData})); 
      details.salesRepName = user.Name;
      handleCustomerSupportReady(details)
    } catch (error) {
      console.error("Error fetching support details:", error);
    }
  };
  useEffect(() => {
    dataStore.subscribe(location.pathname+location.search,handleCustomerSupportReady)
    if (detailsId) {
      fetchDetails();
    }
    return ()=>{
      dataStore.unsubscribe(location.pathname+location.search,handleCustomerSupportReady)
    }
  }, [detailsId, reset]); 

  useEffect(() => {
    const fetchAttachmentsWithTimeout = async () => {
      if (!detailsId) return;
  
      const timeout = setTimeout(async () => {
        try {
          setLoadingAttachments(true);
          const user = await GetAuthData();
  
          let response;
  
            response = await dataStore.getPageData(location.pathname+location.search+"&invoice=true",()=>getAttachment(user.data.x_access_token, detailsId));
            
          if (response && response.attachments) {
            const formattedAttachments = response.attachments.map((attachment) => ({
              id: attachment.id,
              formattedId: `${attachment.id}.${attachment.name.split(".").pop().toLowerCase()}`,
              name: attachment.name,
            }));
            setAttachmentUrls(formattedAttachments);
          } else {
            console.warn("Attachments could not be fully fetched after retries");
            setAttachmentUrls([]);
          }
  
        } catch (error) {
          console.error("Error fetching attachments:", error);
        } finally {
          setLoadingAttachments(false);
          setAttachmentsLoaded(true);
        }
      }, 4000); 
  
      return () => clearTimeout(timeout);
    };
  
    fetchAttachmentsWithTimeout();
  }, [detailsId]);


  if (!detailsId || detailsId === "") return navigate("/customer-support");

  if (!isLoaded|| !isAttachmentsLoaded)
    return (
      <AppLayout>
        <LoaderV3 text={"Loading Support Details"} />
      </AppLayout>
    );

  return (
    <AppLayout>
      {isLoadingAttachments ? (
        <LoaderV3 text={"Loading Attachments..."} />
      ) : (
        <FullQuearyDetail data={detailsData} setRest={setRest} attachmentUrls={attachmentUrls} />
      )}
    </AppLayout>
  );
};

export default CustomerSupportDetails;
