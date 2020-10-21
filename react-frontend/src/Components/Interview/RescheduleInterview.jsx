import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import {DateTimePicker} from 'formik-material-ui-pickers';
import Button from "@material-ui/core/Button";
import {makeStyles} from '@material-ui/core';
import {useApi} from '../Utils/Hooks';
import * as yup from 'yup';


export function Rescheduleinterview(props) {
    const location = useLocation()
    const history = useHistory()
    const api = useApi()
    const [interview, setInterview] = useState({});

    const useStyles = makeStyles(() => ({
        root: {
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
        },
        container: {
            flex: 1,
            height: "90vh",
            overflow: "hidden"
        },
        viewbox: {
            height: "90vh",
            overflow: "auto",
            backgroundColor: "#fff",
        }
    }));

    const classes = useStyles()

    useEffect(() => {
        setInterview(location.state)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const initialValues = {
        studentFirstName: location.state.studentApplication.student.firstName,
        studentLastName: location.state.studentApplication.student.lastName,
        interviewDate: location.state.date,
        email: location.state.studentApplication.student.email
    }

    function updateInterview(values) {
        const nextState = {...interview};
        nextState.date = values.interviewDate;
        setInterview(nextState)
        api.put("/interviews/" + nextState.id, nextState)
            .then(() => history.push("/dashboard/listInterview"))
    }

    const validationSchema = yup.object().shape({
        interviewDate: yup.date().required().min(new Date(), "La date ne peut pas etre dans le passé")
    });

    return (
        <Grid
            className={classes.viewbox}
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
                            updateInterview(values)
                        }
                        }
                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        initialValues={initialValues}
                    >
                        {({isSubmitting}) => (
                            <Form className={classes.form}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="studentFirstName"
                                            id="studentFirstName"
                                            variant="outlined"
                                            label="Nom de l'étudiant"
                                            required
                                            fullWidth
                                            autoFocus
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="studentLastName"
                                            id="studentLastName"
                                            variant="outlined"
                                            label="Prenom de l'étudiant"
                                            disabled
                                            required
                                            fullWidth
                                            autoFocus
                                        />
                                    </Grid>
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
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="email"
                                            id="email"
                                            variant="outlined"
                                            label="Addresse courriel"
                                            type={"email"}
                                            disabled
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
                                    Reprogrammer l'entrevue
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </Grid>
        </Grid>
    )
}
