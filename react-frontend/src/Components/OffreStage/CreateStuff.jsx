import Button from "@material-ui/core/Button";
import Container from '@material-ui/core/Container';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from '@material-ui/core/styles';
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React, { useState } from "react";
import * as yup from "yup";

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
const tooLongError = (value) => "Doit avoir au plus " + value.max + " caractères";
const tooLittleError = (valueNumber) => "Doit avoir au moins un chiffre plus grand que ou égal que " + valueNumber.min;
const tooBigError = (valueNumber) => "Doit avoir au moins plus petit que " + valueNumber.max;
const requiredFieldMsg = "Ce champs est requis";

export default function CreateStuff() {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const validationSchema = yup.object()
        .shape({
            title: yup.string().trim().min(2, tooShortError).required(requiredFieldMsg),
            description: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            companyName: yup.string().trim().min(5, tooShortError).required(requiredFieldMsg),
            nbOfWeeks: yup.number().min(5,tooLittleError).required(requiredFieldMsg),
            salary: yup.number().min(0,tooLittleError).required(requiredFieldMsg),
            beginHour: yup.number().min(0,tooLittleError).required(requiredFieldMsg),
            endHour: yup.number().max(24,tooBigError).required(requiredFieldMsg),
            companyLocation: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            creationDate: yup.date().required(),
            limitDateToApply: yup.date().required(),
        });
    const initialValues = {
        title: '',
        description: '',
        companyName: '',
        nbOfWeeks: '',
        salary: '',
        beginHour: '',
        endHour: '',
        companyLocation: '',
        creationDate: '',
        limitDateToApply: '',
        joinedFile: '',
    }
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item xs={3}>
                <Container component="main" maxWidth="sm" className={classes.container}>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle id="alert-dialog-title">Erreur réseau</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Erreur réseau: impossible de communiquer avec le serveur
                    </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                J'ai compris
                    </Button>
                        </DialogActions>
                    </Dialog>
                    <Formik
                        onSubmit={async (values, { setFieldError }) =>
                            console.log(values)
                        }

                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        initialValues={initialValues}
                    >
                        {({ submitForm, isSubmitting }) => (
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
                                            name="companyName"
                                            id="companyName"
                                            variant="outlined"
                                            label="Nom de company"
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="beginHour"
                                            id="beginHour"
                                            variant="outlined"
                                            label="Heure du debut"
                                            required
                                            fullWidth
                                            type={"number"}
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="companyLocation"
                                            id="companyLocation"
                                            variant="outlined"
                                            label="Location de la company"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="creationDate"
                                            id="creationDate"
                                            variant="outlined"
                                            label="Date de creation d'offre"
                                            required
                                            fullWidth
                                            type={"date"}
                                            
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="limitDateToApply"
                                            id="limitDateToApply"
                                            variant="outlined"
                                            label="limit de date pour appliquer"
                                            required
                                            fullWidth
                                            type={"date"}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="joinedFile"
                                            id="joinedFile"
                                            variant="outlined"
                                            label="Fichier"
                                            required
                                            fullWidth
                                            
                                        />
                                    </Grid>
                                </Grid>
                                <br />
                                {isSubmitting && <LinearProgress />}
                                <Button
                                    type={"submit"}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size={"large"}
                                    className={classes.submit}
                                    disabled={isSubmitting}
                                    onClick={submitForm}

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
        ;
}