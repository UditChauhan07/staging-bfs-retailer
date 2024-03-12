import React, { useState } from "react";
import MyBagFinal from "../components/OrderList/MyBagFinal";
import AppLayout from "../components/AppLayout";
import html2pdf from 'html2pdf.js';
import { MdOutlineDownload } from "react-icons/md";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
const fileExtension = ".xlsx";
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
function MyBagOrder(props) {
  const [orderDetail, setOrderDetail] = useState([]);
  const generatePdf = () => {
    const element = document.getElementById('orderDetailerContainer'); // The HTML element you want to convert
    // element.style.padding = "10px"
    let filename = `Order Details `;
    filename += new Date();
    const opt = {
      margin: 0.1,
      filename: filename + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'in', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const csvData = ({ data }) => {
    let finalData = [];
    let accountDetails = {"":"Account Name"," ":data.Name}
    let brandDetail = {"":"Brand Name"," ":data.ManufacturerName__c}
    let poDetail = {"":"PO Number"," ":data.PO_Number__c}
    let orderNumberDetail = {"":"Order Number"," ":data.Order_Number__c}
    let trackingumberDetail = {"":"Tracking Number"," ":data.Tracking__c}
    finalData.push(accountDetails)
    finalData.push(brandDetail)
    finalData.push(poDetail)
    if(data?.Order_Number__c) finalData.push(orderNumberDetail)
    if(data?.Tracking__c) finalData.push(trackingumberDetail)
    let productHeaderDetail = {"":"Product Name"," ":"Product Qty","  ":"Product Price"}
  if(data?.OpportunityLineItems?.length>0) finalData.push(productHeaderDetail)
    if (data?.OpportunityLineItems.length) {
      data?.OpportunityLineItems?.map((ele) => {
            let temp = {};
            temp[""] = ele.Name;
            temp[" "] = ele.Quantity;
            temp["  "] = ele.UnitPrice;
            finalData.push(temp);
      });
    }
    return finalData;
  };

  const generateXLSX = (orderDetail) => {
    const ws = XLSX.utils.json_to_sheet(csvData({ data: orderDetail }));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    let filename = `Order Detail `;
    FileSaver.saveAs(data, `${filename} ${new Date()}` + fileExtension);
  };
  return (
    <AppLayout filterNodes={
        orderDetail?.Id &&
          <div className="dropdown dropdown-toggle border px-2.5 py-1 leading-tight d-flex" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <div className=" d-grid" role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <MdOutlineDownload size={16} className="m-auto" />
              <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Download</small>
            </div>
            <ul className="dropdown-menu">
              <li>
                <div className="dropdown-item text-start" onClick={() => generatePdf()}>&nbsp;Pdf</div>
              </li>
              <li>
                <div className="dropdown-item text-start" onClick={() => generateXLSX(orderDetail)}>&nbsp;XLSX</div>
              </li>
            </ul>
          </div>
    }>
      <div className="col-12">
        <MyBagFinal setOrderDetail={setOrderDetail} />
      </div>
    </AppLayout>
  );
}

export default MyBagOrder;
