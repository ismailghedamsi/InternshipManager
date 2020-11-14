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

    const BusinessInfosValidation = yup.object().shape({
        businessInfos: yup.object().shape({
            companyName: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
            employerName: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
            address: yup.string().trim().min(5, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
            phone: yup.string().trim().min(10, tooLittleError).max(10, tooBigError).required(requiredFieldMsg),
            city: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
            fax: yup.string().trim().min(7, tooLittleError).max(10, tooBigError),
            postalCode: yup.string().trim().min(6, tooShortError).max(6, tooLongError).required(requiredFieldMsg)
        }),
    });
    const InternInfosValidation = yup.object().shape({
        internInfos: yup.object().shape({
            internName: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
            internship: yup.string().required(requiredFieldMsg)
        }),
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
            whichInternship: yup.string().required(requiredFieldMsg),
            welcomeSameIntern: yup.string().required(requiredFieldMsg),
            variablesQuarters: yup.string().required(requiredFieldMsg),
            startQuartersOne: yup.number().required().min(1, tooLittleError).required(requiredFieldMsg),
            startQuartersTwo: yup.number().required().min(0, tooLittleError),
            startQuartersThree: yup.number().required().min(0, tooLittleError),
            endQuartersOne: yup.number().required().min(yup.ref("startQuartersOne"), tooLittleError).required(requiredFieldMsg),
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
                    businessInfos: {
                        companyName: "",
                        employerName: "",
                        address: "",
                        phone: "",
                        city: "",
                        fax: "",
                        postalCode: ""
                    },
                    internInfos: {
                        internName: location.state.student.firstName + " " + location.state.student.lastName,
                        internship: ""
                    },
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
                        whichInternship: "",
                        numbersOfInterns: traineesNumber[0],
                        welcomeSameIntern: "",
                        variablesQuarters: "",
                        startQuartersOne: 0,
                        startQuartersTwo: 0,
                        startQuartersThree: 0,
                        endQuartersOne: 0,
                        endQuartersTwo: 0,
                        endQuartersThree: 0,
                    },
                    signature: {
                        image: "",
                        name: ""
                    }
                }}
                evaluationAnswers={evaluationAnswers} traineesNumber={traineesNumber}>
                <FormikStep label="IDENTIFICATION DE L’ENTREPRISE" validationSchema={BusinessInfosValidation}>
                    <Grid container alignItems="flex-start" justify="center" spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="businessInfos.companyName"
                                id="companyName"
                                variant="outlined"
                                label="Nom de l’entreprise"
                                required
                                autoFocus
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="businessInfos.employerName"
                                id="employerName"
                                variant="outlined"
                                label="Personne contact"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="businessInfos.address"
                                id="address"
                                variant="outlined"
                                label="Adresse"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="businessInfos.phone"
                                id="phone"
                                variant="outlined"
                                label="Téléphone"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="businessInfos.city"
                                id="city"
                                variant="outlined"
                                label="Ville"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="businessInfos.fax"
                                id="fax"
                                variant="outlined"
                                label="Télécopieur"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="businessInfos.postalCode"
                                id="postalCode"
                                variant="outlined"
                                label="Code postal"
                                required
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </FormikStep>
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
                                <Field type="radio" name="observations.whichInternship" value="premier stage"/>
                                Premier stage
                            </label>
                            <label>
                                <Field type="radio" name="observations.whichInternship" value="deuxieme stage"/>
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
                                <Field type="radio" name="observations.variablesQuarters" value="yes"/>
                                oui
                            </label>
                            <label>
                                <Field type="radio" name="observations.variablesQuarters" value="no"/>
                                non
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="observations.startQuartersOne"
                                id="startQuartersOne"
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
                                name="observations.endQuartersOne"
                                id="endQuartersOne"
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
                                name="observations.startQuartersTwo"
                                id="startQuartersTwo"
                                variant="outlined"
                                label="De"
                                fullWidth
                                type={"number"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="observations.endQuartersTwo"
                                id="endQuartersTwo"
                                variant="outlined"
                                label="À"
                                fullWidth
                                type={"number"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="observations.startQuartersThree"
                                id="startQuartersThree"
                                variant="outlined"
                                label="De"
                                fullWidth
                                type={"number"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={TextField}
                                name="observations.endQuartersThree"
                                id="endQuartersThree"
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