import { useFetch } from "./useFetch";

export const useRetailersData = () => {
  const fetchedRetailers = useFetch(
    "https://b2b.beautyfashionsales.com/beauty/v3/JbUxci",
    {
      method: "POST",
    }
  );
  return fetchedRetailers;
};
