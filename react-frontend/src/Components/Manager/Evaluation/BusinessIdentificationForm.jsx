import React from 'react';
import useStyles from "../../Utils/useStyles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import {TextField} from "formik-material-ui";

const tooShortError = value => "Doit avoir au moins " + value.min + " caractères";
const tooLongError = value => "Doit avoir moins que " + value.max + " caractères";
const requiredFieldMsg = "Ce champs est requis";
export default function BusinessIdentificationForm() {
    const classes = useStyles();

    return <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
    >
        <Grid item xs={12} sm={7} lg={5}>
            <Container component="main" maxWidth="sm" className={classes.container}>
                <Formik
                    onSubmit={async values => {

                    }}
                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={yup.object()
                        .shape({
                            companyName: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
                            employerName: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
                            address: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
                            phone: yup.string().trim().min(10, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
                            city: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
                            fax: yup.string().trim().min(10, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
                            postalCode: yup.string().trim().min(6, tooShortError).max(255, tooLongError).required(requiredFieldMsg)
                        })}
                    initialValues={{
                        companyName: "",
                        employerName: "",
                        address: "",
                        phone: "",
                        city: "",
                        fax: "",
                        postalCode: ""
                    }}
                >
                    {({isSubmitting}) =>
                        <Form className={classes.form}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="companyName"
                                        id="companyName"
                                        variant="outlined"
                                        label="Nom de l’entreprise"
                                        required
                                        fullWidth
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="employerName"
                                        id="employerName"
                                        variant="outlined"
                                        label="Personne contact"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="address"
                                        id="address"
                                        variant="outlined"
                                        label="Adresse"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="phone"
                                        id="phone"
                                        variant="outlined"
                                        label="Téléphone"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="city"
                                        id="city"
                                        variant="outlined"
                                        label="Ville"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="fax"
                                        id="fax"
                                        variant="outlined"
                                        label="Télécopieur"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="postalCode"
                                        id="postalCode"
                                        variant="outlined"
                                        label="Code postal"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Form>}
                </Formik>
            </Container>
        </Grid>
    </Grid>
}