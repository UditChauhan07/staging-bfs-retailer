import React from "react";
import LoginHeader from "../components/All Headers/loginHeader/LoginHeader";
import CreateAccountForm from "../components/Account/CreateAccount";

const SignUp = () => {
  return (
    <>
      <LoginHeader />
      <div className="row m-0 d-flex flex-column justify-content-around align-items-center lg:min-h-[300px] xl:min-h-[400px]">
        <div className="col-12 m-0">
          {/* <p className="m-0 fs-2 font-[Montserrat-400] text-[14px] tracking-[2.20px]">Coming Soon...</p> */}
          <CreateAccountForm/>
        </div>
      </div>
    </>
  );
};

export default SignUp;
