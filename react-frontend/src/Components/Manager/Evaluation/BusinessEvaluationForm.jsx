import {Card, CardContent, Grid} from '@material-ui/core';
import {Field} from 'formik';
import {SimpleFileUpload, TextField} from 'formik-material-ui';
import React from 'react';
import * as yup from "yup";
import {FormikStepper} from './FormikStepper';
import {useLocation} from 'react-router-dom';


const tooShortError = value => "Doit avoir au moins " + value.min + " caractères";
const tooLongError = value => "Doit avoir moins que " + value.max + " caractères";
const tooLittleError = valueNumber => "Doit être plus grand que ou égal à " + valueNumber.min;
const tooBigError = valueNumber => "Doit être plus petit que " + valueNumber.max;
const requiredFieldMsg = "Ce champs est requis";
export default function BusinessEvalution() {
    const location = useLocation();

    const evaluationAnswers = [
        "Totalement en accord",
        "Plutôt en accord",
        "Plutôt en désaccord",
        "Totalement en désaccord",
        "N/A"
    ];

    const traineesNumber = [
        "Un stagiaire",
        "Deux stagiaires",
        "Trois stagiaires",
        "Plus de trois"
    ];

    const InternInfosValidation = yup.object().shape({
        internship: yup.string().required(requiredFieldMsg)
    });
    const EvaluationCriteriasValidation = yup.object().shape({
        evaluationCriterias: yup.object().shape({
            hoursOfWeekFirstMonth: yup.number().required().max(40, tooBigError).required(requiredFieldMsg),
            hoursOfWeekSecondMonth: yup.number().required().max(40, tooBigError).required(requiredFieldMsg),
            hoursOfWeekThirdMonth: yup.number().required().max(40, tooBigError).required(requiredFieldMsg),
            salary: yup.number().required().min(12.5, tooLittleError).required(requiredFieldMsg)
        }),
    });
    const ObservationsValidation = yup.object().shape({
        observations: yup.object().shape({
            preferedInternship: yup.string().required(requiredFieldMsg),
            welcomeSameIntern: yup.string().required(requiredFieldMsg),
            variablesQuarters: yup.string().required(requiredFieldMsg),
            startShiftsOne: yup.number().required().min(1, tooLittleError).required(requiredFieldMsg),
            startShiftsTwo: yup.number().required().min(0, tooLittleError),
            startShiftsThree: yup.number().required().min(0, tooLittleError),
            endShiftsOne: yup.number().required().min(yup.ref("startQuartersOne"), tooLittleError).required(requiredFieldMsg),
            endQuartersTwo: yup.number().required().min(yup.ref("startQuartersTwo"), tooLittleError),
            endQuartersThree: yup.number().required().min(yup.ref("startQuartersThree"), tooLittleError),
        }),
    });
    const SignatureValidation = yup.object().shape({
        signature: yup.object().shape({
            name: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
            image: yup.string().trim().min(1)
        }),
    });
    console.log(location.state)
    return <Card>
        <CardContent>
            <FormikStepper
                application={location.state}
                initialValues={{
                    internship: "",
                    evaluationCriterias: {
                        workAsAnnoncement: evaluationAnswers[0],
                        easyIntigration: evaluationAnswers[0],
                        sufficientTime: evaluationAnswers[0],
                        hoursOfWeekFirstMonth: 1,
                        hoursOfWeekSecondMonth: 1,
                        hoursOfWeekThirdMonth: 1,
                        securityWorkPlace: evaluationAnswers[0],
                        pleasantEnvironnement: evaluationAnswers[0],
                        accessiblePlace: evaluationAnswers[0],
                        goodSalary: evaluationAnswers[0],
                        salary: 12.50,
                        supervisorFacilitatesIntern: evaluationAnswers[0],
                        adequateEquipement: evaluationAnswers[0],
                        accetableWorkload: evaluationAnswers[0],
                        comment: ""
                    },
                    observations: {
                        preferedInternship: "",
                        numbersOfInterns: traineesNumber[0],
                        welcomeSameIntern: "",
                        variablesShifts: "",
                        startShiftsOne: 0,
                        startShiftsTwo: 0,
                        startShiftsThree: 0,
                        endShiftsOne: 0,
                        endShiftsTwo: 0,
                        endShiftsThree: 0,
                    },
                    signature: {
                        image: "",
                        name: ""
                    }
                }}
                evaluationAnswers={evaluationAnswers} traineesNumber={traineesNumber}>
                <FormikStep label="IDENTIFICATION DU STAGIAIRE" validationSchema={InternInfosValidation}>
                    <Grid container justify="space-between" spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="internInfos.internName"
                                id="internName"
                                variant="outlined"
                                label="Nom du stagiaire"
                                required
                                disabled
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label>Stage : </label>
                            <label style={{marginRight: "1em"}}>
                                <Field type="radio" name="internInfos.internship" id="internship"
                                       value="premier stage"/>
                                1
                            </label>
                            <label>
                                <Field type="radio" name="internInfos.internship" id="internship"
                                       value="deuxieme stage"/>
                                2
                            </label>
                        </Grid>
                    </Grid>
                </FormikStep>
                <FormikStep label="ÉVALUATION" validationSchema={EvaluationCriteriasValidation}>
                    <Grid container justify="space-between" spacing={2}>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Les tâches confiées au stagiaire sont conformes aux
                                tâches annoncées dans l’entente de stage</label>
                            <Field as="select" name="evaluationCriterias.workAsAnnoncement">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Des mesures d’accueil facilitent l’intégration du
                                nouveau stagiaire</label>
                            <Field as="select" name="evaluationCriterias.easyIntigration">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Le temps réel consacré à l’encadrement du stagiaire est
                                suffisant</label>
                            <Field as="select" name="evaluationCriterias.sufficientTime">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>L’environnement de travail respecte les normes d’hygiène
                                et de sécurité au travail</label>
                            <Field as="select" name="evaluationCriterias.securityWorkPlace">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Le climat de travail est agréable</label>
                            <Field as="select" name="evaluationCriterias.pleasantEnvironnement">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Le milieu de stage est accessible par transport en
                                commun</label>
                            <Field as="select" name="evaluationCriterias.accessiblePlace">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Le salaire offert est intéressant pour le
                                stagiaire</label>
                            <Field
                                component={TextField}
                                name="evaluationCriterias.salary"
                                id="salary"
                                variant="outlined"
                                label="Préciser : __/l’heure."
                                required
                                type={"number"}
                                style={{marginRight: "2em"}}
                                InputProps={{
                                    inputProps: {
                                        min: 12.50,
                                        step: "any"
                                    }
                                }}
                            />
                            <Field as="select" name="evaluationCriterias.goodSalary">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>La communication avec le superviseur de stage facilite
                                le déroulement du stage</label>
                            <Field as="select" name="evaluationCriterias.supervisorFacilitatesIntern">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>L’équipement fourni est adéquat pour réaliser les tâches
                                confiées</label>
                            <Field as="select" name="evaluationCriterias.adequateEquipement">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Le volume de travail est acceptable</label>
                            <Field as="select" name="evaluationCriterias.accetableWorkload">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Préciser le nombre d’heures/semaine :</label>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Field
                                component={TextField}
                                name="evaluationCriterias.hoursOfWeekFirstMonth"
                                id="hoursOfWeekFirstMonth"
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
                                name="evaluationCriterias.hoursOfWeekSecondMonth"
                                id="hoursOfWeekSecondMonth"
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
                                name="evaluationCriterias.hoursOfWeekThirdMonth"
                                id="hoursOfWeekThirdMonth"
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
                        <Grid item xs={12}>
                            <Field component={TextField} style={{
                                backgroundColor: "#F2F3F4"
                            }} rows={4} fullWidth multiline label="Commentaires" name="evaluationCriterias.comment">
                            </Field>
                        </Grid>
                    </Grid>
                </FormikStep>
                <FormikStep label="OBSERVATIONS GÉNÉRALES" validationSchema={ObservationsValidation}>
                    <Grid container justify="space-between" spacing={2}>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Ce milieu est à privilégier pour le</label>
                            <label style={{marginRight: "1em"}}>
                                <Field type="radio" name="observations.preferedInternship" value="premier stage"/>
                                Premier stage
                            </label>
                            <label>
                                <Field type="radio" name="observations.preferedInternship" value="deuxieme stage"/>
                                Deuxième stage
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Ce milieu est ouvert à accueillir</label>
                            <Field as="select" name="observations.numbersOfInterns">
                                {traineesNumber.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Ce milieu désire accueillir le même stagiaire pour un
                                prochain stage</label>
                            <label style={{marginRight: "1em"}}>
                                <Field type="radio" name="observations.welcomeSameIntern" value="yes"/>
                                oui
                            </label>
                            <label>
                                <Field type="radio" name="observations.welcomeSameIntern" value="no"/>
                                non
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Ce milieu offre des quarts de travail variables</label>
                            <label style={{marginRight: "1em"}}>
                                <Field type="radio" name="observations.variablesShifts" value="yes"/>
                                oui
                            </label>
                            <label>
                                <Field type="radio" name="observations.variablesShifts" value="no"/>
                                non
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="observations.startShiftsOne"
                                id="startShiftsOne"
                                variant="outlined"
                                label="De"
                                required
                                fullWidth
                                type={"number"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="observations.endShiftsOne"
                                id="endShiftsOne"
                                variant="outlined"
                                label="À"
                                required
                                fullWidth
                                type={"number"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="observations.startShiftsTwo"
                                id="startShiftsTwo"
                                variant="outlined"
                                label="De"
                                fullWidth
                                type={"number"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="observations.endShiftsTwo"
                                id="endShiftsTwo"
                                variant="outlined"
                                label="À"
                                fullWidth
                                type={"number"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="observations.startShiftsThree"
                                id="startShiftsThree"
                                variant="outlined"
                                label="De"
                                fullWidth
                                type={"number"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="observations.endShiftsThree"
                                id="endShiftsThree"
                                variant="outlined"
                                label="À"
                                fullWidth
                                type={"number"}
                            />
                        </Grid>
                    </Grid>
                </FormikStep>
                <FormikStep label="Signature" validationSchema={SignatureValidation}>
                    <Grid container alignItems="flex-start" justify="center" spacing={2}>
                        <Grid item xs={12}>
                            <Field component={TextField}
                                   name="signature.name"
                                   variant="outlined"
                                   label="Nom :"
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
                                label="Fichier JPG/PNG"
                                required
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </FormikStep>
            </FormikStepper>
        </CardContent>
    </Card>
}

export function FormikStep({children}) {
    return <>{children}</>;
}