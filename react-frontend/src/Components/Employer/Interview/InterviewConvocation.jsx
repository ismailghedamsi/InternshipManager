import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from 'react-router-dom';
import * as yup from "yup";
import {DateTimePicker} from 'formik-material-ui-pickers';
import {useApi} from "../../Utils/Hooks";
import Button from "@material-ui/core/Button";
import useStyles from "../../Utils/useStyles";
import AuthenticationService from '../../../Services/AuthenticationService';
import {Typography} from '@material-ui/core';

const requiredFieldMsg = "Ce champs est requis";

export default function InterviewConvocation() {
    const classes = useStyles();
    const api = useApi();
    const location = useLocation();
    const history = useHistory();
    const [applicationInterview, setApplicationInterview] = useState({});

    useEffect(() => {
        setApplicationInterview(location.state)
    }, [location.state])

    function createInterview(values) {
        let dto = {...values};
        dto.date = values.interviewDate
        dto.employer = AuthenticationService.getCurrentUser()
        dto.reviewState = "PENDING"
        dto.studentApplication = applicationInterview
        return api.post("/interviews", dto).then(() => history.push("/dashboard/listInterview"))
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '100%'}}
        >
            <Grid item xs={12} sm={7} lg={5}>
                <Container component="main" maxWidth="sm" className={classes.container}>
                    <Formik
                        onSubmit={async (values) => createInterview(values)}
                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={yup.object().shape({
                            interviewDate: yup.date().required(requiredFieldMsg).min(new Date(), "La date ne peut pas être dans le passé")
                        })}
                        initialValues={{
                            interviewDate: new Date()
                        }}>
                        {({isSubmitting}) => (
                            <Form className={classes.form}>
                                <Typography variant={"h4"} display={"block"} style={{paddingTop: 15, marginBottom: 15}}>
                                    Étudiant à rencontrer :&ensp;
                                    {applicationInterview && applicationInterview.student ?
                                        applicationInterview.student.firstName + " " + applicationInterview.student.lastName : ""}
                                </Typography>
                                <Grid container
                                      alignItems="start"
                                      justify="center"
                                      spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={DateTimePicker}
                                            name="interviewDate"
                                            variant="outlined"
                                            label="Date et heure de l'entrevue"
                                            required
                                            fullWidth
                                            format="MM/dd/yyyy hh:mm"
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
