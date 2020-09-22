import {Field, Formik} from 'formik';
import React, {useState} from 'react';
import AuthenticationRegistrationService from '../js/AuthenticationRegistrationService';
import axios from 'axios';
import Grid from "@material-ui/core/Grid";
import {TextField} from "formik-material-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import * as yup from "yup";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

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
        fontSize: "3em",
    },
    subtitle: {
        fontSize: "1em",
        textAlign: "center",
        margin: theme.spacing(0, 0, 6)
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

export default function Login(props) {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const initialValues = {
        username: "",
        password: ""
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
                    <CssBaseline/>
                    <div className={classes.paper}>
                        <Typography variant="h1" className={classes.logo}>
                            TUIMSPFCAUPPBJ
                        </Typography>
                        <Typography variant="h2" className={classes.subtitle}>
                            The Ultimate Internship Manager Software Platform For College And University Plus Powered By
                            Java
                        </Typography>
                        <Typography component="h1" variant="h5">
                            Se connecter
                        </Typography>
                    </div>
                    <Divider className={classes.divider}/>
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
                        onSubmit={async (values, {setFieldError}) => {
                            AuthenticationRegistrationService.logout()
                            AuthenticationRegistrationService.setupAxiosInterceptors(values.username, values.password)
                            return axios({
                                method: "GET",
                                url: "http://localhost/auth/user",
                                headers: {
                                    authorization: "Basic " + window.btoa(values.username + ":" + values.password)
                                }
                            }).then((response) => {
                                let user = response.data
                                AuthenticationRegistrationService.saveValueToSession("authenticatedUser", JSON.stringify(user))
                                console.log(props)
                                props.history.push("/welcome")
                            }).catch((error) => {
                                if (error.response) {
                                    if (error.response.status === 401) {
                                        setFieldError("username", "Le nom d'utilisateur ou le  mot de passe est erroné")
                                        setFieldError("password", "   ")
                                    } else
                                        setOpen(true)
                                } else {
                                    setOpen(true)
                                }
                            })
                        }}

                        validationSchema={yup.object()
                            .shape({
                                username: yup.string().trim().required(requiredFieldMsg),
                                password: yup.string().trim().required(requiredFieldMsg)
                            })}
                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        initialValues={initialValues}
                    >
                        {({submitForm, isSubmitting}) => (
                            <form className={classes.form}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
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
                                    <Grid item xs={12}>
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
                                    Se connecter
                                </Button>
                            </form>
                        )}
                    </Formik>
                    <Grid container justify="flex-end" className={classes.link}>
                        <Grid item>
                            <Link component={RouterLink} to={"/register"} variant="body2">
                                Vous n'avez pas de compte? S'enregister
                            </Link>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </Grid>
    );
}