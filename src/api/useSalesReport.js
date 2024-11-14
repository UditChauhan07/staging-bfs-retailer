import axios from "axios";
import { DestoryAuth, GetAuthData, originAPi } from "../lib/store";
import { useAuth } from "../context/UserContext";

const useSalesReport = () => {
  return {
    salesReportData: async ({ yearFor, accountIds }) => {
      if (accountIds) {
        let user = await GetAuthData();
        let reportUrl = originAPi + "/retailerv2/R11RNaniUMbA3qn";
        const response = await axios.post(
          reportUrl,
          {
            accountIds,
            key: user?.data?.x_access_token,
            yearFor: yearFor
          }
        );
        if (response.status == 300) {
          DestoryAuth();
        } else {
          return response;
        }
      }
    }
  };
};

export default useSalesReport;
