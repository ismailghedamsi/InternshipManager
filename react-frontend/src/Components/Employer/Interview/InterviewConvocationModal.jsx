import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {DateTimePicker} from "formik-material-ui-pickers";
import React from "react";
import {useHistory} from "react-router-dom";
import * as yup from "yup";
import AuthenticationService from "../../../Services/AuthenticationService";
import {useApi} from "../../../Services/Hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const requiredFieldMsg = "Ce champs est requis"
export default function InterviewConvocationModal({isOpen, hide, title, application}) {
    const api = useApi()
    const history = useHistory()

    function createInterview(values) {
        let dto = {...values}
        console.log(dto.dateTime)
        dto.employer = AuthenticationService.getCurrentUser()
        dto.reviewState = "PENDING"
        dto.studentApplication = application
        return api.post("/interviews", dto).then(() => history.push("/dashboard/listInterview"))
    }

    return isOpen ? <Dialog open={isOpen} onClose={hide} fullWidth maxWidth={"md"}>
        <DialogTitle id="alert-dialog-title">
            {title} :&ensp;
            {application && application.student ?
                application.student.firstName + " " + application.student.lastName : ""}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description" component={"div"}>
                <Formik
                    onSubmit={createInterview}

                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={yup.object()
                        .shape({
                            dateTime: yup.date().required(requiredFieldMsg).min(new Date(), "La date ne peut pas être dans le passé")
                        })}
                    initialValues={{dateTime: new Date()}}>
                    {({submitForm, isSubmitting}) => <Form>
                        <Grid container
                              justify="center"
                              spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    component={DateTimePicker}
                                    name="dateTime"
                                    variant="outlined"
                                    label="Date et heure de l'entrevue"
                                    required
                                    fullWidth
                                    format="d MMM yyyy HH:mm"
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
                            id="buttonSubmit"
                            type={"submit"}
                            variant="contained"
                            fullWidth
                            size={"large"}
                            color="primary"
                            disabled={isSubmitting}
                            onClick={submitForm}
                        >
                            Convoquer l'étudiant
                        </Button>
                    </Form>}
                </Formik>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={hide} color={"primary"}>
                Annuler
            </Button>
        </DialogActions>
    </Dialog> : null
}