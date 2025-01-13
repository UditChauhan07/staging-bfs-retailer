import React from "react";
import LoginHeader from "../components/All Headers/loginHeader/LoginHeader";
import { BiCheckCircle } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";

const ThankYou = () => {
    return (
        <>
            <LoginHeader />
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-5">
                        <div class="message-box mt-4 _success m-auto text-center">
                            <div style={{ display: 'grid', placeContent: 'center' }}><FaCheckCircle fill="#28a745" size={100} /></div>
                            <h2> Your payment was successful </h2>
                            <p> Thank you for your payment.<br />
                                Please check details on this <a href="/">link</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ThankYou;
