import Button from "@material-ui/core/Button";
import Container from '@material-ui/core/Container';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {makeStyles} from '@material-ui/core/styles';
import {ErrorMessage, Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import React, {useState} from "react";
import * as yup from "yup";
import InternshipOfferService from '../../js/IntershipOfferService.js';

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(1, 0, 1),
    }, container: {
        backgroundColor: "#fff",
        borderRadius: theme.spacing(2),
    }
}));

const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
const tooLittleError = (valueNumber) => "Doit avoir au moins un chiffre plus grand que ou égal que " + valueNumber.min;
const tooBigError = (valueNumber) => "Doit avoir au moins plus petit que " + valueNumber.max;
const requiredFieldMsg = "Ce champs est requis";

export default function CreateStuff(props) {

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const classes = useStyles();
    const validationSchema = yup.object().shape({
        title: yup.string().trim().min(2, tooShortError).required(requiredFieldMsg),
        description: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
        nbOfWeeks: yup.number().min(1, tooLittleError).required(requiredFieldMsg),
        salary: yup.number().min(0, tooLittleError).required(requiredFieldMsg),
        beginHour: yup.number().min(0, tooLittleError).max(23, tooBigError).required(requiredFieldMsg),
        endHour: yup.number().required(requiredFieldMsg).when("beginHour", (begin) => yup.mixed()
            .test({
                name: 'includeZero',
                test: (end) => end > begin || end === 0,
                message: "L'heure de fin doit être plus grande que celle de début"
            })),
        limitDateToApply: yup.date().required().when(
            "creationDate",
            (creationDate, schema) => creationDate && schema.min(creationDate, "La date de fin doit être dans le futur")),
    });
    const initialValues = {
        title: '',
        description: '',
        nbOfWeeks: '',
        salary: '',
        beginHour: '',
        endHour: '',
        creationDate: new Date(),
        limitDateToApply: '',
        file: ""
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
            <Grid item xs={3}>
                <Container component="main" maxWidth="sm" className={classes.container}>
                    <Dialog open={errorModalOpen} onClose={() => {
                        setErrorModalOpen(false);
                    }}>
                        <DialogTitle id="alert-dialog-title">Erreur réseau</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Erreur réseau: impossible de communiquer avec le serveur
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                setErrorModalOpen(false);
                            }} color="primary">
                                J'ai compris
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Formik
                        onSubmit={
                            async (values) => {
                                InternshipOfferService.sendOfferToBackEnd(values).then((e) => {
                                    props.history.push("/dashboard/listoffer")
                                }).catch(() => setErrorModalOpen(true))
                            }
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
                        {({submitForm, isSubmitting, setFieldValue}) => (
                            <Form className={classes.form}>
                                <Grid container spacing={2}>
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
                                            name="nbOfWeeks"
                                            id="nbOfWeeks"
                                            variant="outlined"
                                            label="Nombre de semaine"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 1}}}
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
                                            name="beginHour"
                                            id="beginHour"
                                            variant="outlined"
                                            label="Heure de début"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 0, max: 23}}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="endHour"
                                            id="endHour"
                                            variant="outlined"
                                            label="Heure de fin"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 0, max: 23}}}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="limitDateToApply"
                                            id="limitDateToApply"
                                            variant="outlined"
                                            label="Date limite pour appliquer"
                                            required
                                            fullWidth
                                            type={"date"}
                                        />
                                    </Grid>
                                    <input
                                        name="file"
                                        id="file"
                                        accept="application/pdf"
                                        type="file"
                                        className="file"
                                        onChange={(e) => {
                                            const {target} = e
                                            if (target.value.length > 0) {
                                                setFieldValue("file", e.currentTarget.files[0])
                                            }
                                        }}
                                    />
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
                                    S'enregistrer
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </Grid>
        </Grid>
    )
}