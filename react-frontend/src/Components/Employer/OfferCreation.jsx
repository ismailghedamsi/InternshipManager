import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {SimpleFileUpload, TextField} from "formik-material-ui";
import React from "react";
import {useHistory} from 'react-router-dom';
import * as yup from "yup";
import {DatePicker} from 'formik-material-ui-pickers';
import {useApi} from "../Utils/Hooks";
import AuthenticationService from "../../Services/AuthenticationService";
import Button from "@material-ui/core/Button";
import useStyles from "../Utils/useStyles";
import {Typography} from "@material-ui/core";

const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
const tooLittleError = (valueNumber) => "Doit être un nombre plus grand que ou égal à " + valueNumber.min;
const tooBigError = (valueNumber) => "Doit être un nombre plus petit que ou égal à " + valueNumber.max;
const requiredFieldMsg = "Ce champs est requis";

export default function OfferCreation() {
    const classes = useStyles();
    const api = useApi();
    const history = useHistory();
    const validationSchema = yup.object().shape({
        title: yup.string().trim().min(2, tooShortError).required(requiredFieldMsg),
        description: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
        salary: yup.number().min(0, tooLittleError).required(requiredFieldMsg),
        nbStudentToHire: yup.number().min(0, tooLittleError).required(
            requiredFieldMsg),
        limitDateToApply: yup.date().required().when(
            "creationDate",
            (creationDate, schema) => creationDate && schema.min(creationDate,
                "La date de fin doit être dans le futur")),
        internshipStartDate: yup.date().required().min(
            yup.ref("limitDateToApply"),
            "La date de début de stage ne peut pas être avant la date limite pour appliquer "),
        internshipEndDate: yup.date().required().min(
            yup.ref("internshipStartDate"),
            "La date de fin de stage ne peut pas être avant la date de début")
            .when(
                "internshipStartDate",
                (internshipStartDate, schema) => internshipStartDate && schema.min(
                    internshipStartDate,
                    "La date de début doit être avant la date de fin")),
        startTime: yup.number().min(0, tooLittleError).max(23, tooBigError).required(requiredFieldMsg),
        endTime: yup.number().min(0, tooLittleError).max(23, tooBigError).required(requiredFieldMsg)
    });
    const initialValues = {
        title: '',
        description: '',
        salary: '',
        creationDate: new Date(),
        internshipStartDate: new Date("2001-01-01"),
        internshipEndDate: new Date("2001-01-01"),
        nbStudentToHire: '',
        limitDateToApply: new Date("2001-01-01"),
        file: "",
        startTime: '',
        endTime: ''
    }

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        })
    }

    function sendOfferToBackEnd(values) {
        return readFileAsync(values.file).then((base64file) => {
            let dto = {...values};
            dto.file = base64file;
            dto.employer = AuthenticationService.getCurrentUser();

            return api.post("/offers", dto)
        })
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
                        onSubmit={async (values) => sendOfferToBackEnd(values)
                            .then(() => history.push("/dashboard/listoffer"))
                        }

                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        initialValues={initialValues}
                        validate={(values) => {
                            const errors = {};
                            if (values.file.type !== "application/pdf") {
                                errors.file = "Le fichier doit être de type PDF"
                            }
                            if (values.file.length === 0) {
                                errors.file = "Aucun fichier selectionné ou le fichier est vide"
                            }
                            return errors;
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form className={classes.form}>
                                <Grid container
                                      alignItems="start"
                                      justify="center"
                                      spacing={2}>
                                    <Typography variant={"h1"} className={classes.formTitle}>
                                        Nouvelle offre de stage
                                    </Typography>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="title"
                                            id="title"
                                            variant="outlined"
                                            label="Titre"
                                            required
                                            fullWidth
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="description"
                                            id="description"
                                            variant="outlined"
                                            label="Description"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="nbStudentToHire"
                                            id="nbStudentToHire"
                                            variant="outlined"
                                            label="Nombre d'étudiants à embaucher"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 0}}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="salary"
                                            id="salary"
                                            variant="outlined"
                                            label="Salaire"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 0}}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="startTime"
                                            id="startTime"
                                            variant="outlined"
                                            label="Horaire de début"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 0}}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="endTime"
                                            id="endTime"
                                            variant="outlined"
                                            label="Horaire de fin"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 0}}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={DatePicker}
                                            name="internshipStartDate"
                                            id="internshipStartDate"
                                            variant="outlined"
                                            label="Début de stage"
                                            required
                                            fullWidth
                                            format="MM/dd/yyyy"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={DatePicker}
                                            name="internshipEndDate"
                                            id="internshipEndDate"
                                            variant="outlined"
                                            label="Fin de stage"
                                            required
                                            fullWidth
                                            format="MM/dd/yyyy"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={DatePicker}
                                            name="limitDateToApply"
                                            id="limitDateToApply"
                                            variant="outlined"
                                            label="Date limite pour appliquer"
                                            format="MM/dd/yyyy"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={SimpleFileUpload}
                                            type={"file"}
                                            name="file"
                                            id="file"
                                            variant="outlined"
                                            label="Fichier PDF"
                                            fullwidth
                                            required
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
                                    Créer l'offre de stage
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </Grid>
        </Grid>
    )
}
