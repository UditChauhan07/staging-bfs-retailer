import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { GetAuthData, getSupportFormRaw, postSupport, supportClear, supportDriveBeg, supportShare } from "../../lib/store";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { OrderStatusSchema } from "../../validation schema/OrderStatusValidation";
import TextError from "../../validation schema/TextError";
const OrderStatusFormSection = () => {
  const navigate = useNavigate();
  const [prioritiesList, setPrioritiesList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [supportTicketData, setTicket] = useState();
  const [activeBtn, setActive] = useState(false);
  useEffect(() => {
    let data = supportDriveBeg();
    console.log({ data });
    setTicket(data);
    GetAuthData()
      .then((user) => {
        let rawData = {
          key: user.x_access_token,
          AccountId: data.orderStatusForm.accountId,
        };
        getSupportFormRaw({ rawData })
          .then((raw) => {
            setPrioritiesList(raw.Priority);
            setContactList(raw.ContactList);
          })
          .catch((error) => {
            console.error({ error });
          });
      })
      .catch((err) => {
        console.error({ err });
      });
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
    temp.orderStatusForm["contactId"] = values.contact;

    supportShare(temp)
      .then((response) => {
        let data = supportDriveBeg();
        setTicket(data);
      })
      .catch((error) => {
        console.error({ error });
      });
    console.log("submitted", supportTicketData);

    GetAuthData()
      .then((user) => {
        supportTicketData.orderStatusForm.salesRepId = user.Sales_Rep__c;
        supportTicketData.key = user.x_access_token;
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
    return;
  };
  const initialValues = {
    description: supportTicketData?.orderStatusForm?.desc,
    contact: "",
  };
  return (
    <Formik initialValues={initialValues} validationSchema={OrderStatusSchema} onSubmit={onSubmitHandler}>
      <div className={styles.container}>
        <Form className={styles.formContainer}>
          <b className={styles.containerTitle}>Order Status : {supportTicketData?.orderStatusForm?.reason}</b>
          {/* <label className={styles.labelHolder}>
            Priority
            <select
              onChange={(e) => {
                onChangeHandler("priority", e.target.value);
              }}
              required
            >
              {prioritiesList.map((priority) => {
                return (
                  <option value={priority.value} selected={priority.value == supportTicketData?.orderStatusForm?.priority}>
                    {priority.name}
                  </option>
                );
              })}
            </select>
          </label> */}
          <label className={styles.labelHolder}>
            Contact Name
            <Field
              component="select"
              name="contact"
            >
              <option val>Select Contact</option>
              {contactList.map((priority) => {
                return (
                  <option value={priority.Id} selected={priority.Id == supportTicketData?.orderStatusForm?.contactId}>
                    {priority.Name}
                  </option>
                );
              })}
            </Field>
          </label>
          <ErrorMessage component={TextError} name="contact" />

          <label className={styles.labelHolder}>
            Describe your issues
            <Field
              component="textarea"
              placeholder="Description"
              rows={4}
              name="description"
              defaultValue={initialValues.description}
            ></Field>
          </label>
          <ErrorMessage component={TextError} name="description" />
          <label>
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
    </Formik>
  );
};
export default OrderStatusFormSection;
