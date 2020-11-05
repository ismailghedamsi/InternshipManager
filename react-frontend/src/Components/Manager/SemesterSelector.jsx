import React, {useContext, useEffect, useState} from "react"
import {SemesterContext} from "../../App";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import Typography from "@material-ui/core/Typography";
import {Select} from "formik-material-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import useStyles from "../Utils/useStyles";
import MenuItem from "@material-ui/core/MenuItem";
import {useApi} from "../Utils/Hooks";
import {useHistory} from "react-router-dom";


export default function SemesterSelector() {
    const classes = useStyles();
    const history = useHistory();
    const {setSemester} = useContext(SemesterContext);
    const api = useApi();
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        api.get("/semesters")
            .then(r => setSemesters(r ? r.data : []))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function generateMenuItems() {
        if (semesters.length !== 0) {
            const options = semesters.map((item, i) => <MenuItem key={i} value={i}>{item}</MenuItem>);
            options.push(<MenuItem key={semesters.length} value={-1} disabled>Veuillez choisir une année</MenuItem>);
            return options;
        } else
            return <MenuItem value={-1} disabled>Aucune année</MenuItem>;
    }

    return (
        <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '100vh'}}
        >
            <Grid item xs={12} sm={7} lg={5}>
                <Container component="main" maxWidth="sm" className={classes.container}>
                    <Formik
                        onSubmit={async values => {
                            setSemester(semesters[values.semester]);
                            history.push("/dashboard");
                        }}

                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={yup.object()
                            .shape({
                                semester: yup.number().notOneOf([-1], "Impossible de choisir une année invalide").required("Ce champ est requis")
                            })}
                        initialValues={{
                            semester: -1,
                        }}
                    >
                        {({submitForm, isSubmitting}) => (
                            <Form>
                                <Grid container
                                      alignItems="start"
                                      justify="center"
                                      spacing={2}>
                                    <Typography variant="h1" className={classes.formTitle} style={{fontSize: "2em"}}>
                                        Choisir une année scolaire
                                    </Typography>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={Select}
                                            id="semester"
                                            name="semester"
                                            fullWidth
                                            style={{marginBottom: "10px"}}
                                        >
                                            {generateMenuItems()}
                                        </Field>
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
                                        Changer d'année
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