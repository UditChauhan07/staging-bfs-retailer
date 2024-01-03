import React, { useEffect, useMemo, useState } from 'react'
import Styles from './Styles.module.css'

function TrackingStatus({ TrackingData, opportunityId }) {
    const [data, setdata] = useState(TrackingData || []);
    console.log(opportunityId);
    console.log(data);




    let newId = TrackingData?.filter((data) =>
        data.Id === opportunityId
    );

    const Values = useMemo(() => {
        let newId = TrackingData?.filter((data) =>
            data.Id === opportunityId
        );
        console.log(newId);
        setdata(newId)
    }, [TrackingData, opportunityId])

    

    return (
        <div>
            <section>
                <div className={Styles.mainTop}>
                    <h2>Tracking Status </h2>
                    <div className={Styles.mainControl}>

                        <div className={Styles.ProtuctInnerBox}>
                            <div className={Styles.BoxBlack}>
                                <div className={Styles.Boxwhite}>
                                    <h1>25 <span>Products</span></h1>
                                </div>
                            </div>
                        </div>


                        <div className={Styles.ProtuctInnerBoxPara}>
                            <div className={Styles.ProtuctInnerBoxInner}>
                                <h3>Vitamin Enriched Face Base <span className={Styles.span3}>(+ 24 more)</span></h3>
                                <p><span className={Styles.Span1}>PO Number :</span>   <span className={Styles.Span2}>#407-9596458</span></p>
                                <p><span className={Styles.Span1}>Brand :</span>   <span className={Styles.Span2}>Susanne kaufmann</span></p>
                                <p><span className={Styles.Span1}>Order Placed :</span>   <span className={Styles.Span2}>24 December 2023</span></p>
                                <p><span className={Styles.Span1}>Tracking Id :</span>   <span className={Styles.Span2}>#2345235</span></p>
                                <p><span className={Styles.Span1}>Shipment Method :</span>   <span className={Styles.Span2}>FedEx</span></p>

                            </div>

                        </div>

                    </div>

                    <div className={Styles.ShippedBar}>
                        <h3>Tracking Status :  <span>Shipped</span></h3>
                        <div className={Styles.BtnGroup}>
                            <button type="submit">CANCEL</button>
                            <button>SUBMIT TRACKING STATUS REQUEST </button>

                        </div>

                    </div>


                </div>
            </section>
        </div>


    )
}

export default TrackingStatus