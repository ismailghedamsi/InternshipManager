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

export default function EvaluationForm() {
    const classes = useStyles();

    return <Grid
        container
        direction="column"
        alignItems="center"
        justify="flex-start"
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
                                            Les tâches confiées au stagiaire sont conformes aux tâches annoncées
                                            dans l’entente de stage.
                                        </label>
                                        <Select
                                            labelId="q1-label"
                                            id="q1"
                                        >
                                            <MenuItem value={"Totalementen accord"}>Totalementen accord</MenuItem>
                                            <MenuItem value={"Plutôt en accord"}>Plutôt en accord</MenuItem>
                                            <MenuItem value={"Plutôt désaccord"}>Plutôt désaccord</MenuItem>
                                            <MenuItem value={"Totalement désaccord"}>Totalement désaccord</MenuItem>
                                            <MenuItem value={"Impossible de se prononcer"}>Impossible de se
                                                prononcer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q2-label">
                                            Des mesures d’accueil facilitent l’intégration du nouveau stagiaire.
                                        </label>
                                        <Select
                                            labelId="q2-label"
                                            id="q2"
                                        >
                                            <MenuItem value={"Totalementen accord"}>Totalementen accord</MenuItem>
                                            <MenuItem value={"Plutôt en accord"}>Plutôt en accord</MenuItem>
                                            <MenuItem value={"Plutôt désaccord"}>Plutôt désaccord</MenuItem>
                                            <MenuItem value={"Totalement désaccord"}>Totalement désaccord</MenuItem>
                                            <MenuItem value={"Impossible de se prononcer"}>Impossible de se
                                                prononcer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q3-label">
                                            Le temps réel consacré à l’encadrement du stagiaire est suffisant.
                                        </label>
                                        <Select
                                            labelId="q3-label"
                                            id="q3"
                                        >
                                            <MenuItem value={"Totalementen accord"}>Totalementen accord</MenuItem>
                                            <MenuItem value={"Plutôt en accord"}>Plutôt en accord</MenuItem>
                                            <MenuItem value={"Plutôt désaccord"}>Plutôt désaccord</MenuItem>
                                            <MenuItem value={"Totalement désaccord"}>Totalement désaccord</MenuItem>
                                            <MenuItem value={"Impossible de se prononcer"}>Impossible de se
                                                prononcer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q4-label">
                                            L’environnement de travail respecte les normes d’hygiène et de sécurité
                                            au travail.
                                        </label>
                                        <Select
                                            labelId="q4-label"
                                            id="q4"
                                        >
                                            <MenuItem value={"Totalementen accord"}>Totalementen accord</MenuItem>
                                            <MenuItem value={"Plutôt en accord"}>Plutôt en accord</MenuItem>
                                            <MenuItem value={"Plutôt désaccord"}>Plutôt désaccord</MenuItem>
                                            <MenuItem value={"Totalement désaccord"}>Totalement désaccord</MenuItem>
                                            <MenuItem value={"Impossible de se prononcer"}>Impossible de se
                                                prononcer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q5-label">
                                            Le climat de travail est agréable.
                                        </label>
                                        <Select
                                            labelId="q5-label"
                                            id="q5"
                                        >
                                            <MenuItem value={"Totalementen accord"}>Totalementen accord</MenuItem>
                                            <MenuItem value={"Plutôt en accord"}>Plutôt en accord</MenuItem>
                                            <MenuItem value={"Plutôt désaccord"}>Plutôt désaccord</MenuItem>
                                            <MenuItem value={"Totalement désaccord"}>Totalement désaccord</MenuItem>
                                            <MenuItem value={"Impossible de se prononcer"}>Impossible de se
                                                prononcer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q6-label">
                                            Le milieu de stage est accessible par transport en commun.
                                        </label>
                                        <Select
                                            labelId="q6-label"
                                            id="q6"
                                        >
                                            <MenuItem value={"Totalementen accord"}>Totalementen accord</MenuItem>
                                            <MenuItem value={"Plutôt en accord"}>Plutôt en accord</MenuItem>
                                            <MenuItem value={"Plutôt désaccord"}>Plutôt désaccord</MenuItem>
                                            <MenuItem value={"Totalement désaccord"}>Totalement désaccord</MenuItem>
                                            <MenuItem value={"Impossible de se prononcer"}>Impossible de se
                                                prononcer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q7-label">
                                            Le salaire offert est intéressant pour le stagiaire.
                                        </label>
                                        <br/>
                                        <Field
                                            component={TextField}
                                            name="salary"
                                            id="salary"
                                            variant="outlined"
                                            label="Préciser : __/l’heure."
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{
                                                inputProps: {
                                                    min: 12.50,
                                                    step: "any"
                                                }
                                            }}
                                        />
                                        <Select
                                            labelId="q7-label"
                                            id="q7"
                                        >
                                            <MenuItem value={"Totalementen accord"}>Totalementen accord</MenuItem>
                                            <MenuItem value={"Plutôt en accord"}>Plutôt en accord</MenuItem>
                                            <MenuItem value={"Plutôt désaccord"}>Plutôt désaccord</MenuItem>
                                            <MenuItem value={"Totalement désaccord"}>Totalement désaccord</MenuItem>
                                            <MenuItem value={"Impossible de se prononcer"}>Impossible de se
                                                prononcer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q8-label">
                                            La communication avec le superviseur de stage facilite le déroulement du
                                            stage.
                                        </label>
                                        <Select
                                            labelId="q8-label"
                                            id="q8"
                                        >
                                            <MenuItem value={"Totalementen accord"}>Totalementen accord</MenuItem>
                                            <MenuItem value={"Plutôt en accord"}>Plutôt en accord</MenuItem>
                                            <MenuItem value={"Plutôt désaccord"}>Plutôt désaccord</MenuItem>
                                            <MenuItem value={"Totalement désaccord"}>Totalement désaccord</MenuItem>
                                            <MenuItem value={"Impossible de se prononcer"}>Impossible de se
                                                prononcer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q9-label">
                                            L’équipement fourni est adéquat pour réaliser les tâches confiées.
                                        </label>
                                        <Select
                                            labelId="q9-label"
                                            id="q9"
                                        >
                                            <MenuItem value={"Totalementen accord"}>Totalementen accord</MenuItem>
                                            <MenuItem value={"Plutôt en accord"}>Plutôt en accord</MenuItem>
                                            <MenuItem value={"Plutôt désaccord"}>Plutôt désaccord</MenuItem>
                                            <MenuItem value={"Totalement désaccord"}>Totalement désaccord</MenuItem>
                                            <MenuItem value={"Impossible de se prononcer"}>Impossible de se
                                                prononcer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label id="q10-label">
                                            Le volume de travail est acceptable.
                                        </label>
                                        <Select
                                            labelId="q10-label"
                                            id="q10"
                                        >
                                            <MenuItem value={"Totalementen accord"}>Totalementen accord</MenuItem>
                                            <MenuItem value={"Plutôt en accord"}>Plutôt en accord</MenuItem>
                                            <MenuItem value={"Plutôt désaccord"}>Plutôt désaccord</MenuItem>
                                            <MenuItem value={"Totalement désaccord"}>Totalement désaccord</MenuItem>
                                            <MenuItem value={"Impossible de se prononcer"}>Impossible de se
                                                prononcer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <label>
                                        Préciser le nombre d’heures/semaine.
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        component={TextField}
                                        name="month1"
                                        id="month1"
                                        variant="outlined"
                                        label="Premier mois"
                                        required
                                        fullWidth
                                        type={"number"}
                                        InputProps={{
                                            inputProps: {
                                                min: 1,
                                                max: 40,
                                                step: "any"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        component={TextField}
                                        name="month2"
                                        id="month2"
                                        variant="outlined"
                                        label="Deuxième mois"
                                        required
                                        fullWidth
                                        type={"number"}
                                        InputProps={{
                                            inputProps: {
                                                min: 1,
                                                max: 40,
                                                step: "any"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        component={TextField}
                                        name="month3"
                                        id="month3"
                                        variant="outlined"
                                        label="Troisième mois"
                                        required
                                        fullWidth
                                        type={"number"}
                                        InputProps={{
                                            inputProps: {
                                                min: 1,
                                                max: 40,
                                                step: "any"
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Form>}
                </Formik>
            </Container>
        </Grid>
    </Grid>
}