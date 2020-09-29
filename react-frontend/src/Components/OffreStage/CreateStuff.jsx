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
    },    container: {
        backgroundColor: "#fff",
        borderRadius: theme.spacing(2),
    }
}));

const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
const tooLongError = (value) => "Doit avoir au plus " + value.max + " caractères";
const requiredFieldMsg = "Ce champs est requis";

export default function CreateStuff() {
    const [open, setOpen] = useState(false);
    const classes = useStyles(); 
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
               onSubmit={async (values, {setFieldError}) =>
                   console.log(values)
               }

                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize={true}
                //validationSchema={validationSchema}
                initialValues={initialValues} 
            >
                {({submitForm, isSubmitting}) => (
                    <Form className={classes.form}>
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