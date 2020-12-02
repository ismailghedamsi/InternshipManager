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

export default function RegisterEmployer(props) {
    const {open} = useContext(ModalContext)
    const validationSchema = yup.object()
        .shape({
            companyName: yup.string().trim().min(5, tooShortError).required(requiredFieldMsg),
            address: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            contactName: yup.string().trim().min(5, tooShortError).max(50, tooLongError).required(requiredFieldMsg),
            phoneNumber: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            email: yup.string().trim().email("L'adresse courriel n'est pas formatée correctement").required(requiredFieldMsg),
            password: yup.string().trim().min(8, tooShortError).required(requiredFieldMsg),
            passwordConfirm: yup.string()
                .oneOf([yup.ref("password"), null], "Les mots de passe doivent être identiques").required(requiredFieldMsg)
        })
    const initialValues = {
        companyName: '',
        contactName: '',
        phoneNumber: '',
        address: '',
        email: '',
        password: '',
        passwordConfirm: '',
    }

    return <Formik
        onSubmit={async (values, {setFieldError}) =>
            AuthenticationService.registerUser("/employers", values, setFieldError, open, props.history)
        }

        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initialValues}
    >
        {({isSubmitting}) => <Form className={props.classes.form}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Field
                        component={TextField}
                        name="companyName"
                        id="companyName"
                        variant="outlined"
                        label="Nom de l'entreprise"
                        required
                        fullWidth
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={TextField}
                        name="address"
                        id="address"
                        variant="outlined"
                        label="Adresse de l'entreprise"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="contactName"
                        id="contactName"
                        variant="outlined"
                        label="Nom du contact"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="phoneNumber"
                        id="phoneNumberEmployer"
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
                        id="emailEmployer"
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
                        id="passwordEmployer"
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
                        id="passwordConfirmEmployer"
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
