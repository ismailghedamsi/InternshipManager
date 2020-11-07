import {
    Button,
    Container,
    Grid,
    LinearProgress,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from "@material-ui/core";
import {Field, Form, Formik} from "formik";
import React, {useContext, useState} from "react";
import * as yup from "yup";
import {ModalContext} from "../../../App";
import useStyles from "../../Utils/useStyles";

const tooShortError = (value) =>
        "Doit avoir au moins " + value.min + " caractères";
const tooLittleError = (valueNumber) =>
        "Doit être un nombre plus grand que ou égal à " + valueNumber.min;
const tooBigError = (valueNumber) =>
        "Doit être un nombre plus petit que ou égal à " + valueNumber.max;
const requiredFieldMsg = "Ce champs est requis";

export default function Evaluationform(props) {
    const {open} = useContext(ModalContext);
    const classes = useStyles();
    const validationSchemaStep1 = yup.object().shape({
        fullname: yup.string().trim().min(5, tooShortError).required(),
        program: yup.string().trim().min(50).required(),
        entrepriseName: yup.string().trim().min(2, tooShortError).required(),
        supervisorName: yup.string().trim().min(2, tooShortError).required(),
        phoneNumber: yup.string().trim().min(10, tooShortError).required(),
        fonction: yup.string().trim().min(10, tooShortError).required()
    });

    const validationSchemaStep2 = yup.object().shape({});

    const validationSchemaStep3 = yup.object().shape({});

    const evaluationAnswers = ["Totalementen accord", "Plutôten accord", "Plutôten désaccord", "Totalementen désaccord", "N/A"]

    return (
            <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{minHeight: "100%"}}
            >
                <Grid item xs={12} sm={12} lg={12}>
                    <Container component="main" maxWidth="sm" className={classes.container}>
                        <FormikStepper
                                onSubmit={async values => console.log(values)
                                }
                                validateOnBlur={false}
                                validateOnChange={false}
                                enableReinitialize={true}
                                initialValues={{
                                    fullname: "",
                                    program: "",
                                    entrepriseName: "",
                                    supervisorName: "",
                                    fonction: "",
                                    phoneNumber: "",
                                    productivtyA: "",
                                    productivityB: "",
                                    productivtyC: "",
                                    productivityD: "",
                                    productivityE: "",
                                    productivityCommentary: "",
                                    jobQualityA: "",
                                    jobQualityB: "",
                                    jobQualityC: "",
                                    jobQualityD: "",
                                    jobQualityE: "",
                                    jobQualityCommentary: "",
                                    interpersonalRelationsA: "",
                                    interpersonalRelationsB: "",
                                    interpersonalRelationsC: "",
                                    interpersonalRelationsD: "",
                                    interpersonalRelationsE: "",
                                    interpersonalRelationsF: "",
                                    interpersonalCommentary: "",
                                    personalSkillsA: "",
                                    personalSkillsB: "",
                                    personalSkillsC: "",
                                    personalSkillsD: "",
                                    personalSkillsE: "",
                                    personalSkillsF: "",
                                    personalSkillsCommentary: "",
                                    globalAppreciation: ""

                                }}
                                validate={(values) => {
                                }}
                        >
                            <FormikStep label="Information Generale" validationSchema={validationSchemaStep1}>
                                <Grid container alignItems="start" justify="center" spacing={2}>
                                    <Typography variant={"h1"} className={classes.formTitle}>
                                        Évaluation du stagiaire
                                    </Typography>
                                    <Grid item xs={12}>
                                        <Field
                                                component={TextField}
                                                name="fullname"
                                                id="fullname"
                                                variant="outlined"
                                                label="Nom de l’élève :"
                                                required
                                                fullWidth
                                                autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                                component={TextField}
                                                name="program"
                                                id="program"
                                                variant="outlined"
                                                label="Programme d’études :"
                                                required
                                                fullWidth
                                                autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                                component={TextField}
                                                name="entrepriseName"
                                                id="entrepriseName"
                                                variant="outlined"
                                                label="Nom de l'entreprise :"
                                                required
                                                fullWidth
                                                autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                                component={TextField}
                                                name="supervisorName"
                                                id="supervisorName"
                                                variant="outlined"
                                                label="Nom du superviseur:"
                                                required
                                                fullWidth
                                                autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                                component={TextField}
                                                name="fonction"
                                                id="fonction"
                                                variant="outlined"
                                                label="Fonction :"
                                                required
                                                fullWidth
                                                autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                                component={TextField}
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                variant="outlined"
                                                label="Numero de telephone"
                                                required
                                                fullWidth
                                                autoFocus
                                        />
                                    </Grid>
                                </Grid>
                            </FormikStep>

                            <FormikStep label="Evaluation productivite" validationSchema={validationSchemaStep2}>
                                <Grid container alignItems="start" justify="center" spacing={2}>
                                    <Grid item xs={12}>
                                        <label>planifier et organiser son travail de façon efficace</label>
                                        <Field as="select" name="productivtyA">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>comprendre rapidement les directives relatives à son travail</label>
                                        <Field as="select" name="productivtyB">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>maintenir un rythme de travail soutenu</label>
                                        <Field as="select" name="productivtyC">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>établir ses priorités</label>
                                        <Field as="select" name="productivtyD">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>respecter ses échéanciers</label>
                                        <Field as="select" name="productivtyE">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>Commentaires</label>
                                        <Field as="TextArea" name="productivityCommentary">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                </Grid>
                            </FormikStep>

                            <FormikStep label="Evaluation qualité du travail" validationSchema={validationSchemaStep3}>
                                <Grid container alignItems="start" justify="center" spacing={2}>
                                    <Grid item xs={12}>
                                        <label>respecter les mandats qui lui ont été confiés</label>
                                        <Field as="select" name="jobQualityA">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>porter attention aux détails dans la réalisation de ses tâches</label>
                                        <Field as="select" name="jobQualityB">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>vérifier son travail, s’assurer que rien n’a été oublié</label>
                                        <Field as="select" name="jobQualityC">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>rechercher des occasions de se perfectionner</label>
                                        <Field as="select" name="jobQualityD">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>faire une bonne analyse des problèmes rencontrés</label>
                                        <Field as="select" name="jobQualityE">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>Commentaires</label>
                                        <Field as="TextArea" name="commentary">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                </Grid>
                            </FormikStep>

                            <FormikStep label="Evaluation QUALITÉS DES RELATIONS INTERPERSONNELLES"
                                        validationSchema={validationSchemaStep3}>
                                <Grid container alignItems="start" justify="center" spacing={2}>
                                    <Grid item xs={12}>
                                        <label>établir facilement des contacts avec les gens</label>
                                        <Field as="select" name="interpersonalRelationsA">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>contribuer activement au travail d’équipe</label>
                                        <Field as="select" name="interpersonalRelationsB">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>s’adapter facilement à la culture de l’entreprise</label>
                                        <Field as="select" name="interpersonalRelationsC">
                                            {evaluationAnswers.map((e) => <option>{e}
                                            </option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>accepter les critiques constructives</label>
                                        <Field as="select" name="interpersonalRelationsD">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>être respectueux envers les gens</label>
                                        <Field as="select" name="interpersonalRelationsE">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>Faire preuve d’écoute active en essayant de comprendre le point de vue de
                                            l’autre</label>
                                        <Field as="select" name="interpersonalRelationsF">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>Commentaires</label>
                                        <Field as="TextArea" name="interpersonalCommentary">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                </Grid>
                            </FormikStep>

                            <FormikStep label="HABILETÉS PERSONNELLES" validationSchema={validationSchemaStep3}>
                                <Grid container alignItems="start" justify="center" spacing={2}>
                                    <Grid item xs={12}>
                                        <label>démontrer de l’intérêt et de la motivation au travail</label>
                                        <Field as="select" name="personalSkillsA">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>exprimer clairement ses idées</label>
                                        <Field as="select" name="personalSkillsB">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>faire preuve d’initiative</label>
                                        <Field as="select" name="personalSkillsC">
                                            {evaluationAnswers.map((e) => <option>{e}
                                            </option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>travailler de façon sécuritaire</label>
                                        <Field as="select" name="personalSkillsD">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>démontrer un bon sens des responsabilités ne requérant qu’un minimum de
                                            supervision</label>
                                        <Field as="select" name="personalSkillsE">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>être ponctuel et assidu à son travail</label>
                                        <Field as="select" name="personalSkillsF">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>Commentaires</label>
                                        <Field as="TextArea" name="interpersonalCommentary">
                                            {evaluationAnswers.map((e) => <option>{e}</option>)}
                                        </Field>
                                    </Grid>

                                </Grid>
                            </FormikStep>
                        </FormikStepper>
                    </Container>
                </Grid>
            </Grid>
    );
}

export function FormikStep({children}) {
    return <>{children}</>;
}

export function FormikStepper({children, ...props}) {
    const childrenArray = React.Children.toArray(children);
    const [step, setStep] = useState(0);
    const currentChild = childrenArray[step];
    return (
            <>
                <Formik
                        {...props}
                        onSubmit={async (values) => {
                            if (isLastStep()) {
                                console.log(values)
                                props.onSubmit(values);
                            } else {
                                setStep((s) => s + 1);
                            }
                        }}
                >
                    {({isSubmitting}) => (
                            <Form>
                                <Stepper alternativeLabel activeStep={step}>
                                    {childrenArray.map((child) => (
                                            <Step key={child.props.label}>
                                                <StepLabel>{child.props.label}</StepLabel>
                                            </Step>
                                    ))}
                                </Stepper>
                                {currentChild}
                                {isSubmitting && <LinearProgress/>}
                                {step > 0 ? (
                                        <Button
                                                disabled={isSubmitting}
                                                onClick={() => setStep((s) => s - 1)}
                                        >
                                            Precedent
                                        </Button>
                                ) : (
                                        ""
                                )}
                                <Button disabled={isSubmitting}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        size={"large"}
                                >
                                    {isLastStep() ? "Completer l'evaluation" : "Suivant"}
                                </Button>
                            </Form>
                    )}
                </Formik>
            </>
    );

    function isLastStep() {
        return step === childrenArray.length - 1;
    }
}
