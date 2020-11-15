import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import React from "react";
import useStyles from "../../Utils/useStyles";

export default function BusinessEvaluationModal({isOpen, data, hide}) {
    const classes = useStyles();

    return <Dialog open={isOpen} onClose={hide} fullWidth={true} fullScreen={true} maxWidth={'md'}>
        <DialogTitle id="alert-dialog-title">{"ÉVALUATION DU MILIEU DE STAGE"}</DialogTitle>
        <DialogContent>
            {data ? <div>
                <div className={classes.evaluationSections}>
                    <Typography variant="h5">
                        ÉVALUATION
                    </Typography>
                    <Typography>
                        <span
                            className={classes.evaluationCriterias}>Stage:</span> {data.evaluationCriterias.internshipCount}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>Les tâches confiées au stagiaire sont conformes aux tâches
                            annoncées dans l’entente de
                            stage:</span> {data.evaluationCriterias.workAsAnnoncement}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>Des mesures d’accueil facilitent l’intégration du nouveau
                            stagiaire:</span> {data.evaluationCriterias.easyIntigration}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>Le temps réel consacré à l’encadrement du stagiaire est
                            suffisant:</span> {data.evaluationCriterias.sufficientTime}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>L’environnement de travail respecte les normes d’hygiène et de
                            sécurité au
                            travail:</span> {data.evaluationCriterias.securityWorkPlace}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>Le climat de travail est
                            agréable:</span> {data.evaluationCriterias.pleasantEnvironnement}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>Le milieu de stage est accessible par transport en
                            commun:</span> {data.evaluationCriterias.accessiblePlace}
                    </Typography>
                    <Typography>
                        <span
                            className={classes.evaluationCriterias}>Le salaire offert {data.evaluationCriterias.salary} est
                            intéressant pour le
                            stagiaire:</span> {data.evaluationCriterias.goodSalary}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>La communication avec le superviseur de stage facilite le
                            déroulement du
                            stage:</span> {data.evaluationCriterias.supervisorFacilitatesIntern}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>L’équipement fourni est adéquat pour réaliser les tâches
                            confiées:</span> {data.evaluationCriterias.adequateEquipement}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>Le volume de travail est
                            acceptable:</span> {data.evaluationCriterias.accetableWorkload}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>Préciser le nombre d’heures/semaine: </span>
                        Premier mois: {data.evaluationCriterias.hoursOfWeekFirstMonth}h.
                        Deuxième mois: {data.evaluationCriterias.hoursOfWeekFirstMonth}h.
                        Troisième mois: {data.evaluationCriterias.hoursOfWeekFirstMonth}h.
                    </Typography>
                    <Typography>
                        <span
                            className={classes.evaluationCriterias}>Commentaires:</span> {data.evaluationCriterias.comment}
                    </Typography>
                </div>
                <div className={classes.evaluationSections}>
                    <Typography variant="h5">
                        OBSERVATIONS GÉNÉRALES
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>
                            Ce milieu est à privilégier pour le:
                        </span> {data.observations.preferedInternship}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>
                            Ce milieu est ouvert à accueillir:
                        </span> {data.observations.numbersOfInterns}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>
                            Ce milieu désire accueillir le même stagiaire pour un prochain stage:
                        </span> {data.observations.welcomeSameIntern}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>
                            Ce milieu offre des quarts de travail variables:
                        </span> {data.observations.variablesShifts}.
                        De {data.observations.startShiftsOne}h à {data.observations.endShiftsOne}h
                        De {data.observations.startShiftsTwo}h à {data.observations.endShiftsTwo}h
                        De {data.observations.startShiftsThree}h à {data.observations.endShiftsThree}h
                    </Typography>
                </div>
            </div> : ""}
        </DialogContent>
        <DialogActions>
            <Button onClick={hide} color="primary">
                J'ai compris
            </Button>
        </DialogActions>
    </Dialog>
}
