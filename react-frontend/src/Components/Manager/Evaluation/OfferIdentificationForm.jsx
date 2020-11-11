import React from 'react';
import useStyles from "../../Utils/useStyles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import {TextField} from "formik-material-ui";
import {DatePicker} from "formik-material-ui-pickers";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function OfferIdentificationForm() {
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
                            traineeName: yup.string().trim().min(3, "Doit avoir au moins 3 caractères").max(255, "Doit avoir moins que 255 caractères")
                        })}
                    initialValues={{
                        traineeName: "",
                        stage: ""
                    }}
                >
                    {({isSubmitting}) =>
                        <Form className={classes.form}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="traineeName"
                                        id="traineeName"
                                        variant="outlined"
                                        label="Nom du stagiaire"
                                        required
                                        fullWidth
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={DatePicker}
                                        name="internshipStartDate"
                                        id="internshipStartDate"
                                        variant="outlined"
                                        label="Date du stage"
                                        required
                                        fullWidth
                                        format="MM/dd/yyyy"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Stage</FormLabel>
                                        <RadioGroup row aria-label="stage" name="stage" defaultValue="1">
                                            <FormControlLabel
                                                value="1"
                                                label="1"
                                                labelPlacement="start"
                                                control={<Radio color="primary"/>}
                                            />
                                            <FormControlLabel
                                                value="2"
                                                label="2"
                                                labelPlacement="start"
                                                control={<Radio color="primary"/>}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Form>}
                </Formik>
            </Container>
        </Grid>
    </Grid>
}