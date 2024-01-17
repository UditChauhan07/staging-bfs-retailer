import axios from "axios";

export const useComparisonReport = (props) => {
  return {
    fetchComparisonReportAPI: async ( {ManufacturerId__c, month, year}) => {
      // console.log("props", ManufacturerId__c, month, year);
      const response = await axios.post("https://dev.beautyfashionsales.com/9kJs2I6Bn/FyBoxRrjdc", {
        ManufacturerId__c: ManufacturerId__c,
        month: month,
        year: year,
      });
      return response.data;
    },
  };
};
