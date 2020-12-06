import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import React, {useContext} from "react";
import {Link as RouterLink, useHistory, useLocation} from "react-router-dom";
import * as yup from "yup";
import {ModalContext} from "../App";
import AuthenticationService from "../Services/AuthenticationService"
import useStyles from "./Utils/Style/useStyles";

const HTTP_UNAUTHORIZED = 401
const HTTP_NOT_FOUND = 404
const HTTP_CONFLICT = 409
const requiredFieldMsg = "Ce champ est requis"
const tooShortError = value => "Doit avoir au moins " + value.min + " caractères"

export default function PasswordChange() {
    const {open} = useContext(ModalContext)
    const history = useHistory()
    const location = useLocation()
    const classes = useStyles()
    const initialValues = {
        username: location.state ? location.state.email : "",
        oldPassword: "",
        newPassword: "",
        newConfirm: ""
    }

    const handleHttpError = (error, setFieldError) => {
        if (error.response) {
            if (error.response.status === HTTP_UNAUTHORIZED)
                setFieldError("oldPassword", "Le mot de passe est erroné")
            else if (error.response.status === HTTP_CONFLICT)
                setFieldError("newPassword", "L'ancien et le nouveau mots de passe doivent être différents")
            else if (error.response.status === HTTP_NOT_FOUND)
                setFieldError("username", "L'adresse courriel n'est pas formatée correctement")
            else
                open()
        } else
            open()
    }

    return <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{minHeight: "100vh"}}
    >
        <Grid item xs={12} md={6} xl={3}>
            <Container component="main" maxWidth="sm" className={classes.container}>
                <CssBaseline/>
                <div className={classes.paper}>
                    {AuthenticationService.isUserLoggedIn() ? <>
                        <Typography variant="h1" className={classes.logo}>
                            Changer votre mot de passe
                        </Typography>
                        <Typography variant="h2" className={classes.subtitle}>
                            Vous pouvez le changer en utilisant le formulaire ci-dessous
                        </Typography>
                    </> : <>
                        <Typography variant="h1" className={classes.logo}>
                            Votre mot de passe est expiré
                        </Typography>
                        <Typography variant="h2" className={classes.subtitle}>
                            Veuillez le changer en utilisant le formulaire ci-dessous
                        </Typography>
                    </>
                    }
                </div>
                <Divider className={classes.divider}/>
                <Formik
                    onSubmit={async (values, {setFieldError}) =>
                        axios.put("http://localhost:8080/api/auth/password", values)
                            .then(() => {
                                AuthenticationService.logout()
                                history.push("/", {email: values.username})
                            })
                            .catch(error => handleHttpError(error, setFieldError))
                    }

                    validationSchema={yup.object()
                        .shape({
                            username: yup.string().email("L'adresse courriel n'est pas formatée correctement").trim().required(requiredFieldMsg),
                            oldPassword: yup.string().trim().required(requiredFieldMsg),
                            newPassword: yup.string().trim().min(8, tooShortError).required(requiredFieldMsg),
                            newConfirm: yup.string()
                                .oneOf([yup.ref("newPassword"), null], "Les mots de passe doivent être identiques").required(requiredFieldMsg)
                        })}
                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    initialValues={initialValues}
                >
                    {({isSubmitting}) => <Form className={classes.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Field
                                    component={TextField}
                                    name="username"
                                    id="username"
                                    variant="outlined"
                                    label="Adresse courriel"
                                    required
                                    fullWidth
                                    disabled
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
                                    label="Confirmation"
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
                            Changer le mot de passe
                        </Button>
                    </Form>}
                </Formik>
                <Grid container justify="flex-end" className={classes.link}>
                    <Grid item>
                        <Link component={RouterLink} to={"/"} variant="body2">
                            Retourner en arrière
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    </Grid>;
}
