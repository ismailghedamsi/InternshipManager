import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {useApi} from "../../Utils/Hooks";
import useStyles from "../../Utils/useStyles";

export default function BusinessEvaluationList() {
    const classes = useStyles();
    const api = useApi();
    const [businessEvaluations, setBusinessEvaluations] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        api.get("/businessEvaluation")
            .then(r => setBusinessEvaluations(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function deleteBusinessEvaluation(index) {
        const nextState = [...businessEvaluations];
        return api.delete("/businessEvaluation/" + nextState[index].id)
            .then(() => {
                nextState.splice(index, 1)
                setBusinessEvaluations(nextState)
            })
    }

    return <Grid
        container
        spacing={2}
        className={classes.main}>
        <Grid item xs={5} className={classes.list}>
            <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                Liste d'évaluation entreprise
            </Typography>
            {businessEvaluations.map((item, i) =>
                <div key={i}>
                    <button
                        type={"button"}
                        className={classes.linkButton}
                        onClick={() => deleteBusinessEvaluation(i)}>
                        <i className="fa fa-trash" style={{color: "red"}}/>
                    </button>
                    <button
                        type={"button"}
                        className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                        onClick={() => {
                            setCurrentIndex(i);
                        }}>
                        <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                            {businessEvaluations[i].contract.admin.name}
                        </Typography>
                    </button>
                    {currentIndex === i &&
                    <div>
                        {businessEvaluations[i].contract.studentApplication.offer.employer.companyName} - {businessEvaluations[i].contract.studentApplication.offer.employer.contactName}
                    </div>
                    }
                    <hr/>
                </div>
            )}
        </Grid>
        <Grid item xs={7} align="start" style={{overflow: "auto", height: "100%"}}>
            <div>
                {businessEvaluations.map((item, i) =>
                    <div key={i}>
                        {currentIndex === i &&
                        <div>
                            <Typography variant="h4">
                                ÉVALUATION DU MILIEU DE STAGE
                            </Typography>
                            <br/>
                            <Typography variant="h5">
                                IDENTIFICATION DE L’ENTREPRISE
                            </Typography>
                            <Typography>
                                <strong
                                    style={{"color": "blue"}}>Nom de
                                    l’entreprise:</strong> {businessEvaluations[i].contract.studentApplication.offer.employer.companyName}
                            </Typography>
                            <Typography>
                                <strong
                                    style={{"color": "blue"}}>Personne
                                    contact:</strong> {businessEvaluations[i].contract.studentApplication.offer.employer.contactName}
                            </Typography>
                            <Typography>
                                <strong
                                    style={{"color": "blue"}}>Adresse:</strong> {businessEvaluations[i].contract.studentApplication.offer.employer.address}
                            </Typography>
                            <Typography>
                                <strong
                                    style={{"color": "blue"}}>email:</strong> {businessEvaluations[i].contract.studentApplication.offer.employer.email}
                            </Typography>
                            <Typography>
                                <strong
                                    style={{"color": "blue"}}>Téléphone:</strong> {businessEvaluations[i].contract.studentApplication.offer.employer.phoneNumber}
                            </Typography>
                            <hr/>
                            <Typography variant="h5">
                                IDENTIFICATION DU STAGIAIRE
                            </Typography>
                            <Typography>
                                <strong
                                    style={{"color": "blue"}}>Nom du stagiaire:
                                </strong> {businessEvaluations[i].contract.studentApplication.student.firstName} {businessEvaluations[i].contract.studentApplication.student.lastName}
                            </Typography>
                            <Typography>
                                <strong
                                    style={{"color": "blue"}}>Date du stage:
                                </strong> {businessEvaluations[i].contract.studentApplication.offer.details.internshipStartDate}
                            </Typography>
                            <Typography>
                                <strong
                                    style={{"color": "blue"}}>Stage:</strong> {businessEvaluations[i].evaluationCriterias.internshipCount}
                            </Typography>
                            <hr/>
                            <Typography variant="h5">
                                ÉVALUATION
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>Les tâches confiées au stagiaire sont conformes aux
                                    tâches
                                    annoncées dans l’entente de
                                    stage:</strong> {businessEvaluations[i].evaluationCriterias.workAsAnnoncement}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>Des mesures d’accueil facilitent l’intégration du
                                    nouveau
                                    stagiaire:</strong> {businessEvaluations[i].evaluationCriterias.easyIntigration}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>Le temps réel consacré à l’encadrement du stagiaire
                                    est
                                    suffisant:</strong> {businessEvaluations[i].evaluationCriterias.sufficientTime}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>L’environnement de travail respecte les normes
                                    d’hygiène et de
                                    sécurité au
                                    travail:</strong> {businessEvaluations[i].evaluationCriterias.securityWorkPlace}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>Le climat de travail est
                                    agréable:</strong> {businessEvaluations[i].evaluationCriterias.pleasantEnvironnement}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>Le milieu de stage est accessible par transport en
                                    commun:</strong> {businessEvaluations[i].evaluationCriterias.accessiblePlace}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>Le salaire
                                    offert {businessEvaluations[i].evaluationCriterias.salary} est
                                    intéressant pour le
                                    stagiaire:</strong> {businessEvaluations[i].evaluationCriterias.goodSalary}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>La communication avec le superviseur de stage facilite
                                    le
                                    déroulement du
                                    stage:</strong> {businessEvaluations[i].evaluationCriterias.supervisorFacilitatesIntern}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>L’équipement fourni est adéquat pour réaliser les
                                    tâches
                                    confiées:</strong> {businessEvaluations[i].evaluationCriterias.adequateEquipement}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>Le volume de travail est
                                    acceptable:</strong> {businessEvaluations[i].evaluationCriterias.accetableWorkload}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>Préciser le nombre d’heures/semaine: </strong>
                                Premier mois: {businessEvaluations[i].evaluationCriterias.hoursOfWeekFirstMonth}h.
                                Deuxième mois: {businessEvaluations[i].evaluationCriterias.hoursOfWeekFirstMonth}h.
                                Troisième mois: {businessEvaluations[i].evaluationCriterias.hoursOfWeekFirstMonth}h.
                            </Typography>
                            <Typography>
                                <strong
                                    style={{"color": "blue"}}>Commentaires:</strong> {businessEvaluations[i].evaluationCriterias.comment}
                            </Typography>
                            <hr/>
                            <Typography variant="h5">
                                OBSERVATIONS GÉNÉRALES
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>
                                    Ce milieu est à privilégier pour le:
                                </strong> {businessEvaluations[i].observations.preferedInternship}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>
                                    Ce milieu est ouvert à accueillir:
                                </strong> {businessEvaluations[i].observations.numbersOfInterns}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>
                                    Ce milieu désire accueillir le même stagiaire pour un prochain stage:
                                </strong> {businessEvaluations[i].observations.welcomeSameIntern}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>
                                    Ce milieu offre des quarts de travail variables:
                                </strong> {businessEvaluations[i].observations.variablesShifts}.
                                De {businessEvaluations[i].observations.startShiftsOne}h
                                à {businessEvaluations[i].observations.endShiftsOne}h
                                De {businessEvaluations[i].observations.startShiftsTwo}h
                                à {businessEvaluations[i].observations.endShiftsTwo}h
                                De {businessEvaluations[i].observations.startShiftsThree}h
                                à {businessEvaluations[i].observations.endShiftsThree}h
                            </Typography>
                            <hr/>
                            <Typography variant="h5">
                                Signature du gestionnaire du stage
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>
                                    Signature de l’enseignant responsable:
                                </strong> {businessEvaluations[i].signature.name}
                            </Typography>
                            <Typography>
                                <strong style={{"color": "blue"}}>
                                    Date:
                                </strong> {businessEvaluations[i].signature.date}
                            </Typography>
                            <Typography>
                                <img src={businessEvaluations[i].signature.image} alt="signature"/>
                            </Typography>
                        </div>
                        }
                    </div>
                )}
            </div>
        </Grid>
    </Grid>
}