import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import {Field, Formik} from "formik";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import {TextField} from "formik-material-ui";
import axios from 'axios'
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
const tooLongError = (value) => "Doit avoir au plus " + value.max + " caractères";
const requiredFieldMsg = "Ce champs est requis";

export default function RegisterEmployer(props) {
    const [open, setOpen] = useState(false);
    const validationSchema = yup.object()
        .shape({
            companyName: yup.string().trim().min(5, tooShortError).required(requiredFieldMsg),
            address: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            contactName: yup.string().trim().min(5, tooShortError).max(50, tooLongError).required(requiredFieldMsg),
            phoneNumber: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            username: yup.string().trim().min(5, tooShortError).max(30, tooLongError).required(requiredFieldMsg),
            email: yup.string().trim().email().required(requiredFieldMsg),
            password: yup.string().trim().min(8, tooShortError).required(requiredFieldMsg),
            passwordConfirm: yup.string()
                .oneOf([yup.ref('password'), null], "Les mots de passes doivent êtres identiques").required(requiredFieldMsg),
        });
    const initialValues = {
        companyName: '',
        contactName: '',
        phoneNumber: '',
        address: '',
        email: '',
        username: '',
        password: '',
        passwordConfirm: '',
    }
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
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
                onSubmit={async (values, {setFieldError}) => {
                    delete values.passwordConfirm;
                    return axios.post(`http://localhost/employers`, values)
                        .then(() => {
                            props.history.push("/login")
                        })
                        .catch((error) => {
                            console.error(error)
                            if (error.response) {
                                if (error.response.status === 409) {
                                    setFieldError("username", "Le nom d'utilisateur n'est pas disponible")
                                } else
                                    setOpen(true)
                            } else {
                                setOpen(true)
                            }
                        })
                }}

                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize={true}
                validationSchema={validationSchema}
                initialValues={initialValues}
            >
                {({submitForm, isSubmitting}) => (
                    <form className={props.classes.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="companyName"
                                    id="companyName"
                                    variant="outlined"
                                    label="Nom de la compagnie"
                                    required
                                    fullWidth
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="address"
                                    id="address"
                                    variant="outlined"
                                    label="Addresse de la compagnie"
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    name="contactName"
                                    id="contactName"
                                    variant="outlined"
                                    label="Nom du contact"
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
                            type={"submit"}
                            fullWidth
                            variant="contained"
                            color="primary"
                            size={"large"}
                            className={props.classes.submit}
                            disabled={isSubmitting}
                            onClick={submitForm}
                        >
                            S'enregistrer
                        </Button>
                    </form>
                )}
            </Formik>
        </div>
    )
        ;
}