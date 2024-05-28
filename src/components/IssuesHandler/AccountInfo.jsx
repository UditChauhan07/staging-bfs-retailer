import { ErrorMessage, Field, Form, Formik } from "formik";
import TextError from "../../validation schema/TextError";
import Select from "react-select";
import styles from "../OrderStatusFormSection/style.module.css";
import { AccountInfoValidation } from "../../validation schema/AccountInfoValidation";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { uploadFileSupport } from "../../lib/store";
import Loading from "../Loading";
import { BiUpload } from "react-icons/bi";
const AccountInfo = ({ reason, Accounts, postSupportAny, GetAuthData, dSalesRepId,setSubmitForm }) => {
    const navigate = useNavigate();

    const initialValues = {
        description: "",
        account: null
    };
    let [files, setFile] = useState([])
    function handleChange(e) {
        let tempFile = [];
        let reqfiles = e.target.files;
        if (reqfiles) {
            if (reqfiles.length > 0) {
                Object.keys(reqfiles).map((index) => {
                    let url = URL.createObjectURL(reqfiles[index])
                    if (url) {
                        tempFile.push({ preview: url, file: reqfiles[index] });
                    }
                    // this thoughing me Failed to execute 'createObjectURL' on 'URL': Overload resolution failed?
                })
            }
        }
        setFile(tempFile);
    }
    const onSubmitHandler = (values) => {
        setSubmitForm(true)
        let subject = `Customer Service for ${reason}`;
        GetAuthData()
            .then((user) => {
                if (user) {
                    let rawData = {
                        orderStatusForm: {
                            typeId: "0123b0000007z9pAAA",
                            reason: reason,
                            contactId: user.data.retailerId,
                            salesRepId: dSalesRepId,
                            accountId: user.data.accountId,
                            desc: values.description,
                            priority: "Medium",
                            subject,
                        },
                        key: user.data.x_access_token,
                    };
                    postSupportAny({ rawData })
                        .then((response) => {
                            if (response) {
                                if (response) {
                                    if (files.length > 0) {
                                        uploadFileSupport({ key: user?.data?.x_access_token, supportId: response, files }).then((fileUploader) => {
                                            if (fileUploader) {
                                                setSubmitForm(false)
                                                navigate("/CustomerSupportDetails?id=" + response);
                                            }
                                        }).catch((fileErr) => {
                                            setSubmitForm(false)
                                            console.log({ fileErr });
                                        })
                                    } else {
                                        setSubmitForm(false)
                                        navigate("/CustomerSupportDetails?id=" + response);
                                    }
                                }
                            }
                        })
                        .catch((err) => {
                            console.error({ err });
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <Formik initialValues={initialValues} validationSchema={AccountInfoValidation} onSubmit={onSubmitHandler}>
            {(formProps) => (
                <div className={styles.container}>
                    <Form className={styles.formContainer}>
                        <b className={styles.containerTitle}>Customer Service : {reason}</b>
                        <label className={styles.labelHolder}>
                            Describe your details that want to update
                            <Field component="textarea" placeholder="Description" rows={4} name="description" defaultValue={initialValues.description}></Field>
                        </label>
                        <ErrorMessage component={TextError} name="description" />
                        <div className={styles.attachHolder}>
                            <p className={styles.subTitle}>upload some Attachements</p>
                            <label className={styles.attachLabel} for="attachement"><div><div className={styles.attachLabelDiv}><BiUpload /></div></div></label>
                            <input type="file" style={{ width: 0, height: 0 }} id="attachement" onChange={handleChange} multiple accept="image/*" />
                            <div className={styles.imgHolder}>
                                {files.map((file, index) => (
                                    <a href={file?.preview} target="_blank" title="Click to Download">
                                        <img src={file?.preview} key={index} alt={file?.preview} />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className={styles.dFlex}>
                            {" "}
                            <Link to={"/customer-support"} className={styles.btn}>
                                Cancel
                            </Link>
                            <input type="submit" className={styles.btn} value={"Submit"} />
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
}
export default AccountInfo