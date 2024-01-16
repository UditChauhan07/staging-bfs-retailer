import { useEffect, useState } from "react";

export const useNewnessReport = (props) => {
  // console.log("props", props);
  const [data, setData] = useState();
  useEffect(() => {
    fetchNewnessApiData(props.ManufacturerId__c, props.fromDate, props.toDate);
  }, [props]);

  const fetchNewnessApiData = (ManufacturerId__c, fromDate, toDate) => {
    fetch("https://dev.beautyfashionsales.com/newness", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Brand: ManufacturerId__c,
        toDate: toDate,
        fromDate: fromDate,
      },
    })
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((err) => console.log(err));
  };

  //   console.log(data);
  return data;
};
