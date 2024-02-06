import { DestoryAuth } from "../lib/store";
import { useFetch } from "./useFetch";

export const useRetailersData = () => {
  const fetchedRetailers = useFetch(
    "https://b2b.beautyfashionsales.com/beauty/v3/JbUxci",
    {
      method: "POST",
    }
  );
  if (fetchedRetailers.status == 300) {
    DestoryAuth();
  } else {
  return fetchedRetailers;
  }
};
