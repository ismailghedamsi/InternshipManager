import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { TextField } from "formik-material-ui";
import './UploadCV.css'
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = (theme) => ({
    container: {
        backgroundColor: "#fff",
        borderRadius: theme.spacing(2),
    }
});

class UploadCV extends Component {

    readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = reject;

            reader.readAsDataURL(file);
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item xs={12}>
                    <Container component="main" maxWidth="sm" className={classes.container}>
                        <Typography variant="h5" id="title">
                            Télécharger un nouveau CV
                        </Typography>
                        <Formik
                            onSubmit={async (values) => {
                                return this.readFileAsync(values.file).then((file) => {
                                    let dto = { ...values };
                                    dto.file = file;
                                    return axios.post("http://localhost:8080/resumes", dto)
                                })
                            }}

                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize={true}
                            validate={(values) => {
                                const errors = {};
                                if (values.name.length === 0) {
                                    errors.name = "Le nom du fichier ne doit pas être vite"
                                }
                                if (values.file.type !== "application/pdf") {
                                    errors.file = "Le fichier doit être de type PDF"
                                }
                                return errors;
                            }}
                            initialValues={{
                                name: "",
                                file: ""
                            }}
                        >
                            {({ submitForm, isSubmitting, setFieldValue }) => (
                                <Form>
                                    <Field
                                        component={TextField}
                                        name="name"
                                        id="name"
                                        variant="outlined"
                                        label="Nom du fichier"
                                        fullWidth
                                    />

                                    <input
                                        name="file"
                                        id="file"
                                        type="file"
                                        className="file"
                                        onChange={(e) => {
                                            setFieldValue("file", e.currentTarget.files[0])
                                        }}
                                    />
                                    <ErrorMessage name={"file"}>
                                        {msg => <p className="msgError"><span style={{ color: "red" }}>{msg}</span>
                                        </p>}
                                    </ErrorMessage>
                                    {isSubmitting && <LinearProgress />}
                                    <Button
                                        id="buttonSubmit"
                                        type={"submit"}
                                        variant="contained"
                                        fullWidth
                                        size={"large"}
                                        color="primary"
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                    >
                                        Téléverser le CV
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Container>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(useStyles)(UploadCV)