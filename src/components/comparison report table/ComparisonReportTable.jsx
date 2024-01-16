import React from "react";
import Loading from "../Loading";
import styles from "./table.module.css";
const ComparisonReportTable = ({ comparisonData }) => {
  return (
    <>
      {comparisonData ? (
        <>
          <div className={`d-flex p-3 ${styles.tableBoundary} mb-5 mt-3`}>
            <div className="table-responsive overflow-scroll position-relative" style={{ maxHeight: "73vh", minHeight: "40vh", width: "100vw",  }}>
              <table id="salesReportTable" className="table table-responsive">
                <thead>
                  <tr>
                    <th className={`${styles.th} ${styles.stickyFirstColumnHeading} `} style={{ minWidth: "200px" }}>
                      Retail Store
                    </th>
                    <th className={`${styles.th}  ${styles.stickyMonth}`} style={{ minWidth: "200px" }}>
                      Estee Lauder Number
                    </th>
                    <th className={`${styles.th} ${styles.stickyMonth}`}> Sales Rep</th>
                    <th className={`${styles.th} ${styles.stickyMonth} `}>Retail Revenue</th>
                    <th className={`${styles.th} ${styles.stickyMonth} `}>Wholesale Amount</th>
                    <th className={`${styles.th} `}></th>
                  </tr>
                </thead>
                {comparisonData?.data?.length ? (
                  <tbody>
                    <>
                      {comparisonData?.data?.map((ele, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td className={`${styles.td} ${styles.stickyFirstColumn}`}>{ele.AccountName}</td>
                              <td className={`${styles.td}`}>{ele.Estee_Lauder_Number__c} </td>
                              <td className={`${styles.td}`}>{ele.Sales_Rep__c}</td>
                              <td className={`${styles.td}`}>${Number(ele.retail_revenue__c).toFixed(2)}</td>
                              <td className={`${styles.td}`}>${Number(ele.Whole_Sales_Amount).toFixed(2)}</td>
                            </tr>
                          </>
                        );
                      })}
                    </>
                  </tbody>
                ) : (
                  <div className="d-flex justify-content-center align-items-center position-absolute top-50 start-50">
                    No data found
                  </div>
                )}
              </table>
            </div>
          </div>
        </>
      ) : (
        <Loading height={"70vh"} />
      )}
    </>
  );
};

export default ComparisonReportTable;
