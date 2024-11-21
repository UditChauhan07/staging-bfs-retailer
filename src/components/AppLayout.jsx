import React, { useEffect } from "react";
import TopNav from "./All Headers/topNav/TopNav";
import LogoHeader from "./All Headers/logoHeader/LogoHeader";
import Header from "./All Headers/header/Header";
import MobileHeader from "./All Headers/mobileHeader/MobileHeader";
import HelpSection from "./Footer/HelpSection";
import Footer from "./Footer/Footer";
import { GetAuthData, getAllAccountStore } from "../lib/store";
import { motion } from 'framer-motion';

const AppLayout = ({ children, filterNodes }) => {
  // useEffect(()=>{
  //   GetAuthData().then((user)=>{
  //     console.log({user});
  //     getAllAccountStore({key:user.data.x_access_token,retailerId:user.data.retailerId}).then((store)=>{
  //       localStorage.setItem("Name", store?.data?.Name);
  //       console.log({store});
  //       localStorage.setItem("Api Data", JSON.stringify(store));
  //       localStorage.setItem("jAuNW7c6jdi6mg7", JSON.stringify(store));
  //     }).catch((storeErr)=>{
  //       console.log({storeErr});
  //     })
  //   }).catch((userErr)=>{
  //     console.log({userErr});
  //   })
  // },[])
  const pageVariants = {
    initial: { opacity: 0, x: "-100vw" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100vw" },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };
  return (

    <div className="col-12">
      <div className="container p-0">
        <TopNav />
        <hr className="hrBgColor" />
        <div className="sticky-top">
          <LogoHeader />
          <Header />
          <MobileHeader />
          <div className="filter-container">{filterNodes}</div>
        </div>
        <main>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      {/* <HelpSection /> */}
      <Footer />
    </div>

  );
};

export default AppLayout;
