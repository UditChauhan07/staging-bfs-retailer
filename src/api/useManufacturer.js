import { DestoryAuth } from "../lib/store";
import { useFetch } from "./useFetch";

export const useManufacturer = () => {
  const manufacturers = useFetch(
    "https://b2b.beautyfashionsales.com/beauty/v3/yRNGIO",
    {
      method: "POST",
    }
  );
  if(manufacturers.status==300){
    DestoryAuth();
  }
  return manufacturers;
};
