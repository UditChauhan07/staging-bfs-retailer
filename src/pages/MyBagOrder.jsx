import React from "react";
import MyBagFinal from "../components/OrderList/MyBagFinal";
import AppLayout from "../components/AppLayout";

function MyBagOrder(props) {
  return (
    <AppLayout>
      <div className="col-12">
        <MyBagFinal />
      </div>
    </AppLayout>
  );
}

export default MyBagOrder;
