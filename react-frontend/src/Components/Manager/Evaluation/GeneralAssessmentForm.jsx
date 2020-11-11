import React from 'react';
import useStyles from "../../Utils/useStyles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import {TextField} from "formik-material-ui";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function GeneralAssessmentForm() {
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
                        .shape({})}
                    initialValues={{}}
                >
                    {({isSubmitting}) =>
                        <Form className={classes.form}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q1-label">
                                            Ce milieu est à privilégier pour le.
                                        </label>
                                        <Select
                                            labelId="q1-label"
                                            id="q1"
                                        >
                                            <MenuItem value={"Premier stage"}>Premier stage</MenuItem>
                                            <MenuItem value={"Deuxième stage"}>Deuxième stage</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q2-label">
                                            Ce milieu est ouvert à accueillir.
                                        </label>
                                        <Select
                                            labelId="q2-label"
                                            id="q2"
                                        >
                                            <MenuItem value={"Un stagiaire"}>un stagiaire</MenuItem>
                                            <MenuItem value={"Deux stagiaires"}>Deux stagiaires</MenuItem>
                                            <MenuItem value={"Trois stagiaires"}>Trois stagiaires</MenuItem>
                                            <MenuItem value={"Plus de trois"}>Plus de trois</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q3-label">
                                            Ce milieu désire accueillir le même stagiaire pour un prochain stage.
                                        </label>
                                        <Select
                                            labelId="q3-label"
                                            id="q3"
                                        >
                                            <MenuItem value={"Oui"}>Oui</MenuItem>
                                            <MenuItem value={"Non"}>Non</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <label id="q4-label">
                                        Ce milieu offre des quarts de travail variables:
                                    </label>
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="optionStarted1"
                                        id="optionStarted1"
                                        variant="outlined"
                                        label="De"
                                        required
                                        fullWidth
                                        type={"number"}
                                        InputProps={{
                                            inputProps: {
                                                min: 1,
                                                step: "any"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="optionEnd1"
                                        id="optionEnd1"
                                        variant="outlined"
                                        label="À"
                                        required
                                        fullWidth
                                        type={"number"}
                                        InputProps={{
                                            inputProps: {
                                                min: 2,
                                                step: "any"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="optionStarted2"
                                        id="optionStarted2"
                                        variant="outlined"
                                        label="De"
                                        required
                                        fullWidth
                                        type={"number"}
                                        InputProps={{
                                            inputProps: {
                                                min: 1,
                                                step: "any"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="optionEnd2"
                                        id="optionEnd2"
                                        variant="outlined"
                                        label="À"
                                        required
                                        fullWidth
                                        type={"number"}
                                        InputProps={{
                                            inputProps: {
                                                min: 2,
                                                step: "any"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="optionStarted3"
                                        id="optionStarted3"
                                        variant="outlined"
                                        label="De"
                                        required
                                        fullWidth
                                        type={"number"}
                                        InputProps={{
                                            inputProps: {
                                                min: 1,
                                                step: "any"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        component={TextField}
                                        name="optionEnd3"
                                        id="optionEnd3"
                                        variant="outlined"
                                        label="À"
                                        required
                                        fullWidth
                                        type={"number"}
                                        InputProps={{
                                            inputProps: {
                                                min: 2,
                                                step: "any"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <Select
                                            labelId="q4-label"
                                            id="q4"
                                        >
                                            <MenuItem value={"Oui"}>Oui</MenuItem>
                                            <MenuItem value={"Non"}>Non</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Form>}
                </Formik>
            </Container>
        </Grid>
    </Grid>
}