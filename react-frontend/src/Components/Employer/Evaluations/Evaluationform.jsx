import {Card, CardContent, Grid, TextareaAutosize, Typography} from '@material-ui/core';
import {Field} from 'formik';
import {TextField} from 'formik-material-ui';
import {DatePicker} from 'formik-material-ui-pickers';
import React from 'react';
import * as yup from "yup";
import useStyles from '../../Utils/useStyles';
import {FormikStepper} from './FormikStepper';

const sleep = (time) => new Promise((acc) => setTimeout(acc, time));

const tooShortError = (value) =>
        "Doit avoir au moins " + value.min + " caractères";
const tooLittleError = (valueNumber) =>
        "Doit être un nombre plus grand que ou égal à " + valueNumber.min;
const tooBigError = (valueNumber) =>
        "Doit être un nombre plus petit que ou égal à " + valueNumber.max;
const requiredFieldMsg = "Ce champs est requis";

export default function Evaluationform() {
    const classes = useStyles();
    const evaluationAnswers = ["Totalementen accord", "Plutôten accord", "Plutôten désaccord", "Totalementen désaccord", "N/A"]

    const globalAppreciations = [
        "Les habiletés démontrées dépassent de beaucoup les attentes",
        "Les habiletés démontrées dépassent les attentes",
        "Les habiletés démontrées répondent pleinement aux attentes",
        "Les habiletés démontrées répondent partiellement aux attentes",
        "Les habiletés démontrées ne répondent pas aux attentes"
    ]

    const validationSchemaStep1 = yup.object().shape({
        fullname: yup.string().trim().min(5, tooShortError).required(),
        program: yup.string().trim().min(50).required(),
        entrepriseName: yup.string().trim().min(2, tooShortError).required(),
        supervisorName: yup.string().trim().min(2, tooShortError).required(),
        phoneNumber: yup.string().trim().min(10, tooShortError).required(),
        fonction: yup.string().trim().min(10, tooShortError).required()
    });

    return (
            <Card>
                <CardContent>
                    <FormikStepper
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
                                jobQualityA: evaluationAnswers[0],
                                jobQualityB: evaluationAnswers[0],
                                jobQualityC: evaluationAnswers[0],
                                jobQualityD: evaluationAnswers[0],
                                jobQualityE: evaluationAnswers[0],
                                jobQualityCommentary: "",
                                interpersonalRelationsA: evaluationAnswers[0],
                                interpersonalRelationsB: evaluationAnswers[0],
                                interpersonalRelationsC: evaluationAnswers[0],
                                interpersonalRelationsD: evaluationAnswers[0],
                                interpersonalRelationsE: evaluationAnswers[0],
                                interpersonalRelationsF: evaluationAnswers[0],
                                interpersonalCommentary: "",
                                personalSkillsA: evaluationAnswers[0],
                                personalSkillsB: evaluationAnswers[0],
                                personalSkillsC: evaluationAnswers[0],
                                personalSkillsD: evaluationAnswers[0],
                                personalSkillsE: evaluationAnswers[0],
                                personalSkillsF: evaluationAnswers[0],
                                personalSkillsCommentary: "",
                                globalAppreciation: globalAppreciations[0],
                                globalAppreciationCommentary: "",
                                discussedWithIntern: "",
                                nbHourSupervisionPerWeek: "",
                                hireInternAgainPossibility: "",
                                techincalFormationOpinion: "",
                                signature: "",
                                evaluationDate: new Date(),
                                reviewerName: "",
                                reviewerFunction: ""


                            }}
                            onSubmit={async (values) => {
                                await sleep(3000);
                                console.log('values', values);
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
                        <FormikStep label="Evaluation productivité">
                            <Grid container spacing={2}>
                                <Grid item xs={12} spacing={2} justify="space-between">
                                    <h1>Capacité d’optimiser son rendement au travail</h1>
                                    <h1>Le stagiaire a été en mesure de :</h1>
                                    <label>a - planifier et organiser son travail de façon efficace</label>
                                    <Field as="select" name="productivtyA">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                                <Grid item xs={12}>
                                    <label style={{marginRight: "2em"}}>b - comprendre rapidement les directives
                                        relatives à son travail</label>
                                    <Field as="select" name="productivityB">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                                    <Grid item xs={12}>
                                        <label style={{marginRight: "2em"}}>c - maintenir un rythme de travail
                                            soutenu</label>
                                        <Field as="select" name="productivtyC">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                <Grid item xs={12}>
                                    <label style={{marginRight: "2em"}}>d - établir ses priorités</label>
                                    <Field as="select" name="productivityD">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                                <Grid item xs={12}>
                                    <label style={{marginRight: "2em"}}>e - respecter ses échéanciers</label>
                                    <Field as="select" name="productivityE">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                                <Grid item xs={12}>
                                    <Field component={TextField} style={{
                                        backgroundColor: "#F2F3F4"
                                    }} rows={4} fullWidth multiline label="Commentaires" name="productivityCommentary">

                                    </Field>
                                </Grid>

                            </Grid>
                        </FormikStep>
                        <FormikStep label="Evaluation qualité du travail">
                            <Grid container alignItems="start" justify="center" spacing={2}>
                                <Grid item xs={12}>
                                    <h1>Capacité de s’acquitter des tâches sous sa responsabilité en s’imposant
                                        personnellement des normes de qualité</h1>
                                    <h1>Le stagiaire a été en mesure de :</h1>
                                    <label>a - respecter les mandats qui lui ont été confiés</label>
                                    <Field as="select" name="jobQualityA">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                                    <Grid item xs={12}>
                                        <label>b - porter attention aux détails dans la réalisation de ses
                                            tâches</label>
                                        <Field as="select" name="jobQualityB">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>c - vérifier son travail, s’assurer que rien n’a été oublié</label>
                                        <Field as="select" name="jobQualityC">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>d - rechercher des occasions de se perfectionner</label>
                                        <Field as="select" name="jobQualityD">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>e - faire une bonne analyse des problèmes rencontrés</label>
                                        <Field as="select" name="jobQualityE">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                <Grid item xs={12}>
                                    <Field component="TextArea" label="Commentaires" name="jobQualityCommentary">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                            </Grid>
                        </FormikStep>
                        <FormikStep label="Evaluation QUALITÉS DES RELATIONS INTERPERSONNELLES">
                            <Grid container alignItems="start" justify="center" spacing={2}>
                                <Grid item xs={12}>
                                    <h1>Capacité d’établir des interrelations harmonieuses dans son milieu de
                                        travail</h1>
                                    <h1>Le stagiaire a été en mesure de :</h1>
                                    <label>a - établir facilement des contacts avec les gens</label>
                                    <Field as="select" name="interpersonalRelationsA">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                                    <Grid item xs={12}>
                                        <label>b - contribuer activement au travail d’équipe</label>
                                        <Field as="select" name="interpersonalRelationsB">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>c - s’adapter facilement à la culture de l’entreprise</label>
                                        <Field as="select" name="interpersonalRelationsC">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}
                                            </option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>d - accepter les critiques constructives</label>
                                        <Field as="select" name="interpersonalRelationsD">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>e - être respectueux envers les gens</label>
                                        <Field as="select" name="interpersonalRelationsE">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>f - Faire preuve d’écoute active en essayant de comprendre le point de
                                            vue de
                                            l’autre</label>
                                        <Field as="select" name="interpersonalRelationsF">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                <Grid item xs={12}>
                                    <label>Commentaires</label>
                                    <Field as="TextArea" name="interpersonalCommentary">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                            </Grid>
                        </FormikStep>
                        <FormikStep label="HABILETÉS PERSONNELLES"
                        >
                            <Grid container alignItems="start" justify="center" spacing={2}>
                                <Grid item xs={12}>
                                    <h1>Capacité de faire preuve d’attitudes ou de comportements matures et
                                        responsables</h1>
                                    <h1>Le stagiaire a été en mesure de :</h1>
                                    <label>a - démontrer de l’intérêt et de la motivation au travail</label>
                                    <Field as="select" name="personalSkillsA">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                                    <Grid item xs={12}>
                                        <label>b - exprimer clairement ses idées</label>
                                        <Field as="select" name="personalSkillsB">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>c - faire preuve d’initiative</label>
                                        <Field as="select" name="personalSkillsC">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}
                                            </option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>d - travailler de façon sécuritaire</label>
                                        <Field as="select" name="personalSkillsD">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label>e - démontrer un bon sens des responsabilités ne requérant qu’un minimum
                                            de
                                            supervision</label>
                                        <Field as="select" name="personalSkillsE">
                                            {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                        </Field>
                                    </Grid>

                                <Grid item xs={12}>
                                    <label>f - être ponctuel et assidu à son travail</label>
                                    <Field as="select" name="personalSkillsF">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                                <Grid item xs={12}>
                                    <label>Commentaires</label>
                                    <Field as="TextArea" name="personalSkillsCommentary">
                                        {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>

                            </Grid>
                        </FormikStep>
                        <FormikStep label="APPRÉCIATION GLOBALE DU STAGIAIRE">
                            <Grid container alignItems="start" justify="center" spacing={2}>
                                <Grid item xs={12}>
                                    <label>APPRÉCIATION GLOBALE DU STAGIAIRE</label>
                                    <Field as="select" name="globalAppreciation">
                                        {globalAppreciations.map((e, k) => <option key={k}>{e}</option>)}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <label>PRÉCISEZ VOTRE APPRÉCIATION:</label>
                                    <Field as="TextArea" name="globalAppreciationCommentary">
                                    </Field>
                                </Grid>

                                <Grid item xs={12}>
                                    <label>Cette évaluation a été discutée avec le stagiaire :</label>
                                    <label>
                                        <Field type="radio" name="discussedWithIntern" value="One"/>
                                        Oui
                                    </label>
                                    <label>
                                        <Field type="radio" name="discussedWithIntern" value="Two"/>
                                        Non
                                    </label>

                                </Grid>

                            </Grid>
                        </FormikStep>
                        <FormikStep label="Nombre d'heure de supervision par semaine">
                            <Grid container alignItems="start" justify="center" spacing={2}>
                                <Grid item xs={12}>
                                    <label>Veuillez indiquer le nombre d’heures réel par semaine d’encadrement accordé
                                        au stagiaire :</label>
                                    <Field type="number" name="nbHourSupervisionPerWeek"/>

                                </Grid>
                            </Grid>
                        </FormikStep>
                        <FormikStep label="Decision">
                            <Grid container alignItems="start" justify="center" spacing={2}>
                                <Grid item xs={12}>
                                    <label>L’ENTREPRISE AIMERAIT ACCUEILLIR CET ÉLÈVE POUR SON PROCHAIN STAGE</label>
                                    <label>
                                        <Field type="radio" name="hireInternAgainPossibility" value="Oui"/>
                                        Oui
                                    </label>
                                    <label>
                                        <Field type="radio" name="hireInternAgainPossibility" value="Non"/>
                                        Non
                                    </label>
                                    <label>
                                        <Field type="radio" name="hireInternAgainPossibility" value="Peut-être"/>
                                        Peut-être
                                    </label>
                                </Grid>

                                <Grid item xs={12}>
                                    <label>La formation technique du stagiaire était-elle suffisante pour accomplir le
                                        mandat de stage?</label>
                                    <Field component={TextareaAutosize} row="10" column="10"
                                           name="techincalFormationOpinion"/>
                                </Grid>

                                <Grid item xs={12}>
                                    <Field component={TextField} variant="outlined" label="Nom :" name="reviewerName"/>
                                </Grid>

                                <Grid item xs={12}>
                                    <Field component={TextField} variant="outlined" label="fonction"
                                           name="reviewerFunction"/>
                                </Grid>

                                <Grid item xs={12}>
                                    <label>signature</label>
                                    <Field component={TextField} name="signature"/>
                                </Grid>

                                <Grid item xs={12}>
                                    <Field component={DatePicker}
                                           label="Date limite pour appliquer"
                                           format="MM/dd/yyyy"
                                           name="Date d'évaluation"/>
                                </Grid>
                            </Grid>
                        </FormikStep>
                        <FormikStep label="Retour formulaire">
                            <Grid container alignItems="start" justify="center" spacing={2}>

                                <Grid item xs={12}>
                                    {<pre style={{display: "inline-block"}}>{`
                                                Veuillez retourner ce formulaire à : Patrice Brodeur     
                                                Cégep André-Laurendeau   
                                                1111, rue Lapierre
                                                LASALLE (Québec)
                                                H8N 2J4
                                                Numéro de télécopieur : (514) 364-7130
                                    `}</pre>}
                                </Grid>
                            </Grid>
                        </FormikStep>

                    </FormikStepper>
                </CardContent>
            </Card>
    );
}

export function FormikStep({children}) {
    return <>{children}</>;
}

