import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import AuthenticationService from "../js/AuthenticationService";
import {Link as RouterLink, Redirect, useHistory, useLocation} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {Field, Formik} from "formik";
import * as yup from "yup";
import {TextField} from "formik-material-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(1, 0, 2),
    },
    logo: {
        margin: theme.spacing(6, 0, 0.5),
        fontSize: "2em",
        textAlign: "center"
    },
    subtitle: {
        fontSize: "1em",
        textAlign: "center",
        margin: theme.spacing(1, 0, 2)
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    link: {
        padding: theme.spacing(0, 0, 2)
    },
    divider: {
        height: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: theme.spacing(2),
    }
}));

const requiredFieldMsg = "Ce champs est requis";
const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";

export default function PasswordChange() {
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();
    const initialValues = {
        username: location.state ? location.state.username : "",
        oldPassword: "",
        newPassword: "",
        newConfirm: ""
    }

    const handleHttpError = (error, setFieldError) => {
        if (error.response) {
            if (error.response.status === 401)
                setFieldError("oldPassword", "Le  mot de passe est erroné")
            else if (error.response.status === 409)
                setFieldError("newPassword", "L'ancien et le nouveau mot de passe ne doivent pas êtres identiques")
            else if (error.response.status === 404)
                setFieldError("username", "Le nom d'utilisateur n'est pas valide")
            else
                setErrorModalOpen(true);
        } else
            setErrorModalOpen(true);
    };


    if (AuthenticationService.isUserLoggedIn())
        return <Redirect to="/dashboard/"/>
    else
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{minHeight: '100vh'}}
            >
                <Grid item xs={12} md={6} xl={3}>
                    <Container component="main" maxWidth="sm" className={classes.container}>
                        <CssBaseline/>
                        <div className={classes.paper}>
                            <Typography variant="h1" className={classes.logo}>
                                Votre mot de passe est expiré
                            </Typography>
                            <Typography variant="h2" className={classes.subtitle}>
                                Veuillez le changer en utilisant le formulaire ci-dessous
                            </Typography>
                        </div>
                        <Divider className={classes.divider}/>
                        <Formik
                            onSubmit={async (values, {setFieldError}) =>
                                axios.put("http://localhost:8080/auth/password", values)
                                    .then(() => history.push("/"))
                                    .catch((error) => handleHttpError(error, setFieldError))
                            }

                            validationSchema={yup.object()
                                .shape({
                                    username: yup.string().trim().required(requiredFieldMsg),
                                    oldPassword: yup.string().trim().required(requiredFieldMsg),
                                    newPassword: yup.string().trim().min(8, tooShortError).required(requiredFieldMsg),
                                    newConfirm: yup.string()
                                        .oneOf([yup.ref('newPassword'), null], "Les mots de passes doivent êtres identiques").required(requiredFieldMsg)
                                })}
                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize={true}
                            initialValues={initialValues}
                        >
                            {({submitForm, isSubmitting}) => (
                                <form className={classes.form}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
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
                                        <Grid item xs={6}>
                                            <Field
                                                component={TextField}
                                                name="oldPassword"
                                                id="oldPassword"
                                                variant="outlined"
                                                label="Ancien mot de passe"
                                                type={"password"}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field
                                                component={TextField}
                                                name="newPassword"
                                                id="newPassword"
                                                variant="outlined"
                                                label="Nouveau mot de passe"
                                                type={"password"}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field
                                                component={TextField}
                                                name="newConfirm"
                                                id="newConfirm"
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
                                        Changer le mot de passe
                                    </Button>
                                </form>
                            )}
                        </Formik>
                        <Grid container justify="flex-end" className={classes.link}>
                            <Grid item>
                                <Link component={RouterLink} to={"/"} variant="body2">
                                    Retourner à la page de connexion
                                </Link>
                            </Grid>
                        </Grid>
                    </Container>
                </Grid>
                <Dialog open={errorModalOpen} onClose={() => {
                    setErrorModalOpen(false)
                }}>
                    <DialogTitle id="alert-dialog-title">{"Erreur réseau"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Erreur réseau: impossible de communiquer avec le serveur
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setErrorModalOpen(false)
                        }} color="primary">
                            J'ai compris
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
}