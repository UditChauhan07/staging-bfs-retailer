import * as Yup from "yup";

export const LoginFormSchema = Yup.object().shape({
    email:Yup.string().required("Please enter your email.").min(5, "Please Enter the valid username.").max(20,"Use 20 characters or fewer for your password"),
    password:Yup.string().required("Please enter your password.").min(5, "please Enter the valid password.").max(20,"Use 20 characters or fewer for your password"),
})