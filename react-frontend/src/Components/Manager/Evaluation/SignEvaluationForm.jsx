import React from 'react';
import useStyles from "../../Utils/useStyles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import {TextField} from "formik-material-ui";
import {DatePicker} from "formik-material-ui-pickers";

const tooShortError = value => "Doit avoir au moins " + value.min + " caractères";
export default function SignEvaluationForm() {
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
                            signature: yup.string().trim().min(2, "Doit avoir au moins 2 caractères").required("Ce champs est requis")
                        })}
                    initialValues={{
                        signature: "",
                        signedDate: new Date()
                    }}
                >
                    {({isSubmitting}) =>
                        <Form className={classes.form}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="signature"
                                        id="signature"
                                        variant="outlined"
                                        label="Signature"
                                        fullWidth
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        component={DatePicker}
                                        name="signedDate"
                                        id="signedDate"
                                        variant="outlined"
                                        label="Date"
                                        required
                                        fullWidth
                                        format="MM/dd/yyyy"
                                    />
                                </Grid>
                            </Grid>
                        </Form>}
                </Formik>
            </Container>
        </Grid>
    </Grid>
}