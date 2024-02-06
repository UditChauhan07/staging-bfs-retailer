import axios from "axios";
import { DestoryAuth } from "../lib/store";

export const useComparisonReport = (props) => {
  return {
    fetchComparisonReportAPI: async ( {ManufacturerId__c, month, year}) => {
      // console.log("props", ManufacturerId__c, month, year);
      const response = await axios.post("https://b2b.beautyfashionsales.com/9kJs2I6Bn/FyBoxRrjdc", {
        ManufacturerId__c: ManufacturerId__c,
        month: month,
        year: year,
      });
      if (response.status == 300) {
        DestoryAuth();
      } else {
        return response.data;
      }
    },
  };
};
