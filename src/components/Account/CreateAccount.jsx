import React, { useEffect, useState } from "react";
import style from "./accountStyle.module.css";
import Styles from "../Modal UI/Styles.module.css";
import { COntactName, ChooseBrand, QuestionMark, Picture, StoreName, Describe, Gmail } from "./svgIcon";
import { ErrorMessage, Field, Form, Formik } from "formik";
import TextError from "../../validation schema/TextError";
import { SignUpFormSchema } from "../../validation schema/SignupValidaion";
import { useSignUp } from "../../api/useSignUp";
import { useNavigate } from "react-router";
import ModalPage from "../Modal UI";
import Loading from "../Loading";
import { usePublicManufacturers } from "../../api/usePublicManufacturers";
import Swal from "sweetalert2";

function CreateAccountForm() {
  const navigate = useNavigate();
  const [initialValues,setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    storeName: "",
    storeLocation: "",
    descriptionOfStore: "",
    sellOption: "",
    brands: [],
  });
  const [redirect, setRedirect] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [files, setFile] = useState([])
  const api = useSignUp();
  const ApiManufacturers = usePublicManufacturers();
  const manufacturersCall = async () => {
    // setLoading(true);
    const manufacturers = await ApiManufacturers.manufacturers();
    setManufacturers(manufacturers);
    // setLoading(false);
  };
  useEffect(() => {
    manufacturersCall();
  }, []);

  const redirecting = () => {
    setTimeout(() => {
      navigate("/");
    }, 6000);
  };
  const handleSubmit = async (values, action) => {
    setLoading(true);
    const result = await api.newUserSignUp(values,files);
    setLoading(false);
    if (!Array.isArray(result) && result === 200) {
      action.resetForm();
      setInitialValues({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        storeName: "",
        storeLocation: "",
        descriptionOfStore: "",
        sellOption: "",
        brands: [],
      })
      setRedirect(true);
    } else {
      setInitialValues(values);
      
      let message = "Something went wrong. Try Again!";
      if (result.length) {
        if (result[0]?.duplicateResult) {

          if (result[0].duplicateResult?.duplicateRule) {
            message = result[0].duplicateResult?.duplicateRule.replaceAll("_", " ")
          } else {
            message = result[0].message;
          }
        } else {
          message = result[0].message;
        }
      }
      setTryAgain(message);
    }
  };
  
  function handleChange(e) {
    let tempFile = []; // Existing files
    let reqfiles = e.target.files; // Newly selected files

    if (reqfiles) {
      Array.from(reqfiles).forEach((file) => {
        let url = URL.createObjectURL(file); // Create a preview URL
        tempFile.push({ preview: url, file });
      });
      // Check if the total number of files exceeds 5
      if (tempFile.length > 5) {
        Swal.fire({
          icon: 'error',
          title: 'Limit Exceeded',
          text: 'You cannot add more than 5 files.',
          confirmButtonColor: '#000',
        }).then(() => {
          e.target.value = ''; // Clear the input
        });
        setFile([]);
        return; // Stop further execution
      }
      setFile(tempFile); // Update state with valid files
      // console.log(`Total files selected: ${tempFile.length}`); // Log the total number of files
    }
  }
  const fileRemoveHandler = (index) => {
    let tempFile = [...files];
    tempFile.splice(index, 1)
    setFile(tempFile);
  }

  useEffect(()=>{},[initialValues])
  if(loading) return <Loading height={"70vh"} />
  return (
    <>
      {redirect ? (
        <ModalPage
          open
          content={
            <>
              <div style={{ maxWidth: "309px" }}>
                <h1 className={`fs-5 ${Styles.ModalHeader}`}>Congratulations</h1>
                <p className={` ${Styles.ModalContent}`}>
                  Your wholesale account application with <b>BFSG</b> has been submitted successfully! We will review your application and notify you of the status shortly. Thank you for choosing <b>BFSG</b>.
                  <br />
                </p>
                <p>Redirecting to Login page...</p>
                {redirect ? redirecting() : null}
                <div className="d-flex justify-content-center"></div>
              </div>
            </>
          }
          onClose={() => setRedirect(false)}
        />
      ) : null}
      {tryAgain ? (
        <ModalPage
          open
          content={
            <>
              <div style={{ maxWidth: "309px" }}>
                <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                <p className={` ${Styles.ModalContent}`}>
                  {tryAgain}
                  <br />
                </p>
                <div className="d-flex justify-content-center">
                  <button className={`${Styles.modalButton}`} onClick={() => setTryAgain(false)}>
                    OK
                  </button>
                </div>
              </div>
            </>
          }
          onClose={() => setTryAgain(false)}
        />
      ) : null}
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={SignUpFormSchema}>
        <section>
          <div className="">
            <div className={style.WholesaleFormMain}>
              <h3 className="mt-4">Apply for a Wholesale Account with BFSG</h3>
              <div className={style.accountCre}>
                <h5>Advantages of Account Creation :</h5>
                <ul style={{ listStyle: "inside" }}>
                  <li>Express Checkout</li>
                  <li>Monitor Your Orders</li>
                  <li>Add favorite items to your wish list</li>
                </ul>
              </div>
              <Form>
                <div className={style.detailFilling}>
                  <div className={style.innerInformation}>
                    <div className={style.SvgLogo}>
                      <COntactName />
                    </div>
                    {/* firstName and lastName */}
                    <div className={style.labelDivMain}>
                      <div className={style.labelIN}>
                        <label htmlFor="firstName">First Name</label>
                        <br />
                        <Field type="text" name="firstName" id="firstName" placeholder="Enter your first name" />
                        <ErrorMessage component={TextError} name="firstName" />
                      </div>

                      <div className={style.labelIN}>
                        <label htmlFor="lastName">Last Name</label>
                        <br />
                        <Field type="text" name="lastName" id="lastName" placeholder="Enter your last name" />
                        <ErrorMessage component={TextError} name="lastName" />
                      </div>
                    </div>
                  </div>
                  {/* email and contact */}
                  <div className={style.innerInformation}>
                    <div className={style.SvgLogo}>
                      <Gmail />
                    </div>
                    <div className={style.labelDivMain}>
                      <div className={style.labelIN}>
                        <label htmlFor="email">Your Email</label>
                        <br />
                        <Field type="email" name="email" id="email" placeholder="Enter your email" />
                        <ErrorMessage component={TextError} name="email" />
                      </div>

                      <div className={style.labelIN}>
                        <label htmlFor="contact">Phone Number</label>
                        <br />
                        <Field type="number" name="contact" id="contact" placeholder="Enter your contact" />
                        <ErrorMessage component={TextError} name="contact" />
                      </div>
                    </div>
                  </div>
                  {/*store Name and storeLocation */}
                  <div className={style.innerInformation}>
                    <div className={style.SvgLogo}>
                      <StoreName />
                    </div>
                    <div className={style.labelDivMain}>
                      <div className={style.labelIN}>
                        <label htmlFor="storeName">Store Name</label>
                        <br />
                        <Field type="text" name="storeName" id="storeName" placeholder="Enter your store name" />
                        <ErrorMessage component={TextError} name="storeName" />
                      </div>

                      <div className={style.labelIN}>
                        <label htmlFor="storeLocation">Store Location</label>
                        <br />
                        <Field type="text" name="storeLocation" id="storeLocation" placeholder="Enter your store location" />
                        <ErrorMessage component={TextError} name="storeLocation" />
                      </div>
                    </div>
                  </div>
                  {/* store description */}
                  <div className={style.innerInformation}>
                    <div className={style.SvgLogo}>
                      <Describe />
                    </div>
                    <div className={style.labelDivMain}>
                      <div className={style.labelIN}>
                        <label htmlFor="descriptionOfStore">Describe your Store</label>
                        <br />
                        <Field type="text" name="descriptionOfStore" id="descriptionOfStore" placeholder="Enter your store description" className="w-95" />
                        <ErrorMessage component={TextError} name="descriptionOfStore" />
                      </div>
                    </div>
                  </div>
                  {/* picture */}
                  <div className={style.innerInformation}>
                    <div className={style.SvgLogo}>
                      <Picture />
                    </div>
                    <div className={style.labelDivMain}>
                      <div className={style.labelIN}>
                        <label htmlFor="images">Picture (Multiple)</label>
                        <br />
                        <input className="w-95" type="file" name="images" id="images" onChange={handleChange} accept="image/*" multiple />
                        <div className={style.imgHolder}>
                          {files.map((file, index) => (
                            <div style={{ position: 'relative' }}>
                              <span style={{ position: 'absolute', right: '5px', top: '-5px', color: '#000', zIndex: 1, cursor: 'pointer', fontSize: '18px' }} onClick={() => { fileRemoveHandler(index) }}>x</span>
                              <a href={file?.preview} target="_blank" title="Click to Download">
                                <img src={file?.preview} key={index} alt={file?.preview} />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* How do you sell to your customers? */}
                  <div className={style.innerInformationRadio}>
                    <div className={`${style.SvgLogo} ${style.SvgLogo1}`} style={{ marginTop: "-1%" }}>
                      <QuestionMark />
                    </div>

                    <div className={style.LabelContro}>
                      <div>
                        <h3>How do you sell to your customers? </h3>
                      </div>

                      <div className={style.radioContro}>
                        <div className="row">
                          <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                            <div className={` ${style.labelDetail} ${style.labelbox} `}>
                              <label htmlFor="Local Ads">
                                <Field type="radio" name="sellOption" value="Local Ads" id="Local Ads" />
                                Local Ads
                              </label>
                            </div>
                          </div>

                          <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                            <div className={` ${style.labelDetail} ${style.labelbox} `}>
                              <label htmlFor="Social Media">
                                <Field type="radio" name="sellOption" value="Social Media" id="Social Media" />
                                Social Media
                              </label>
                            </div>
                          </div>

                          <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                            <div className={` ${style.labelDetail} ${style.labelbox} `}>
                              <label htmlFor="Google">
                                <Field type="radio" name="sellOption" value="Google" id="Google" />
                                Google
                              </label>
                            </div>
                          </div>

                          <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                            <div className={` ${style.labelDetail} ${style.labelbox} `}>
                              <label htmlFor="Walking Customer">
                                <Field type="radio" name="sellOption" value="Walking Customer" id="Walking Customer" />
                                Walking Customer
                              </label>
                            </div>
                          </div>

                          <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                            <div className={` ${style.labelDetail} ${style.labelbox} `}>
                              <label htmlFor="One to One">
                                <Field type="radio" name="sellOption" value="One to One" id="One to One" />
                                One to One
                              </label>
                            </div>
                          </div>

                          <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                            <div className={` ${style.labelDetail} ${style.labelbox} `}>
                              <label htmlFor="Beauty Demoes">
                                <Field type="radio" name="sellOption" value="Beauty Demoes" id="Beauty Demoes" />
                                Beauty Demoes
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Choose Brands to Apply */}
                  <div className={style.innerInformationRadio}>
                    <div className={`${style.SvgLogo} ${style.SvgLogo2}`} style={{ marginTop: "-1%" }}>
                      <ChooseBrand />
                    </div>

                    <div className={style.LabelContro}>
                      <div>
                        <h3>Choose Brands to Apply </h3>
                      </div>

                      <div className={style.radioContro}>
                        <div className="row">
                          {manufacturers.length ? (
                            <>
                              {manufacturers?.map((ele, index) => {
                                return (
                                  <div className="col-lg-4 col-md-4 col-sm-6 col-12" key={index}>
                                    <div className={style.labelDetail}>
                                      <label htmlFor={ele?.Name}>
                                        <Field type="checkbox" name="brands" value={ele?.Name} id={ele?.Name} style={{ height: "16px", width: "16px" }} />
                                        {ele?.Name}
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            <Loading height={"200px"} />
                          )}

                          <ErrorMessage component={TextError} name="brands" />

                          <div className={style.BySigning}>
                            <p>
                              <input type="checkbox" id="termBox" />
                              <label htmlFor="termBox">
                              By signing in or clicking "Apply for an Account", you agree to our Terms of Service. Please also read our Privacy Policy.
                              </label>
                            </p>

                            <button type="submit" className="mt-2">
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </section>
      </Formik>
    </>
  );
}

export default CreateAccountForm;
