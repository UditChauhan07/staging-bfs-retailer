import FullQuearyDetail from "../components/CustomerSupportPage/FullQuearyDetail";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GetAuthData, getSupportDetails, getAttachment } from "../lib/store";
import { useLocation } from "react-router";
import AppLayout from "../components/AppLayout";
import LoaderV3 from "../components/loader/v3";

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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const user = await GetAuthData();
        const rawData = { key: user?.data?.x_access_token, caseId: detailsId };
        const details = await getSupportDetails({rawData}); 
        details.salesRepName = user.Name;
        setDetailsData(details);
        setLoaded(true);
        setRest(false);
      } catch (error) {
        console.error("Error fetching support details:", error);
      }
    };

    if (detailsId) {
      fetchDetails();
    }
  }, [detailsId, reset]); 

  // useEffect(() => {
  //   const fetchAttachmentsWithTimeout = async () => {
  //     if (!detailsId) return;

  //     const timeout = setTimeout(async () => {
  //       try {
  //         setLoadingAttachments(true);
  //         const user = await GetAuthData();
  //         const response = await getAttachment(user.data.x_access_token, detailsId);

  //         if (response) {
  //           const formattedAttachments = response.attachments.map((attachment) => ({
  //             id: attachment.id,
  //             formattedId: `${attachment.id}.${attachment.name.split(".").pop().toLowerCase()}`,
  //             name: attachment.name,
  //           }));
  //           setAttachmentUrls(formattedAttachments);
  //         } else {
  //           console.warn("No attachments found in response");
  //           setAttachmentUrls([]);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching attachments:", error);
  //       } finally {
  //         setLoadingAttachments(false);
  //         setAttachmentsLoaded(true);
  //       }
  //     }, 3000); 

     
  //     return () => clearTimeout(timeout);
  //   };

  //   fetchAttachmentsWithTimeout();

  // }, [detailsId]); 

  useEffect(() => {
    const fetchAttachmentsWithTimeout = async () => {
      if (!detailsId) return;
  
      const timeout = setTimeout(async () => {
        try {
          setLoadingAttachments(true);
          const user = await GetAuthData();
  
          let response;
          let retries = 0;
          const maxRetries = 3; 
          const expectedAttachmentCount = 100; 
  
          while (retries < maxRetries) {
            response = await getAttachment(user.data.x_access_token, detailsId);
            
            if (response && response.attachments && response.attachments.length === expectedAttachmentCount) {
              break; 
            }
  
            retries += 1;
            console.log(`Retrying (${retries}/${maxRetries})...`);
          }
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
