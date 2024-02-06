import { DestoryAuth } from "../lib/store";
import { useFetch } from "./useFetch";

export const useProductList = (data) => {
  const { Manufacturer, AccountId__c, Sales_Rep__c, key } = data;

  const productList = useFetch(data ? "https://b2b.beautyfashionsales.com/beauty/HSc6cv4" : null, {
    method: "POST",
    body: JSON.stringify({ Manufacturer, AccountId__c, Sales_Rep__c, key }),
  });
  if (productList.status == 300) {
    DestoryAuth();
  } else {
    return productList;
  }
};
