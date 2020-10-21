import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from 'react-router-dom';
import * as yup from "yup";
import {DateTimePicker} from 'formik-material-ui-pickers';
import {useApi} from "../Utils/Hooks";
import Button from "@material-ui/core/Button";
import {useStyles} from "../Utils/useStyles";
import AuthenticationService from '../../Services/AuthenticationService';
import {Typography} from '@material-ui/core';

const requiredFieldMsg = "Ce champs est requis";

export default function InterviewConvocation() {
    const classes = useStyles();
    const api = useApi();
    const location = useLocation();
    const history = useHistory();
    const [applicationInterview, setApplicationInterview] = useState("")
    const [applications, setApplications] = useState([{}]);
    useEffect(() => {
        setApplicationInterview(location.state)
        api.get("/applications").then((r) => setApplications(r.data))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const validationSchema = yup.object().shape({
        interviewDate: yup.date().required().min(new Date(), "La date ne peut pas etre dans le passé")
    });
    const initialValues = {
        interviewDate: new Date()
    }

    function createInterview(values) {
        let dto = {...values};
        dto.date = values.interviewDate
        dto.employer = AuthenticationService.getCurrentUser()
        dto.reviewState = "PENDING"
        dto.studentApplication = applicationInterview
        api.post("/interviews", dto).then(() => history.push("/dashboard/listInterview"))
    }

    return (

        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '100vh'}}
        >
            <Grid item xs={12} sm={7} lg={5}>
                <Container component="main" maxWidth="sm" className={classes.container}>
                    <Formik
                        onSubmit={async (values) => {
                            createInterview(values)
                        }
                        }
                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        initialValues={initialValues}
                        validate={(values) => {
                            const errors = {};
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form className={classes.form}>
                                <Grid>
                                    <Typography> Étudiant à
                                        entrevoir {applicationInterview ? applicationInterview.student.firstName + " " + applicationInterview.student.lastName : ""}</Typography>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={DateTimePicker}
                                            name="interviewDate"
                                            variant="outlined"
                                            label="Date et heure de l'entrevue "
                                            required
                                            fullWidth
                                            format="MM/dd/yyyy"
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
        </Grid>
    )
}
