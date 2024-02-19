import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { GetAuthData, getSupportFormRaw, postSupport, supportClear, supportDriveBeg, supportShare } from "../../lib/store";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { OrderStatusSchema } from "../../validation schema/OrderStatusValidation";
import TextError from "../../validation schema/TextError";
import Select from "react-select";

const OrderStatusFormSection = () => {
  const navigate = useNavigate();
  const [supportTicketData, setTicket] = useState();
  const [activeBtn, setActive] = useState(false);

  useEffect(() => {
    let data = supportDriveBeg();
    console.log({data});
    setTicket(data);
  }, []);

  const onChangeHandler = (key, value) => {
    let temp = supportTicketData;
    temp.orderStatusForm[key] = value;

    supportShare(temp)
      .then((response) => {
        let data = supportDriveBeg();
        setTicket(data);
      })
      .catch((error) => {
        console.error({ error });
      });
  };
  const onSubmitHandler = (values) => {
    setActive(true);
    let temp = supportTicketData;
    temp.orderStatusForm["desc"] = values.description;
    supportShare(temp)
      .then((response) => {
        let data = supportDriveBeg();
        setTicket(data);
    console.log("submitted", supportTicketData);

    GetAuthData()
      .then((user) => {
        supportTicketData.key = user?.data?.x_access_token;
        postSupport({ rawData: supportTicketData })
          .then((response) => {
            let flush = supportClear();
            if (response) {
              navigate("/CustomerSupportDetails?id=" + response);
            }
          })
          .catch((err) => {
            console.error({ err });
          });
      })
      .catch((error) => {
        console.error({ error });
      });
    })
    .catch((error) => {
      console.error({ error });
    });
    return;
  };
  const initialValues = {
    description: supportTicketData?.orderStatusForm?.desc || ""
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
  return (
    <Formik initialValues={initialValues} validationSchema={OrderStatusSchema} onSubmit={onSubmitHandler}>
      {(formProps) => (
        <div className={styles.container}>
          <Form className={styles.formContainer}>
            <b className={styles.containerTitle}>Order Status : {supportTicketData?.orderStatusForm?.reason}</b>
            <label className={styles.labelHolder}>
              Describe your issues
              <Field component="textarea" placeholder="Description" rows={4} name="description" defaultValue={initialValues.description}></Field>
            </label>
            <ErrorMessage component={TextError} name="description" />
            <label className="mt-2">
              <input
                type="checkbox"
                checked={supportTicketData?.orderStatusForm?.sendEmail}
                onChange={(e) => {
                  onChangeHandler("sendEmail", e.target.checked);
                }}
              />
              &nbsp;Send Updates via email
            </label>
            <div className={styles.dFlex}>
              {" "}
              <Link to={"/order-list"} className={styles.btn}>
                Cancel
              </Link>
              <input type="submit" className={styles.btn} value={"Submit"} disabled={activeBtn} />
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};
export default OrderStatusFormSection;
