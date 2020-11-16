import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import {ErrorMessage, Field} from "formik";
import {SimpleFileUpload, TextField} from "formik-material-ui";
import React from "react";
import {useLocation} from "react-router-dom";
import * as yup from "yup";
import {FormikStepper} from "../../Manager/BusinessEvaluations/FormikStepper";
import useStyles from "../../Utils/useStyles";

const tooShortError = value => "Doit avoir au moins " + value.min + " caractères";
const tooLittleError = valueNumber => "Doit être plus grand que ou égal à " + valueNumber.min;
const tooBigError = valueNumber => "Doit être plus petit que ou égal à " + valueNumber.max;
const requiredFieldMsg = "Ce champs est requis";
const requiredRadioMsg = "Aucun bouton radio a été sélécionner";
const invalidSelectOption = "Option séléctionné invalide";
export default function Evaluationform() {
    const classes = useStyles();
    const location = useLocation();
    const evaluationAnswers = [
        "Totalement en accord",
        "Plutôt en accord",
        "Plutôt en désaccord",
        "Totalement en désaccord",
        "N/A"
    ];

    const globalAppreciations = [
        "Les habiletés démontrées dépassent de beaucoup les attentes",
        "Les habiletés démontrées dépassent les attentes",
        "Les habiletés démontrées répondent pleinement aux attentes",
        "Les habiletés démontrées répondent partiellement aux attentes",
        "Les habiletés démontrées ne répondent pas aux attentes"
    ];

    const validationSchemaStep1 = yup.object().shape({
        infos: yup.object().shape({
            studentProgram: yup
                .string()
                .trim()
                .min(5, tooLittleError)
                .max(50, tooBigError)
                .required(),
            fullname: yup
                .string()
                .trim()
                .min(5, tooLittleError)
                .max(50, tooBigError)
                .required(),
        })
    });

    const validationSchemaStep2 = yup.object().shape({
        productivity: yup.object().shape({
            comment: yup.string().required(requiredFieldMsg).min(20, tooLittleError),
            efficiency: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            comprehension: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            rythm: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            priorities: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            deadlines: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
        })
    });

    const validationSchemaStep3 = yup.object().shape({
        quality: yup.object().shape({
            comment: yup
                .string()
                .trim()
                .required(requiredFieldMsg)
                .min(20, tooLittleError),
            followsInstructions: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            detailsAttention: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            doubleChecks: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            strivesForPerfection: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            problemAnalysis: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
        })
    });

    const validationSchemaStep4 = yup.object().shape({
        relationships: yup.object().shape({
            comment: yup
                .string()
                .trim()
                .required(requiredFieldMsg)
                .min(20, tooLittleError),
            connectsEasily: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            teamworkContribution: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            culturalAdaptation: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            acceptsCriticism: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            respectsOthers: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            activelyListens: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
        })
    });

    const validationSchemaStep5 = yup.object().shape({
        skills: yup.object().shape({
            comment: yup
                .string()
                .trim()
                .required(requiredFieldMsg)
                .min(20, tooLittleError),
            showsInterest: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            expressesOwnIdeas: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            showsInitiative: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            worksSafely: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            dependable: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
            punctual: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(evaluationAnswers, invalidSelectOption),
        })
    });

    const validationSchemaStep6 = yup.object().shape({
        appreciation: yup.object().shape({
            comment: yup
                .string()
                .trim()
                .required(requiredFieldMsg)
                .min(20, tooLittleError),
            discussedWithIntern: yup.string().required(requiredRadioMsg),
            expectations: yup
                .string()
                .required(requiredFieldMsg)
                .oneOf(globalAppreciations, invalidSelectOption),
        })
    });

    const validationSchemaStep7 = yup.object().shape({
        feedback: yup.object().shape({
            weeklySupervisionHours: yup.number().required().min(0, tooShortError),
        })
    });

    const validationSchemaStep8 = yup.object().shape({
        feedback: yup.object().shape({
            technicalFormationOpinion: yup
                .string()
                .trim()
                .required()
                .min(20, tooShortError),
            hireAgain: yup.string().trim().required(requiredRadioMsg),
        }),
        signature: yup.object().shape({
            name: yup.string().required().min(5, tooShortError).max(50, tooBigError),
            image: yup.string().required(),
        }),
        infos: yup.object().shape({
            supervisorRole: yup.string().required().min(5).max(50),
            phoneNumber: yup.string().required().min(10),
        })
    });

    return <Card style={{flow: "auto", height: "auto"}}>
        <CardContent>
            <FormikStepper
                application={location.state}
                initialValues={{
                    infos: {
                        fullname:
                            location.state.student.firstName +
                            " " +
                            location.state.student.lastName,
                        studentProgram: "",
                        supervisorRole: "",
                        phoneNumber: "",
                    },
                    productivity: {
                        efficiency: evaluationAnswers[0],
                        comprehension: evaluationAnswers[0],
                        rythm: evaluationAnswers[0],
                        priorities: evaluationAnswers[0],
                        deadlines: evaluationAnswers[0],
                        comment: "",
                    },
                    quality: {
                        followsInstructions: evaluationAnswers[0],
                        detailsAttention: evaluationAnswers[0],
                        doubleChecks: evaluationAnswers[0],
                        strivesForPerfection: evaluationAnswers[0],
                        problemAnalysis: evaluationAnswers[0],
                        comment: "",
                    },
                    relationships: {
                        connectsEasily: evaluationAnswers[0],
                        teamworkContribution: evaluationAnswers[0],
                        culturalAdaptation: evaluationAnswers[0],
                        acceptsCriticism: evaluationAnswers[0],
                        respectsOthers: evaluationAnswers[0],
                        activelyListens: evaluationAnswers[0],
                        comment: "",
                    },
                    skills: {
                        showsInterest: evaluationAnswers[0],
                        expressesOwnIdeas: evaluationAnswers[0],
                        showsInitiative: evaluationAnswers[0],
                        worksSafely: evaluationAnswers[0],
                        dependable: evaluationAnswers[0],
                        punctual: evaluationAnswers[0],
                        comment: "",
                    },
                    appreciation: {
                        expectations: globalAppreciations[0],
                        comment: "",
                        discussedWithIntern: "",
                    },
                    feedback: {
                        weeklySupervisionHours: 0,
                        hireAgain: "",
                        technicalFormationOpinion: "",
                    },
                    signature: {
                        image: "",
                        date: new Date(),
                        name: "",
                    },
                }}
                evaluationAnswers={evaluationAnswers}
                globalAppreciations={globalAppreciations}
            >
                <FormikStep
                    label="Information Generale"
                    validationSchema={validationSchemaStep1}
                >
                    <Grid
                        container
                        alignItems="flex-start"
                        justify="center"
                        spacing={2}
                    >
                        <Typography variant={"h1"} className={classes.formTitle}>
                            Évaluation du stagiaire
                        </Typography>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="infos.fullname"
                                id="fullname"
                                variant="outlined"
                                label="Nom de l’étudiant :"
                                disabled
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="infos.studentProgram"
                                id="studentProgram"
                                variant="outlined"
                                label="Programme d’études :"
                                required
                                fullWidth
                                autoFocus
                            />
                        </Grid>
                    </Grid>
                </FormikStep>
                <FormikStep
                    label="Evaluation productivité"
                    validationSchema={validationSchemaStep2}
                >
                    <Grid container justify="space-between" spacing={2}>
                        <Grid item xs={12}>
                            <h1>Capacité d’optimiser son rendement au travail</h1>
                            <h1>Le stagiaire a été en mesure de :</h1>
                            <label>
                                a - planifier et organiser son travail de façon efficace
                            </label>
                            <Field
                                as="select"
                                variant="outlined"
                                name="productivity.efficiency"
                            >
                                {evaluationAnswers.map((e, k) => <option defaultValue={e} key={k}>
                                    {e}
                                </option>)}
                            </Field>
                            <ErrorMessage name="productivity.efficiency">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>
                                b - comprendre rapidement les directives relatives à son
                                travail
                            </label>
                            <Field
                                variant="outlined"
                                as="select"
                                name="productivity.comprehension"
                            >
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="productivity.comprehension">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>
                                c - maintenir un rythme de travail soutenu
                            </label>
                            <Field as="select" name="productivity.rythm">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="productivity.rhythm">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>
                                d - établir ses priorités
                            </label>
                            <Field as="select" name="productivity.priorities">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="productivity.priorities">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>
                                e - respecter ses échéanciers
                            </label>
                            <Field as="select" name="productivity.deadlines">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="productivity.deadlines">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                style={{backgroundColor: "#F2F3F4"}}
                                rows={4}
                                fullWidth
                                multiline
                                label="Commentaires"
                                name="productivity.comment"
                            ></Field>
                        </Grid>
                    </Grid>
                </FormikStep>
                <FormikStep
                    label="Evaluation qualité du travail"
                    validationSchema={validationSchemaStep3}
                >
                    <Grid
                        container
                        alignItems="flex-start"
                        justify="center"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <h1>
                                Capacité de s’acquitter des tâches sous sa responsabilité en
                                s’imposant personnellement des normes de qualité
                            </h1>
                            <h1>Le stagiaire a été en mesure de :</h1>
                            <label>a - respecter les mandats qui lui ont été confiés</label>
                            <Field as="select" name="quality.followsInstruction">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="quality.followsInstruction">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>
                                b - porter attention aux détails dans la réalisation de ses
                                tâches
                            </label>
                            <Field as="select" name="quality.detailsAttention">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="quality.detailsAttention">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>
                                c - vérifier son travail, s’assurer que rien n’a été oublié
                            </label>
                            <Field as="select" name="quality.doubleChecks">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="quality.doubleChecks">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>d - rechercher des occasions de se perfectionner</label>
                            <Field as="select" name="quality.strivesForPerfection">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="quality.strivesForPerfection">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>
                                e - faire une bonne analyse des problèmes rencontrés
                            </label>
                            <Field as="select" name="quality.problemAnalysis">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="quality.problemAnalysis">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                style={{backgroundColor: "#F2F3F4"}}
                                rows={4}
                                fullWidth
                                multiline
                                label="Commentaires"
                                name="quality.comment"
                            ></Field>
                        </Grid>
                    </Grid>
                </FormikStep>
                <FormikStep
                    label="Evaluation QUALITÉS DES RELATIONS INTERPERSONNELLES"
                    validationSchema={validationSchemaStep4}
                >
                    <Grid
                        container
                        alignItems="flex-start"
                        justify="center"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <h1>
                                Capacité d’établir des interrelations harmonieuses dans son
                                milieu de travail
                            </h1>
                            <h1>Le stagiaire a été en mesure de :</h1>
                            <label>a - établir facilement des contacts avec les gens</label>
                            <Field as="select" name="relationships.connectsEasily">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="relationships.connectsEasily">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>b - contribuer activement au travail d’équipe</label>
                            <Field as="select" name="relationships.teamworkContribution">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="relationships.teamworkContribution">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>
                                c - s’adapter facilement à la culture de l’entreprise
                            </label>
                            <Field as="select" name="relationships.culturalAdaptation">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="relationships.culturalAdaptation">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>d - accepter les critiques constructives</label>
                            <Field as="select" name="relationships.acceptsCriticism">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="relationships.acceptsCriticism">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>e - être respectueux envers les gens</label>
                            <Field as="select" name="relationships.respectsOthers">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="relationships.respectsOthers">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>
                                f - Faire preuve d’écoute active en essayant de comprendre le
                                point de vue de l’autre
                            </label>
                            <Field as="select" name="relationships.activelyListens">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="relationships.activelyListens">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                style={{
                                    backgroundColor: "#F2F3F4",
                                }}
                                rows={4}
                                fullWidth
                                multiline
                                label="Commentaires"
                                name="relationships.comment"
                            ></Field>
                        </Grid>
                    </Grid>
                </FormikStep>
                <FormikStep
                    label="HABILETÉS PERSONNELLES"
                    validationSchema={validationSchemaStep5}
                >
                    <Grid
                        container
                        alignItems="flex-start"
                        justify="center"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <h1>
                                Capacité de faire preuve d’attitudes ou de comportements
                                matures et responsables
                            </h1>
                            <h1>Le stagiaire a été en mesure de :</h1>
                            <label>
                                a - démontrer de l’intérêt et de la motivation au travail
                            </label>
                            <Field as="select" name="skills.showsInterest">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="skills.showsInterest">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>b - exprimer clairement ses idées</label>
                            <Field as="select" name="skills.expressesOwnIdeas">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="skills.expressesOwnIdeas">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>c - faire preuve d’initiative</label>
                            <Field as="select" name="skills.showsInitiative">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="skills.showsInitiative">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>d - travailler de façon sécuritaire</label>
                            <Field as="select" name="skills.worksSafely">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="skills.worksSafely">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>
                                e - démontrer un bon sens des responsabilités ne requérant
                                qu’un minimum de supervision
                            </label>
                            <Field as="select" name="skills.dependable">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="skills.dependable">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label>f - être ponctuel et assidu à son travail</label>
                            <Field as="select" name="skills.puntual">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="skills.puntual">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                style={{backgroundColor: "#F2F3F4"}}
                                rows={4}
                                fullWidth
                                multiline
                                label="Commentaires"
                                name="skills.comment"
                            ></Field>
                        </Grid>
                    </Grid>
                </FormikStep>
                <FormikStep
                    label="APPRÉCIATION GLOBALE DU STAGIAIRE"
                    validationSchema={validationSchemaStep6}
                >
                    <Grid
                        container
                        alignItems="flex-start"
                        justify="center"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <label>APPRÉCIATION GLOBALE DU STAGIAIRE</label>
                            <Field as="select" name="appreciation.expectations">
                                {globalAppreciations.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name="appreciation.expectations">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>

                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                style={{backgroundColor: "#F2F3F4"}}
                                rows={4}
                                fullWidth
                                multiline
                                label="PRÉCISEZ VOTRE APPRÉCIATION:"
                                name="appreciation.comment"
                            ></Field>
                        </Grid>

                        <Grid item xs={12}>
                            <label>
                                Cette évaluation a été discutée avec le stagiaire :
                            </label>
                            <label>
                                <Field
                                    type="radio"
                                    name="appreciation.discussedWithIntern"
                                    value="Oui"
                                />
                                Oui
                            </label>
                            <label>
                                <Field
                                    type="radio"
                                    name="appreciation.discussedWithIntern"
                                    value="Non"
                                />
                                Non
                            </label>
                            <ErrorMessage name="appreciation.discussedWithIntern">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                    </Grid>
                </FormikStep>
                <FormikStep
                    label="Nombre d'heure de supervision par semaine"
                    validationSchema={validationSchemaStep7}
                >
                    <Grid
                        container
                        alignItems="flex-start"
                        justify="center"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <label>
                                Veuillez indiquer le nombre d’heures réel par semaine
                                d’encadrement accordé au stagiaire :
                            </label>
                            <Field type="number" name="feedback.weeklySupervisionHours"/>
                            <ErrorMessage name="feedback.weeklySupervisionHours">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                    </Grid>
                </FormikStep>
                <FormikStep label="Decision" validationSchema={validationSchemaStep8}>
                    <Grid
                        container
                        alignItems="flex-start"
                        justify="center"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <label>
                                L’ENTREPRISE AIMERAIT ACCUEILLIR CET ÉLÈVE POUR SON PROCHAIN
                                STAGE
                            </label>
                            <label>
                                <Field type="radio" name="feedback.hireAgain" value="Oui"/>
                                Oui
                            </label>
                            <label>
                                <Field type="radio" name="feedback.hireAgain" value="Non"/>
                                Non
                            </label>
                            <label>
                                <Field
                                    type="radio"
                                    name="feedback.hireAgain"
                                    value="Peut-être"
                                />
                                Peut-être
                            </label>
                            <ErrorMessage name="feedback.hireAgain">
                                {msg => <p className="msgError">
                                    <span style={{color: "red"}}>{msg}</span>
                                </p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                style={{backgroundColor: "#F2F3F4"}}
                                rows={4}
                                fullWidth
                                multiline
                                label="La formation technique du stagiaire était-elle suffisante pour accomplir le
                            mandat de stage?"
                                name="feedback.technicalFormationOpinion"
                            ></Field>
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                variant="outlined"
                                label="Nom :"
                                name="signature.name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="infos.supervisorRole"
                                id="supervisorRole"
                                variant="outlined"
                                label="Fonction du superviseur:"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="infos.phoneNumber"
                                id="phoneNumber"
                                variant="outlined"
                                label="Numero de telephone"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                    component={SimpleFileUpload}
                                    type={"file"}
                                    name="signature.image"
                                    id="file"
                                    variant="outlined"
                                    label="Fichier signature JPG/PNG"
                                    fullwidth
                                    required
                            />
                        </Grid>
                    </Grid>
                </FormikStep>
            </FormikStepper>
        </CardContent>
    </Card>;
}

export function FormikStep({children}) {
    return <>{children}</>
}
