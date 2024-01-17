import axios from "axios";

const useSalesReport = () => {
  return {
    salesReportData: async ({startDate,endDate}) => {
      console.log("props",startDate,endDate);
      const response = await axios.post(
        "https://dev.beautyfashionsales.com/9kJs2I6Bn/i0IT68Q8&0",
        {
          salesRepId: JSON.parse(localStorage.getItem("Api Data")).data.Sales_Rep__c,
          startDate:startDate,
          endDate:endDate
        }
      );
      // const response = await axios.post("https://dev.beautyfashionsales.com/report/4i1cKeDt9");
      console.log("response",response);
      return response;
    },
  };
};

export default useSalesReport;
