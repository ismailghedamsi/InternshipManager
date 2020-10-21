import {DatePicker} from "@material-ui/pickers";
import {ErrorMessage, Field, Form, Formik} from "formik";
import React from "react";
import * as yup from "yup";
import {useStyles} from "../Utils/useStyles";

const {Grid, Container, TextField, LinearProgress, Button} = require("@material-ui/core");


export default function InterviewForm(props) {
    const classes = useStyles();
    const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
    const tooLittleError = (valueNumber) => "Doit être un nombre plus grand que ou égal à " + valueNumber.min;
    const requiredFieldMsg = "Ce champs est requis";

    const validationSchema = yup.object().shape({
        studentName: yup.string().trim().min(2, tooShortError).required(requiredFieldMsg),
        interviewDate: yup.date().required(),
        email: yup.string().trim().email("L'email n'a pas un format valide").required(requiredFieldMsg),
    });

    const initialValues = {
        studentName: '',
        interviewDate: new Date(),
        email: ''
    }

    return (
        <Grid item xs={12} sm={7} lg={5}>
            <Container component="main" maxWidth="sm" className={classes.container}>
                <Formik
                    // onSubmit={async (values) => createInterview(values)
                    // }

                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    initialValues={initialValues}
                    validate={(values) => {
                        const errors = {};
                    }}
                >
                    {({isSubmitting, setFieldValue}) => (
                        <Form className={classes.form}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="studentName"
                                        id="studentName"
                                        variant="outlined"
                                        label="Nom de l'étudiant"
                                        required
                                        fullWidth
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        component={DatePicker}
                                        name="interviewDate"
                                        variant="outlined"
                                        label="Date et heure de l'entrevue "
                                        required
                                        fullWidth
                                        format="MM/dd/yyyy"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="email"
                                        id="email"
                                        variant="outlined"
                                        label="Addresse courriel"
                                        type={"email"}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <ErrorMessage name={"file"}>
                                    {msg => <p id="msgError"><span style={{color: "red"}}>{msg}</span>
                                    </p>}
                                </ErrorMessage>
                            </Grid>
                            <br/>
                            {isSubmitting && <LinearProgress/>}
                            <Button
                                type={"submit"}
                                fullWidth
                                variant="contained"
                                color="primary"
                                size={"large"}
                                className={classes.submit}
                                disabled={isSubmitting}
                            >
                                Convoquer l'étudiant
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Container>
        </Grid>
    )
}

