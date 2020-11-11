import React from 'react';
import useStyles from "../../Utils/useStyles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import {TextField} from "formik-material-ui";
import Typography from "@material-ui/core/Typography";

export default function CommentForm() {
    const classes = useStyles();

    return <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
    >
        <Grid item xs={12} sm={7} lg={5}>
            <Container component="main" maxWidth="sm" className={classes.container}>
                <Formik
                    onSubmit={async values => {

                    }}
                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={yup.object()
                        .shape({
                            comment: yup.string().trim().min(3, "Doit avoir au moins 3 caractères").max(255, "Doit avoir moins que 255 caractères")
                        })}
                    initialValues={{
                        comment: ""
                    }}
                >
                    {({isSubmitting}) =>
                        <Form className={classes.form}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant={"h6"} style={{display: "block"}}>
                                        Veuillez écrire les commentaires, s'il y a des opinions en désaccord.
                                    </Typography>
                                    <br/>
                                    <Field
                                        component={TextField}
                                        name="comment"
                                        id="comment"
                                        variant="outlined"
                                        label="Commentaires"
                                        fullWidth
                                        autoFocus
                                        multiline
                                        rows={20}
                                    />
                                </Grid>
                            </Grid>
                        </Form>}
                </Formik>
            </Container>
        </Grid>
    </Grid>
}