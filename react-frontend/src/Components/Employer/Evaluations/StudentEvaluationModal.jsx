import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, {useEffect, useState} from "react";
import {useDateParser, useFileReader} from "../../../Services/Hooks";
import useStyles from "../../Utils/Style/useStyles";

export default function StudentEvaluationModal({isOpen, data, hide}) {
    const [imageSrc, setImageSrc] = useState("")
    const classes = useStyles()
    const parseDate = useDateParser()
    const imageDecoder = useFileReader()
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (data.signature.image)
            imageDecoder(data.signature.image).then(setImageSrc)
    }, [imageDecoder, data.signature.image])

    return <Dialog
        open={isOpen}
        onClose={hide}
        fullWidth={true}
        maxWidth={"md"}
    >
        <DialogTitle id="alert-dialog-title">{"Sommaire d'évaluation"}</DialogTitle>
        <DialogContent>
            {data && <div>
                <div className={classes.evaluationSections}>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  Programme d’études :
                </span>
                        {data.infos.studentProgram}
                    </Typography>
                </div>
                <div className={classes.evaluationSections}>
                    Productivité
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  a) Planifier et organiser son travail de façon efficace :
                </span>
                        {data.productivity.efficiency}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  b) Comprendre rapidement les directives relatives à son
                  travail :
                </span>
                        {data.productivity.comprehension}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  c) Maintenir un rythme de travail soutenu :
                </span>
                        {data.productivity.rythm}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  d) Établir ses priorités :
                </span>
                        {data.productivity.priorities}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  e) Respecter ses échéanciers :
                </span>
                        {data.productivity.deadlines}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  Commentaire :
                </span>
                        {data.productivity.comment}
                    </Typography>
                </div>
                <div className={classes.evaluationSections}>
                    Qualite du travail
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  a) Respecter les mandats qui lui ont été confiés :
                </span>
                        {data.quality.followsInstructions}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  b) Porter attention aux détails dans la réalisation de ses
                  tâches : 
                </span>
                        {data.quality.detailsAttention}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  c) Vérifier son travail, s’assurer que rien n’a été oublié :
                </span>
                        {data.quality.doubleChecks}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  d) Rechercher des occasions de se perfectionner :
                </span>
                        {data.quality.strivesForPerfection}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  e) Faire une bonne analyse des problèmes rencontrés :
                </span>
                        {data.quality.problemAnalysis}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  Commentaire : 
                </span>
                        {data.quality.comment}
                    </Typography>
                </div>
                <div className={classes.evaluationSections}>
                    QUALITÉS DES RELATIONS INTERPERSONNELLES
                    <Typography>

                <span className={classes.evaluationCriterias}>
                  a) Établir facilement des contacts avec les gens :
                </span>
                        {data.relationships.connectsEasily}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  b) Contribuer activement au travail d’équipe :
                </span>
                        {data.relationships.teamworkContribution}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  c) S’adapter facilement à la culture de l’entreprise :
                </span>
                        {data.relationships.culturalAdaptation}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  d) Accepter les critiques constructives :
                </span>
                        {data.relationships.acceptsCriticism}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  e) Être respectueux envers les gens :
                </span>
                        {data.relationships.respectsOthers}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  f) Faire preuve d’écoute active en essayant decomprendre le
                  point de vue de l’autre : 
                </span>
                        {data.relationships.activelyListens}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  Commentaire : 
                </span>
                        {data.relationships.comment}
                    </Typography>
                </div>
                <div className={classes.evaluationSections}>
                    HABILETÉS PERSONNELLES
                    <Typography> {data.skills.connectsEasily}</Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  a) Démontrer de l’intérêt et de la motivation au travail :
                </span>
                        {data.skills.showsInterest}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  b) Exprimer clairement ses idées :
                </span>
                        {data.skills.expressesOwnIdeas}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  c) Faire preuve d’initiative :
                </span>
                        {data.skills.showsInitiative}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  d) Travailler de façon sécuritaire :
                </span>
                        {data.skills.worksSafely}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  e) Démontrer un bon sens des responsabilités ne requérant
                  qu’un minimum de supervision : 
                </span>
                        {data.skills.dependable}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  f) Être ponctuel et assidu à son travail :
                </span>
                        {data.skills.punctual}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>Commentaire</span>
                        {data.skills.comment}
                    </Typography>
                </div>
                <div className={classes.evaluationSections}>
                    APPRÉCIATION GLOBALE DU STAGIAIRE
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  Attentes :
                </span>
                        {data.appreciation.expectations}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  PRÉCISEZ VOTRE APPRÉCIATION :
                </span>
                        {data.appreciation.comment}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  Cette évaluation a été discutée avec le stagiaire : 
                </span>
                        {data.appreciation.discussedWithIntern}
                    </Typography>
                </div>
                <div className={classes.evaluationSections}>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  Le nombre d’heures réel par semaine d’encadrement accordé au
                  stagiaire : 
                </span>
                        {data.feedback.weeklySupervisionHours}
                    </Typography>
                </div>
                <div className={classes.evaluationSections}>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                   L’entreprise aimerait accueillir cet élève pour son prochain stage : 
                </span>
                        : {data.feedback.hireAgain}
                    </Typography>
                    <Typography>
                <span className={classes.evaluationCriterias}>
                  La formation technique du stagiaire était-elle suffisante pour
                  accomplir le mandat de stage?
                </span>
                        {data.feedback.technicalFormationOpinion}
                    </Typography>
                </div>
                <div className={classes.evaluationSections}>
                    {data.signature.image &&
                    <img src={imageSrc} alt="signature" className={classes.signature}/>}
                    <Typography>
                        <span className={classes.evaluationCriterias}>Enseignant responsable : </span>
                        &ensp;{data.signature.name}
                    </Typography>
                    <Typography>
                        <span className={classes.evaluationCriterias}>Date : </span>
                        &ensp;{parseDate(data.signature.date)}
                    </Typography>
                </div>
            </div>}
        </DialogContent>
        <DialogActions>
            <Button color="secondary"
                    variant="contained"
                    onClick={() => {
                        setIsSubmitting(false)
                        hide()
                    }}
            >
                Revenir au formulaire
            </Button>
            <Button color="primary"
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={() => {
                        setIsSubmitting(true)
                        data.submitForm().then(() => {
                            setIsSubmitting(false)
                            hide()
                        })
                    }}
            >
                Envoyer l'évaluation
            </Button>
            {isSubmitting && <CircularProgress size={18}/>}
        </DialogActions>
    </Dialog>
}
