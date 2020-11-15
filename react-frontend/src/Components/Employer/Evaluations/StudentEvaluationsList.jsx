import {Grid, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {useApi} from "../../Utils/Hooks";
import useStyles from "../../Utils/useStyles";

export default function StudentStatus() {
    const offersTabIndex = 0;
    const interviewsTabIndex = 1;
    const classes = useStyles();
    const api = useApi();
    // const parseDate = useDateParser();
    // const parseTimeFromDate = useTimeParserFromDate();
    const [currentEvaluationIndex, setCurrentEvaluationIndex] = useState(0);
    const [evaluations, setEvaluations] = useState([{}]);


    useEffect(() => {
        api.get("/internEvaluation").then((r) => {
            console.log(r.data)
            setEvaluations(r.data);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    return <Grid
            container
            spacing={2}
            className={classes.main}
    >
        <Grid item xs={5} className={classes.list}>
            <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                Liste des évalautions des étudiants
            </Typography>
            {evaluations ? evaluations.map((item, i) =>
                    <div key={i}>
                        <div>
                            <button
                                    type={"button"}
                                    className={[classes.linkButton, i === currentEvaluationIndex ? classes.fileButton : null].join(' ')}
                                    onClick={() => setCurrentEvaluationIndex(i)}>
                                <Typography color={"textSecondary"} variant={"body2"}>
                                    {item.contract ? item.contract.studentApplication.student.firstName + " " + item.contract.studentApplication.student.lastName : ""}
                                </Typography>
                            </button>
                        </div>
                    </div>
            ) : ""}
        </Grid>
        <Grid item xs={7} align="center" style={{overflow: "auto", height: "100%"}}>
            <h1>Détails de l'evaluation </h1>
            {
                evaluations ? evaluations.map((e, k) => {
                            return <div>
                                {
                                    <div>
                                        <div className={classes.evaluationSections}>
                                            <Typography>
                                                {" "}
                                                <span className={classes.evaluationCriterias}>Programme d’études :</span> {e.infos ? e.infos.studentProgram : ""}
                                            </Typography>
                                            <Typography> <span
                                                    className={classes.evaluationCriterias}>Nom de l'entrprise : {e.contract ? e.contract.studentApplication.companyName : ""}</span>
                                            </Typography>
                                            <Typography>
                                                {" "}
                                                <span className={classes.evaluationCriterias}>Nom du superviseur :</span> {e.application ? e.application.contract.adminName : ""}
                                            </Typography>
                                            <Typography> <span
                                                    className={classes.evaluationCriterias}>Function :</span> {e.infos ? e.infos.supervisorRole : ""}
                                            </Typography>
                                            <Typography> <span
                                                    className={classes.evaluationCriterias}>Telephone : </span> {e.infos ? e.infos.phoneNumber : ""}
                                            </Typography>
                                        </div>

                                        <div className={classes.evaluationSections}>
                                            Productivité
                                            <Typography> <span className={classes.evaluationCriterias}> a) planifier et organiser son travail de façon efficace :</span> {e.productivity ? e.productivity.efficiency : ""}
                                            </Typography>
                                            <Typography> <span className={classes.evaluationCriterias}> b) comprendre rapidement les directives relatives à son travail :</span> {e.productivity ? e.productivity.comprehension : ""}
                                            </Typography>
                                            <Typography> <span className={classes.evaluationCriterias}>c) maintenir un rythme de travail soutenu :</span> {e.productivity ? e.productivity.rythm : ""}
                                            </Typography>
                                            <Typography> <span className={classes.evaluationCriterias}> d) établir ses priorités :</span> {e.productivity ? e.productivity.priorities : ""}
                                            </Typography>
                                            <Typography> <span className={classes.evaluationCriterias}> e) respecter ses échéanciers :</span> {e.productivity ? e.productivity.deadlines : ""}
                                            </Typography>
                                            <Typography> <span
                                                    className={classes.evaluationCriterias}>Commentaire : </span> {e.productivity ? e.productivity.comment : ""}
                                            </Typography>
                                        </div>

                                        <div className={classes.evaluationSections}>
                                            Qualite de travail
                                            <Typography><span className={classes.evaluationCriterias}>a) respecter les mandats qui lui ont été confiés</span> {e.quality ? e.quality.followsInstructions : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>b) porter attention aux détails dans la réalisation de ses tâches</span> {e.quality ? e.quality.detailsAttention : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>c) vérifier son travail, s’assurer que rien n’a été oublié</span> {e.quality ? e.quality.doubleChecks : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>d) rechercher des occasions de se perfectionner </span> {e.quality ? e.quality.strivesForPerfection : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>e) faire une bonne analyse des problèmes rencontrés</span> {e.quality ? e.quality.problemAnalysis : ""}
                                            </Typography>
                                            <Typography><span
                                                    className={classes.evaluationCriterias}>Commentaire : </span> {e.quality ? e.quality.comment : ""}
                                            </Typography>
                                        </div>

                                        <div className={classes.evaluationSections}>
                                            QUALITÉS DES RELATIONS INTERPERSONNELLES
                                            <Typography> <span className={classes.evaluationCriterias}>a) établir facilement des contacts avec les gens</span> {e.relationships ? e.relationships.connectsEasily : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>b) contribuer activement au travail d’équipe</span> {e.relationships ? e.relationships.teamworkContribution : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>c) s’adapter facilement à la culture de l’entreprise</span> {e.relationships ? e.relationships.culturalAdaptation : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>d) accepter les critiques constructives </span> {e.relationships ? e.relationships.acceptsCriticism : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>e) être respectueux envers les gens</span> {e.relationships ? e.relationships.respectsOthers : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>f) faire preuve d’écoute active en essayant decomprendre le point de vue de l’autre</span> {e.relationships ? e.relationships.activelyListens : ""}
                                            </Typography>
                                            <Typography><span
                                                    className={classes.evaluationCriterias}>Commentaire :</span> {e.relationships ? e.relationships.comment : ""}
                                            </Typography>
                                        </div>

                                        <div className={classes.evaluationSections}>
                                            HABILETÉS PERSONNELLES
                                            <Typography>  {e.skills ? e.skills.connectsEasily : ""}</Typography>
                                            <Typography><span className={classes.evaluationCriterias}>a) démontrer de l’intérêt et de la motivation au travail</span> {e.skills ? e.skills.showsInterest : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>b) exprimer clairement ses idées</span> {e.skills ? e.skills.expressesOwnIdeas : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>c) faire preuve d’initiative</span> {e.skills ? e.skills.showsInitiative : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>d) travailler de façon sécuritaire</span> {e.skills ? e.skills.worksSafely : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>e) démontrer un bon sens des responsabilités ne requérant qu’un minimum de supervision</span> {e.skills ? e.skills.dependable : ""}
                                            </Typography>
                                            <Typography><span className={classes.evaluationCriterias}>f) être ponctuel et assidu à son travail</span> {e.skills ? e.skills.punctual : ""}
                                            </Typography>
                                            <Typography><span
                                                    className={classes.evaluationCriterias}>Commentaire</span> {e.skills ? e.skills.comment : ""}
                                            </Typography>
                                        </div>

                                        <div className={classes.evaluationSections}>
                                            APPRÉCIATION GLOBALE DU STAGIAIRE
                                            <Typography>Expectation
                                                : {e.appreciation ? e.appreciation.expectations : ""}</Typography>
                                            <Typography>PRÉCISEZ VOTRE APPRÉCIATION:
                                                : {e.appreciation ? e.appreciation.comment : ""}</Typography>
                                            <Typography>Cette évaluation a été discutée avec le stagiaire
                                                : {e.appreciation ? e.appreciation.discussedWithIntern : ""}</Typography>
                                        </div>

                                        <div className={classes.evaluationSections}>
                                            <Typography>Le nombre d’heures réel par semaine d’encadrement accordé au stagiaire
                                                : {e.feedback ? e.feedback.weeklySupervisionHours : ""} </Typography>
                                        </div>

                                        <div className={classes.evaluationSections}>
                                            <Typography>L’ENTREPRISE AIMERAIT ACCUEILLIR CET ÉLÈVE POUR SON PROCHAIN STAGE
                                                : {e.feedback ? e.feedback.hireAgain : ""} </Typography>
                                            <Typography>La formation technique du stagiaire était-elle suffisante pour accomplir
                                                le mandat de
                                                stage? {e.feedback ? e.feedback.technicalFormationOpinion : ""}</Typography>
                                            <img src={e.signature ? e.signature.image : ""} alt="signature"/>
                                        </div>

                                    </div>
                                }
                                <hr/>
                            </div>
                        })
                        : "L'employeur n'a aucune offre"
            }
        </Grid>
    </Grid>;
}
