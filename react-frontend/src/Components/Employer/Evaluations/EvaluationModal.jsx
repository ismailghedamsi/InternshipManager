import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {useStyles} from "@material-ui/pickers/views/Calendar/SlideTransition";
import React from "react";
import {useApi} from "../../Utils/Hooks";

export default function EvaluationModal({isOpen, data, hide}) {
  const classes = useStyles();
  const api = useApi();
  console.log("data passed to modal");
  console.log(data);
  return (
          <Dialog
                  open={isOpen}
                  onClose={hide}
                  fullWidth={true}
                  fullScreen={true}
                  maxWidth={"md"}
          >
            <DialogTitle id="alert-dialog-title">{"Sommaire evaluation"}</DialogTitle>
            <DialogContent>
              {data ? (
                      <div>
                        <div className={classes.evaluationSections}>
                          <Typography><span
                                  className={classes.evaluationCriterias}>Nom de l’élève :</span> {data.infos.fullname}
                          </Typography>
                          <Typography>
                            {" "}
                            <span className={classes.evaluationCriterias}>Programme d’études :</span> {data.infos.studentProgram}
                          </Typography>
                          <Typography> <span className={classes.evaluationCriterias}>Nom de l'entrprise :</span>
                          </Typography>
                          <Typography>
                            {" "}
                            <span className={classes.evaluationCriterias}>Nom du superviseur :</span> {data.application.contract.adminName}
                          </Typography>
                          <Typography> <span
                                  className={classes.evaluationCriterias}>Function :</span> {data.infos.supervisorRole}
                          </Typography>
                          <Typography> <span
                                  className={classes.evaluationCriterias}>Telephone : </span> {data.infos.phoneNumber}
                          </Typography>
                        </div>

                        <div className={classes.evaluationSections}>
                          Productivité
                          <Typography> <span className={classes.evaluationCriterias}> a) planifier et organiser son travail de façon efficace :</span> {data.productivity.efficiency}
                          </Typography>
                          <Typography> <span className={classes.evaluationCriterias}> b) comprendre rapidement les directives relatives à son travail :</span> {data.productivity.comprehension}
                          </Typography>
                          <Typography> <span className={classes.evaluationCriterias}>c) maintenir un rythme de travail soutenu :</span> {data.productivity.rythm}
                          </Typography>
                          <Typography> <span
                                  className={classes.evaluationCriterias}> d) établir ses priorités :</span> {data.productivity.priorities}
                          </Typography>
                          <Typography> <span
                                  className={classes.evaluationCriterias}> e) respecter ses échéanciers :</span> {data.productivity.deadlines}
                          </Typography>
                          <Typography> <span
                                  className={classes.evaluationCriterias}>Commentaire : </span> {data.productivity.comment}
                          </Typography>
                        </div>

                        <div className={classes.evaluationSections}>
                          Qualite de travail
                          <Typography><span className={classes.evaluationCriterias}>a) respecter les mandats qui lui ont été confiés</span> {data.quality.followsInstructions}
                          </Typography>
                          <Typography><span className={classes.evaluationCriterias}>b) porter attention aux détails dans la réalisation de ses tâches</span> {data.quality.detailsAttention}
                          </Typography>
                          <Typography><span className={classes.evaluationCriterias}>c) vérifier son travail, s’assurer que rien n’a été oublié</span> {data.quality.doubleChecks}
                          </Typography>
                          <Typography><span className={classes.evaluationCriterias}>d) rechercher des occasions de se perfectionner </span> {data.quality.strivesForPerfection}
                          </Typography>
                          <Typography><span className={classes.evaluationCriterias}>e) faire une bonne analyse des problèmes rencontrés</span> {data.quality.problemAnalysis}
                          </Typography>
                          <Typography><span
                                  className={classes.evaluationCriterias}>Commentaire : </span> {data.quality.comment}
                          </Typography>
                        </div>

                        <div className={classes.evaluationSections}>
                          QUALITÉS DES RELATIONS INTERPERSONNELLES
                          <Typography> <span className={classes.evaluationCriterias}>a) établir facilement des contacts avec les gens</span> {data.relationships.connectsEasily}
                          </Typography>
                          <Typography><span className={classes.evaluationCriterias}>b) contribuer activement au travail d’équipe</span> {data.relationships.teamworkContribution}
                          </Typography>
                          <Typography><span className={classes.evaluationCriterias}>c) s’adapter facilement à la culture de l’entreprise</span> {data.relationships.culturalAdaptation}
                          </Typography>
                          <Typography><span className={classes.evaluationCriterias}>d) accepter les critiques constructives </span> {data.relationships.acceptsCriticism}
                          </Typography>
                          <Typography><span
                                  className={classes.evaluationCriterias}>e) être respectueux envers les gens</span> {data.relationships.respectsOthers}
                          </Typography>
                          <Typography><span className={classes.evaluationCriterias}>f) faire preuve d’écoute active en essayant decomprendre le point de vue de l’autre</span> {data.relationships.activelyListens}
                          </Typography>
                          <Typography><span
                                  className={classes.evaluationCriterias}>Commentaire :</span> {data.relationships.comment}
                          </Typography>
                        </div>

                        <div className={classes.evaluationSections}>
                          HABILETÉS PERSONNELLES
                          <Typography>  {data.skills.connectsEasily}</Typography>
                          <Typography><span className={classes.evaluationCriterias}>a) démontrer de l’intérêt et de la motivation au travail</span> {data.skills.showsInterest}
                          </Typography>
                          <Typography><span
                                  className={classes.evaluationCriterias}>b) exprimer clairement ses idées</span> {data.skills.expressesOwnIdeas}
                          </Typography>
                          <Typography><span
                                  className={classes.evaluationCriterias}>c) faire preuve d’initiative</span> {data.skills.showsInitiative}
                          </Typography>
                          <Typography><span
                                  className={classes.evaluationCriterias}>d) travailler de façon sécuritaire</span> {data.skills.worksSafely}
                          </Typography>
                          <Typography><span className={classes.evaluationCriterias}>e) démontrer un bon sens des responsabilités ne requérant qu’un minimum de supervision</span> {data.skills.dependable}
                          </Typography>
                          <Typography><span className={classes.evaluationCriterias}>f) être ponctuel et assidu à son travail</span> {data.skills.punctual}
                          </Typography>
                          <Typography><span
                                  className={classes.evaluationCriterias}>Commentaire</span> {data.skills.comment}
                          </Typography>
                        </div>

                        <div className={classes.evaluationSections}>
                          APPRÉCIATION GLOBALE DU STAGIAIRE
                          <Typography>Expectation : {data.appreciation.expectations}</Typography>
                          <Typography>PRÉCISEZ VOTRE APPRÉCIATION: : {data.appreciation.comment}</Typography>
                          <Typography>Cette évaluation a été discutée avec le stagiaire
                            : {data.appreciation.discussedWithIntern}</Typography>
                        </div>

                        <div className={classes.evaluationSections}>
                          <Typography>Le nombre d’heures réel par semaine d’encadrement accordé au stagiaire
                            : {data.feedback.weeklySupervisionHours} </Typography>
                        </div>

                        <div className={classes.evaluationSections}>
                          <Typography>L’ENTREPRISE AIMERAIT ACCUEILLIR CET ÉLÈVE POUR SON PROCHAIN STAGE
                            : {data.feedback.hireAgain} </Typography>
                          <Typography>La formation technique du stagiaire était-elle suffisante pour accomplir le mandat
                            de stage? {data.feedback.technicalFormationOpinion}</Typography>

                        </div>

                      </div>
              ) : (
                      ""
              )}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={hide}>
                Valider evaluation
              </Button>
            </DialogActions>
          </Dialog>
  );
}
