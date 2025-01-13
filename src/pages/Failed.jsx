import React from "react";
import LoginHeader from "../components/All Headers/loginHeader/LoginHeader";

const Failed = () => {
    return (
        <>
            <LoginHeader />
            <div class="container">
                <div class="row justify-content-center">
                    <div class="h-[80vh] d-grid place-content-center">
                        <div class="message-box _success m-auto text-center">
                            <div style={{ display: 'grid', placeContent: 'center' }}><img src="/assets/images/failed.gif" width={100} /></div>
                            <h2> Your payment failed</h2>
                            <p>
                                
                                
                                Try again later

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Failed;
