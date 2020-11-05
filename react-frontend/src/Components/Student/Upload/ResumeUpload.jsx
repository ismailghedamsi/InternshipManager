import React from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {ErrorMessage, Field, Form, Formik} from "formik";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {SimpleFileUpload, TextField} from "formik-material-ui";
import './ResumeUpload.css'
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import useStyles from "../../Utils/useStyles";
import {useApi} from "../../Utils/Hooks";
import {useHistory} from "react-router-dom";


export default function ResumeUpload() {
    const classes = useStyles();
    const api = useApi();
    const history = useHistory();

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result)
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        })
    }

    return (
        <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '100%'}}
        >
            <Grid item xs={12} sm={7} lg={5}>
                <Container component="main" maxWidth="sm" className={classes.container}>
                    <Formik
                        onSubmit={async (values) => readFileAsync(values.file).then((file) => {
                            let dto = {...values};
                            dto.file = file;
                            return api.post("/resumes", dto)
                                .then(() => history.push("/dashboard/listcv"))
                        })
                        }

                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validate={(values) => {
                            const errors = {};
                            if (values.file.type !== "application/pdf") {
                                errors.file = "Le fichier doit être de type PDF"
                            }
                            return errors;
                        }}
                        validationSchema={yup.object()
                            .shape({
                                name: yup.string().trim().max(255).required("Ce champ est requis")
                            })}
                        initialValues={{
                            name: "",
                            file: ""
                        }}
                    >
                        {({submitForm, isSubmitting}) => (
                            <Form>
                                <Grid container
                                      alignItems="start"
                                      justify="center"
                                      spacing={2}>
                                    <Typography variant="h1" className={classes.formTitle} style={{fontSize: "2em"}}>
                                        Télécharger un nouveau CV
                                    </Typography>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="name"
                                            id="name"
                                            variant="outlined"
                                            label="Nom du fichier"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={SimpleFileUpload}
                                            type={"file"}
                                            name="file"
                                            id="file"
                                            variant="outlined"
                                            label="Fichier PDF"
                                            fullwidth
                                            required
                                        />
                                        <ErrorMessage name={"file"}>
                                            {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span>
                                            </p>}
                                        </ErrorMessage>
                                    </Grid>
                                    {isSubmitting && <LinearProgress/>}
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
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </Grid>
        </Grid>
    )
}