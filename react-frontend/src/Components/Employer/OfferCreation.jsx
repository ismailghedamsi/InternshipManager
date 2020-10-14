import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import React from "react";
import {useHistory} from 'react-router-dom';
import * as yup from "yup";
import {DatePicker} from 'formik-material-ui-pickers';
import {useApi} from "../Utils/Hooks";
import AuthenticationService from "../../Services/AuthenticationService";
import Button from "@material-ui/core/Button";
import {useStyles} from "../Utils/useStyles";

const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
const tooLittleError = (valueNumber) => "Doit avoir au moins un chiffre plus grand que ou égal que " + valueNumber.min;
const tooBigError = (valueNumber) => "Doit avoir au moins plus petit que " + valueNumber.max;
const requiredFieldMsg = "Ce champs est requis";

export default function OfferCreation() {
    const classes = useStyles();
    const api = useApi();
    const history = useHistory();
    const validationSchema = yup.object().shape({
        title: yup.string().trim().min(2, tooShortError).required(requiredFieldMsg),
        description: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
        nbOfWeeks: yup.number().min(1, tooLittleError).required(requiredFieldMsg),
        salary: yup.number().min(0, tooLittleError).required(requiredFieldMsg),
        beginHour: yup.number().min(0, tooLittleError).max(23, tooBigError).required(requiredFieldMsg),
        endHour: yup.number().required(requiredFieldMsg).when("beginHour", (begin) => yup.mixed()
            .test({
                name: 'includeZero',
                test: (end) => end > begin || end === 0,
                message: "L'heure de fin doit être plus grande que celle de début"
            })),
        limitDateToApply: yup.date().required().when(
            "creationDate",
            (creationDate, schema) => creationDate && schema.min(creationDate, "La date de fin doit être dans le futur")),
    });
    const initialValues = {
        title: '',
        description: '',
        nbOfWeeks: '',
        salary: '',
        beginHour: '',
        endHour: '',
        creationDate: new Date(),
        limitDateToApply: new Date(),
        file: ""
    }

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        })
    }

    function sendOfferToBackEnd(values) {
        return readFileAsync(values.file).then((base64file) => {
            let dto = {...values};
            dto.file = base64file;
            dto.employer = AuthenticationService.getCurrentUser();

            return api.post("/offers", dto)
        })
    }

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
                    <Formik
                        onSubmit={async (values) => sendOfferToBackEnd(values)
                            .then(() => history.push("/dashboard/listoffer"))}

                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        initialValues={initialValues}
                        validate={(values) => {
                            const errors = {};
                            if (values.file.type !== "application/pdf") {
                                errors.file = "Le fichier doit être de type PDF"
                            }
                            if (values.file.length === 0) {
                                errors.file = "Aucun fichier selectionné ou le fichier est vide"
                            }
                            return errors;
                        }}
                    >
                        {({isSubmitting, setFieldValue}) => (
                            <Form className={classes.form}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="title"
                                            id="title"
                                            variant="outlined"
                                            label="Titre"
                                            required
                                            fullWidth
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="description"
                                            id="description"
                                            variant="outlined"
                                            label="Description"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="nbOfWeeks"
                                            id="nbOfWeeks"
                                            variant="outlined"
                                            label="Nombre de semaine"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 1}}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="salary"
                                            id="salary"
                                            variant="outlined"
                                            label="Salaire"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 0}}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="beginHour"
                                            id="beginHour"
                                            variant="outlined"
                                            label="Heure de début"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 0, max: 23}}}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            name="endHour"
                                            id="endHour"
                                            variant="outlined"
                                            label="Heure de fin"
                                            required
                                            fullWidth
                                            type={"number"}
                                            InputProps={{inputProps: {min: 0, max: 23}}}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Field
                                            component={DatePicker}
                                            name="limitDateToApply"
                                            id="limitDateToApply"
                                            variant="outlined"
                                            label="Date limite pour appliquer"
                                            format="MM/dd/yyyy"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <input
                                        name="file"
                                        id="file"
                                        accept="application/pdf"
                                        type="file"
                                        className="file"
                                        onChange={(e) => {
                                            const {target} = e
                                            if (target.value.length > 0) {
                                                setFieldValue("file", e.currentTarget.files[0])
                                            }
                                        }}
                                    />
                                    <ErrorMessage name={"file"}>
                                        {msg => <p id="msgError"><span style={{color: "red"}}>{msg}</span>
                                        </p>}
                                    </ErrorMessage>
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
                                    Créer l'offre de stage
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </Grid>
        </Grid>
    )
}