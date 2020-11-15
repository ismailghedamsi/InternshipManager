import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import Typography from "@material-ui/core/Typography";
import useStyles from "../../Utils/useStyles";
import {useFileReader} from "../../Utils/Hooks";

export default function BusinessEvaluationModal({isOpen, data, hide}) {
    const classes = useStyles();
    const readFile = useFileReader()

    async function changerFile() {
        data.signature.image = await readFile(data.signature.image);
    }

    return <Dialog open={isOpen} onClose={hide} fullWidth={true} fullScreen={true} maxWidth={'md'}>
        <DialogTitle id="alert-dialog-title">{"ÉVALUATION DU MILIEU DE STAGE"}</DialogTitle>
        <DialogContent>
            {data ?
                <div>
                    <Typography variant="h5">
                        ÉVALUATION
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>Stage:</strong> {data.evaluationCriterias.internshipCount}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>Les tâches confiées au stagiaire sont conformes aux tâches
                            annoncées dans l’entente de
                            stage:</strong> {data.evaluationCriterias.workAsAnnoncement}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>Des mesures d’accueil facilitent l’intégration du nouveau
                            stagiaire:</strong> {data.evaluationCriterias.easyIntigration}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>Le temps réel consacré à l’encadrement du stagiaire est
                            suffisant:</strong> {data.evaluationCriterias.sufficientTime}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>L’environnement de travail respecte les normes d’hygiène et de
                            sécurité au
                            travail:</strong> {data.evaluationCriterias.securityWorkPlace}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>Le climat de travail est
                            agréable:</strong> {data.evaluationCriterias.pleasantEnvironnement}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>Le milieu de stage est accessible par transport en
                            commun:</strong> {data.evaluationCriterias.accessiblePlace}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>Le salaire offert {data.evaluationCriterias.salary} est
                            intéressant pour le
                            stagiaire:</strong> {data.evaluationCriterias.goodSalary}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>La communication avec le superviseur de stage facilite le
                            déroulement du
                            stage:</strong> {data.evaluationCriterias.supervisorFacilitatesIntern}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>L’équipement fourni est adéquat pour réaliser les tâches
                            confiées:</strong> {data.evaluationCriterias.adequateEquipement}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>Le volume de travail est
                            acceptable:</strong> {data.evaluationCriterias.accetableWorkload}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>Préciser le nombre d’heures/semaine: </strong>
                        Premier mois: {data.evaluationCriterias.hoursOfWeekFirstMonth}h.
                        Deuxième mois: {data.evaluationCriterias.hoursOfWeekFirstMonth}h.
                        Troisième mois: {data.evaluationCriterias.hoursOfWeekFirstMonth}h.
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>Commentaires:</strong> {data.evaluationCriterias.comment}
                    </Typography>
                    <br/>
                    <Typography variant="h5">
                        OBSERVATIONS GÉNÉRALES
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>
                            Ce milieu est à privilégier pour le:
                        </strong> {data.observations.preferedInternship}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>
                            Ce milieu est ouvert à accueillir:
                        </strong> {data.observations.numbersOfInterns}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>
                            Ce milieu désire accueillir le même stagiaire pour un prochain stage:
                        </strong> {data.observations.welcomeSameIntern}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>
                            Ce milieu offre des quarts de travail variables:
                        </strong> {data.observations.variablesShifts}.
                        De {data.observations.startShiftsOne}h à {data.observations.endShiftsOne}h
                        De {data.observations.startShiftsTwo}h à {data.observations.endShiftsTwo}h
                        De {data.observations.startShiftsThree}h à {data.observations.endShiftsThree}h
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>
                            Signature de l’enseignant responsable:
                        </strong> {data.signature.name}
                    </Typography>
                    <Typography>
                        <strong style={{"color": "blue"}}>
                            Date:
                        </strong> {data.signature.date}
                    </Typography>
                </div>
                : ""
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={hide} className={classes.approuvalButton}>
                J'ai compris
            </Button>
        </DialogActions>
    </Dialog>
}
