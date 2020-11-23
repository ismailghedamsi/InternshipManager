import {Card, CardContent, Grid} from "@material-ui/core"
import {ErrorMessage, Field} from "formik"
import {SimpleFileUpload, TextField} from "formik-material-ui"
import React, {useState} from "react"
import {useLocation} from "react-router-dom"
import * as yup from "yup"
import {FormikStepper} from "../../Utils/FormikStepper"

const tooLittleError = valueNumber => "Doit être plus grand que ou égal à " + valueNumber.min
const tooBigError = valueNumber => "Doit être plus petit que " + valueNumber.max
const requiredFieldMsg = "Ce champs est requis"
const requiredRadioMsg = "Cliquez votre choix"
const requiredSelectMsg = "Option séléctionné invalide"
export default function BusinessEvalution() {
    const location = useLocation()
    const [variableShifts, setVariableShifts] = useState(true)

    const evaluationAnswers = [
        "Totalement en accord",
        "Plutôt en accord",
        "Plutôt en désaccord",
        "Totalement en désaccord",
        "N/A"
    ]

    const traineesNumber = [
        "Un stagiaire",
        "Deux stagiaires",
        "Trois stagiaires",
        "Plus de trois"
    ]

    const EvaluationCriteriasValidation = yup.object().shape({
        evaluationCriterias: yup.object().shape({
            internshipCount: yup.string().required(requiredRadioMsg),
            hoursOfWeekFirstMonth: yup.number().required().min(1, tooLittleError).max(100, tooBigError).required(requiredFieldMsg),
            hoursOfWeekSecondMonth: yup.number().required().min(1, tooLittleError).max(100, tooBigError).required(requiredFieldMsg),
            hoursOfWeekThirdMonth: yup.number().required().min(1, tooLittleError).max(100, tooBigError).required(requiredFieldMsg),
            workAsAnnoncement: yup.string().oneOf(evaluationAnswers, requiredSelectMsg).required(),
            easyIntigration: yup.string().oneOf(evaluationAnswers, requiredSelectMsg).required(),
            sufficientTime: yup.string().oneOf(evaluationAnswers, requiredSelectMsg).required(),
            securityWorkPlace: yup.string().oneOf(evaluationAnswers, requiredSelectMsg).required(),
            pleasantEnvironnement: yup.string().oneOf(evaluationAnswers, requiredSelectMsg).required(),
            accessiblePlace: yup.string().oneOf(evaluationAnswers, requiredSelectMsg).required(),
            goodSalary: yup.string().oneOf(evaluationAnswers, requiredSelectMsg).required(),
            supervisorFacilitatesIntern: yup.string().oneOf(evaluationAnswers, requiredSelectMsg).required(),
            adequateEquipement: yup.string().oneOf(evaluationAnswers, requiredSelectMsg).required(),
            accetableWorkload: yup.string().oneOf(evaluationAnswers, requiredSelectMsg).required()
        })
    })

    const ObservationsValidation = yup.object().shape({
        observations: yup.object().shape({
            preferedInternship: yup.string().required(requiredRadioMsg),
            welcomeSameIntern: yup.string().required(requiredRadioMsg),
            variablesShifts: yup.string().required(requiredRadioMsg),
            startShiftsOne: yup.number().required().min(0, tooLittleError).max(23, tooBigError).required(requiredFieldMsg),
            startShiftsTwo: yup.number().required().min(0, tooLittleError).max(23, tooBigError),
            startShiftsThree: yup.number().required().min(0, tooLittleError).max(23, tooBigError),
            endShiftsOne: yup.number().required().min(0, tooLittleError).max(23, tooBigError).required(requiredFieldMsg),
            endShiftsTwo: yup.number().required().min(0, tooLittleError).max(23, tooBigError),
            endShiftsThree: yup.number().required().min(0, tooLittleError).max(23, tooBigError),
            numbersOfInterns: yup.string().oneOf(traineesNumber, requiredSelectMsg).required()
        })
    })

    const SignatureValidation = yup.object().shape({
        signature: yup.object().shape({
            name: yup.string().trim().min(2, "Doit avoir au moins 2 caractères").max(255, "Doit avoir moins que 255 caractères").required(requiredFieldMsg)
        })
    })

    return <Card style={{overflow: "auto", height: "auto"}}>
        <CardContent>
            <FormikStepper
                contract={location.state}
                initialValues={{
                    evaluationCriterias: {
                        internshipCount: "",
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
                        endShiftsThree: 0
                    },
                    signature: {
                        image: "",
                        name: location.state.admin.name,
                        date: new Date()
                    }
                }}
                evaluationAnswers={evaluationAnswers} traineesNumber={traineesNumber}>
                <FormikStep label="Évaluation" validationSchema={EvaluationCriteriasValidation}>
                    <Grid container justify="space-between" spacing={2}>
                        <Grid item xs={12}>
                            <label>Stage : </label>
                            <Field
                                type="radio"
                                name="evaluationCriterias.internshipCount"
                                id="internship"
                                value="Premier stage"
                            />
                            <label style={{marginRight: "1em"}}>Premier stage</label>
                            <Field
                                type="radio"
                                name="evaluationCriterias.internshipCount"
                                id="internship"
                                value="Deuxieme stage"
                            />
                            <label>Deuxième stage</label>
                            <ErrorMessage name={"evaluationCriterias.internshipCount"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>
                                Les tâches confiées au stagiaire sont conformes aux tâches annoncées dans l’entente de
                                stage
                            </label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field
                                as="select"
                                align="start"
                                name="evaluationCriterias.workAsAnnoncement"
                            >
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"evaluationCriterias.workAsAnnoncement"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>Des mesures d’accueil facilitent l’intégration du
                                nouveau stagiaire</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field as="select" name="evaluationCriterias.easyIntigration">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"evaluationCriterias.easyIntigration"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>Le temps réel consacré à l’encadrement du stagiaire est
                                suffisant</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field as="select" name="evaluationCriterias.sufficientTime">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"evaluationCriterias.sufficientTime"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>L’environnement de travail respecte les normes
                                d’hygiène
                                et de sécurité au travail</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field as="select" name="evaluationCriterias.securityWorkPlace">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"evaluationCriterias.securityWorkPlace"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>Le climat de travail est agréable</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field as="select" name="evaluationCriterias.pleasantEnvironnement">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"evaluationCriterias.pleasantEnvironnement"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>Le milieu de stage est accessible par transport en
                                commun</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field as="select" name="evaluationCriterias.accessiblePlace">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"evaluationCriterias.accessiblePlace"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>Le salaire offert est intéressant pour le
                                stagiaire</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field as="select" name="evaluationCriterias.goodSalary">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"evaluationCriterias.goodSalary"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="evaluationCriterias.salary"
                                id="salary"
                                variant="outlined"
                                label="Préciser le taux horaire."
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
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>La communication avec le superviseur de stage facilite
                                le déroulement du stage</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field as="select" name="evaluationCriterias.supervisorFacilitatesIntern">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"evaluationCriterias.supervisorFacilitatesIntern"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>L’équipement fourni est adéquat pour réaliser les
                                tâches
                                confiées</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field as="select" name="evaluationCriterias.adequateEquipement">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"evaluationCriterias.adequateEquipement"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>Le volume de travail est acceptable</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field as="select" name="evaluationCriterias.accetableWorkload">
                                {evaluationAnswers.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"evaluationCriterias.accetableWorkload"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={12}>
                            <label style={{marginRight: "2em"}}>Préciser le nom d'heure par semaine :</label>
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
                <FormikStep label="Observations générales" validationSchema={ObservationsValidation}>
                    <Grid container justify="space-between" spacing={2}>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>Ce milieu est à privilégier pour le</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field type="radio" name="observations.preferedInternship" value="Premier stage"/>
                            <label style={{marginRight: "1em"}}>Premier stage</label>
                            <Field type="radio" name="observations.preferedInternship" value="Deuxieme stage"/>
                            <label>Deuxième stage</label>
                            <ErrorMessage name={"observations.preferedInternship"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>Ce milieu est ouvert à accueillir</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field as="select" name="observations.numbersOfInterns">
                                {traineesNumber.map((e, k) => <option key={k}>{e}</option>)}
                            </Field>
                            <ErrorMessage name={"observations.numbersOfInterns"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>Ce milieu désire accueillir le même stagiaire pour un
                                prochain stage</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field type="radio" name="observations.welcomeSameIntern" value="Oui"/>
                            <label style={{marginRight: "1em"}}>Oui</label>
                            <Field type="radio" name="observations.welcomeSameIntern" value="Non"/>
                            <label>Non</label>
                            <ErrorMessage name={"observations.welcomeSameIntern"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
                        </Grid>
                        <Grid item xs={8}>
                            <label style={{marginRight: "2em"}}>Ce milieu offre des quarts de travail
                                variables</label>
                        </Grid>
                        <Grid item xs={4}>
                            <Field type="radio"
                                   name="observations.variablesShifts"
                                   value="Oui"
                                   onClick={() => setVariableShifts(true)}
                            />
                            <label style={{marginRight: "1em"}}>Oui</label>
                            <Field type="radio"
                                   name="observations.variablesShifts"
                                   value="Non"
                                   onClick={() => setVariableShifts(false)}
                            />
                            <label>Non</label>
                            <ErrorMessage name={"observations.variablesShifts"}>
                                {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span></p>}
                            </ErrorMessage>
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
                        {variableShifts && <>
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
                        </>
                        }
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
                                   disabled
                                   fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
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
    return <>{children}</>
}