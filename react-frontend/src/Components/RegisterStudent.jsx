import {Field, Formik} from 'formik';
import React, {useState} from 'react';
import * as yup from 'yup';
import axios from 'axios'
import Grid from "@material-ui/core/Grid";
import {TextField} from "formik-material-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import {makeStyles} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(1, 0, 2),
    },
}));

const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
const tooLongError = (value) => "Doit avoir au plus " + value.max + " caractères";
const requiredFieldMsg = "Ce champs est requis";

export default function RegisterStudent() {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const validationSchema = yup.object()
        .shape({
            firstName: yup.string().trim().min(2, tooShortError).required(requiredFieldMsg),
            address: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            lastName: yup.string().trim().min(2, tooShortError).max(30, tooLongError).required(requiredFieldMsg),
            studentId: yup.string().trim().min(7, tooShortError).max(7, tooLongError).required(requiredFieldMsg),
            phoneNumber: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            username: yup.string().trim().min(5, tooShortError).max(30, tooLongError).required(requiredFieldMsg),
            email: yup.string().trim().email().required(requiredFieldMsg),
            password: yup.string().trim().min(8, tooShortError).required(requiredFieldMsg),
            passwordConfirm: yup.string()
                .oneOf([yup.ref('password'), null], "Les mots de passes doivent êtres identiques").required(requiredFieldMsg),
        })
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        passwordConfirm: "",
        studentId: "",
        phoneNumber: "",
        address: "",
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Erreur réseau"}</DialogTitle>
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
                onSubmit={async (values) => {
                    delete values.passwordConfirm;
                    return axios.post(`http://localhost:8080/students`, values)
                        .catch((error) => {
                            setOpen(true)
                            console.error(error)
                        })
                }}

                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize={true}
                validationSchema={validationSchema}
                initialValues={initialValues}
            >
                {({submitForm, isSubmitting}) => (
                    <form className={classes.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    name="firstName"
                                    id="firstName"
                                    variant="outlined"
                                    label="Prénom"
                                    required
                                    fullWidth
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    name="lastName"
                                    id="lastName"
                                    variant="outlined"
                                    label="Nom de famille"
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="address"
                                    id="address"
                                    variant="outlined"
                                    label="Addresse"
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    name="studentId"
                                    id="studentId"
                                    variant="outlined"
                                    label="Numéro d'étudiant"
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    variant="outlined"
                                    label="Numéro de téléphone"
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    name="username"
                                    id="username"
                                    variant="outlined"
                                    label="Nom d'utilisateur"
                                    required
                                    fullWidth
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
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    name="password"
                                    id="password"
                                    variant="outlined"
                                    label="Mot de passe"
                                    type={"password"}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    name="passwordConfirm"
                                    id="passwordConfirm"
                                    variant="outlined"
                                    label="Confirmez"
                                    type={"password"}
                                    required
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <br/>
                        {isSubmitting && <LinearProgress/>}
                        <Button
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
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Vous avez déja un compte? Se connecter
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </div>
    );
}