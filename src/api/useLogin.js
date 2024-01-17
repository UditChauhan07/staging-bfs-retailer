import axios from "axios";

const useLogin = () => {
  return {
    mutateLogin: async (email, password) => {
      // const response = await axios.post("https://dev.beautyfashionsales.com/beauty/v3/PYmsWL", { email, password });
      const response = await axios.post("https://dev.beautyfashionsales.com/beauty/v3/gqJW69", { email, password });
      localStorage.setItem("response", JSON.stringify(response));
      console.log(response);
      return response.data;
    },
  };
};

export default useLogin;
