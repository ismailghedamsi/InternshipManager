import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React, { useContext } from "react";
import * as yup from "yup";
import { ModalContext } from "../App";
import AuthenticationService from "../Services/AuthenticationService";

const tooShortError = value => "Doit avoir au moins " + value.min + " caractères"
const tooLongError = value => "Doit avoir au plus " + value.max + " caractères"
const requiredFieldMsg = "Ce champ est requis"

export default function RegisterStudent(props) {
    const {open} = useContext(ModalContext)
    const validationSchema = yup.object()
        .shape({
            firstName: yup.string().trim().min(2, tooShortError).required(requiredFieldMsg),
            address: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            lastName: yup.string().trim().min(2, tooShortError).max(30, tooLongError).required(requiredFieldMsg),
            studentId: yup.string().trim().min(7, tooShortError).max(7, tooLongError).required(requiredFieldMsg),
            phoneNumber: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            email: yup.string().trim().email("L'adresse courriel n'est pas formatée correctement").required(requiredFieldMsg),
            password: yup.string().trim().min(8, tooShortError).required(requiredFieldMsg),
            passwordConfirm: yup.string()
                .oneOf([yup.ref('password'), null], "Les mots de passe doivent être identiques").required(requiredFieldMsg),
        })
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
        studentId: "",
        phoneNumber: "",
        address: "",
    }

    return <Formik
        onSubmit={async (values, {setFieldError}) =>
            AuthenticationService.registerUser("/students", values, setFieldError, open, props.history)
        }

        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initialValues}
    >
        {({isSubmitting}) => <Form className={props.classes.form}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="firstName"
                        id="firstNameStudent"
                        variant="outlined"
                        label="Prénom"
                        required
                        fullWidth
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="lastName"
                        id="lastNameStudent"
                        variant="outlined"
                        label="Nom de famille"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={TextField}
                        name="address"
                        id="addressStudent"
                        variant="outlined"
                        label="Adresse"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="studentId"
                        id="studentIdStudent"
                        variant="outlined"
                        label="Matricule d'étudiant"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="phoneNumber"
                        id="phoneNumberStudent"
                        variant="outlined"
                        label="Numéro de téléphone"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={TextField}
                        name="email"
                        id="emailStudent"
                        variant="outlined"
                        label="Adresse courriel"
                        type={"email"}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="password"
                        id="passwordStudent"
                        variant="outlined"
                        label="Mot de passe"
                        type={"password"}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="passwordConfirm"
                        id="passwordConfirmStudent"
                        variant="outlined"
                        label="Confirmation"
                        type={"password"}
                        required
                        fullWidth
                    />
                </Grid>
            </Grid>
            <br/>
            {isSubmitting && <LinearProgress/>}
            <Button
                type={"submit"}
                fullWidth
                variant="contained"
                color="primary"
                size={"large"}
                className={props.classes.submit}
                disabled={isSubmitting}
            >
                S'inscrire
            </Button>
        </Form>}
    </Formik>
}
