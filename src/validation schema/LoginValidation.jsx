import * as Yup from "yup";

export const LoginFormSchema = Yup.object().shape({
    email:Yup.string().required("Please enter your email.").min(5, "Use 5 characters or more for your password.").max(20,"Use 20 characters or fewer for your password"),
    password:Yup.string().required("Please enter your password.").min(5, "Use 5 characters or more for your password.").max(20,"Use 20 characters or fewer for your password"),
})