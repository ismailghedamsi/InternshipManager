import React, {useContext} from 'react';
import {Field, Form, Formik} from 'formik';
import AuthenticationService from '../Services/AuthenticationService';
import Grid from "@material-ui/core/Grid";
import {TextField} from "formik-material-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import {Link as RouterLink, Redirect, useHistory} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import * as yup from "yup";
import {useStyles} from "./Utils/useStyles";
import {ModalContext} from "../App";

const requiredFieldMsg = "Ce champs est requis";

export default function Login() {
    const {open} = useContext(ModalContext);
    const history = useHistory();
    const classes = useStyles();
    const initialValues = {
        username: "",
        password: ""
    }

    const handleHttpError = (error, setFieldError, username) => {
        if (error.response) {
            if (error.response.status === 401) {
                setFieldError("username", "Le nom d'utilisateur ou le  mot de passe est erroné")
                setFieldError("password", "   ")
            } else if (error.response.status === 498) {
                history.push("/passwordChange", {username: username})
            } else
                open();
        } else {
            open();
            console.error("Axios error: " + error)
        }
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
                                TUIMSPFCAUPPBJ
                            </Typography>
                            <Typography variant="h2" className={classes.subtitle}>
                                The Ultimate Internship Manager Software Platform For College And University Plus
                                Powered By Java
                            </Typography>
                            <Typography component="h1" variant="h5">
                                Se connecter
                            </Typography>
                        </div>
                        <Divider className={classes.divider}/>
                        <Formik
                            onSubmit={async (values, {setFieldError}) =>
                                AuthenticationService.authenticate(values)
                                    .then(() => history.push("/dashboard"))
                                    .catch((error) => handleHttpError(error, setFieldError, values.username))
                            }

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
                            {({isSubmitting}) => (
                                <Form className={classes.form}>
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
                                    >
                                        Se connecter
                                    </Button>
                                </Form>
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