import { ErrorMessage, Field, Form, Formik } from "formik";
import TextError from "../../validation schema/TextError";
import Select from "react-select";
import styles from "../OrderStatusFormSection/style.module.css";
import { AccountInfoValidation } from "../../validation schema/AccountInfoValidation";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const AccountInfo = ({ reason, Accounts, postSupportAny, GetAuthData }) => {
    const navigate = useNavigate();

    const initialValues = {
        description: "",
        account: null
    };
    const SearchableSelect = (FieldProps) => {
        return (
            <Select
                type="text"
                options={FieldProps.options}
                {...FieldProps.field}
                onChange={(option) => {
                    console.log(option, FieldProps);
                    FieldProps.form.setFieldValue(FieldProps.field.name, option);
                }}
                value={FieldProps.options ? FieldProps.options.find((option) => option.value === FieldProps.field.value?.value) : ""}
            />
        );
    };
    const onSubmitHandler = (values) => {
        let subject = `Customer Service for ${reason}`;
        GetAuthData()
            .then((user) => {
                if (user) {
                    let rawData = {
                        orderStatusForm: {
                            typeId: "0123b0000007z9pAAA",
                            reason: reason,
                            salesRepId: user.Sales_Rep__c,
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
                                    navigate("/CustomerSupportDetails?id=" + response);
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