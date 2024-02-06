import axios from "axios";

const access_token = async () => {
  const response = await axios.post("https://b2b.beautyfashionsales.com/beauty/login");
  return response.data.data.access_token;
};
export const usePublicManufacturers = () => {
  return {
    manufacturers: async () => {
      const key = await access_token();
      let body = {
        key: String(key),
        link: "https://beautyfashionsales.my.salesforce.com/services/data/v56.0/query?q=SELECT Id, Name, Manufacturer_Logo__c,IsActive__c FROM Manufacturer__c where IsActive__c= 'active'  order by name",
      };
      const response = await axios.post("https://b2b.beautyfashionsales.com/beauty/B0F9FC7237C", body);
      return response.data.data.records;
    },
  };
};
