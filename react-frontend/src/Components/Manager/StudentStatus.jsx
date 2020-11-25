import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import * as PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import OfferDetails from "../Utils/OfferDetails";
import PdfDocument from "../Utils/PDF/PdfDocument";
import {useApi, useDateParser, useModal} from "../Utils/Services/Hooks";
import useStyles from "../Utils/Style/useStyles";

const applicationAcceptedStates = [
    "STUDENT_HIRED_BY_EMPLOYER",
    "WAITING_FOR_STUDENT_HIRING_FINAL_DECISION",
    "JOB_OFFER_ACCEPTED_BY_STUDENT",
    "JOB_OFFER_DENIED_BY_STUDENT"
]

function ResumeStatus(props) {
    function getResumeState(resume) {
        if (resume.reviewState === "PENDING")
            return <span style={{color: "blue"}}>En attente</span>
        else if (resume.reviewState === "DENIED")
            return <span style={{color: "red"}}>Rejeté<span
                style={{color: "black"}}> : {resume.reasonForRejection} </span></span>
        else
            return <span style={{color: "green"}}>Approuvé</span>
    }

    return <div>
        <Typography>
            <button type={"button"}
                    className={[props.classes.linkButton].join(" ")}
                    onClick={props.onClick}>
                {props.resume.name}
            </button>
        </Typography>
        <Typography>
            État: {getResumeState(props.resume)}
        </Typography>
        <hr/>
    </div>
}

ResumeStatus.propTypes = {
    classes: PropTypes.any,
    onClick: PropTypes.func,
    resume: PropTypes.any
}

function OfferStatus(props) {
    const parseInterviewDate = useDateParser()
    const application = props.offer.applications.find(a => a.student.id === props.currentStudent.id)

    function parseInterviewState(interview) {
        if (interview.studentAcceptanceState === "INTERVIEW_ACCEPTED_BY_STUDENT")
            return "acceptée par l'étudiant"
        else if (interview.studentAcceptanceState === "INTERVIEW_REJECTED_BY_STUDENT")
            return "refusée par l'étudiant. Raison: " + interview.reasonForRejectionByStudent
        else
            return "en attente de réponse de l'étudiant"
    }

    function parseApplicationState(application) {
        if (application.state === "JOB_OFFER_ACCEPTED_BY_STUDENT")
            return "Acceptée par l'étudiant"
        else if (application.state === "JOB_OFFER_DENIED_BY_STUDENT")
            return "Refusée par l'étudiant. Raison: " + application.reasonForRejection
        else
            return "En attente de réponse de l'étudiant"
    }

    return <div>
        <Typography>
            <button type={"button"}
                    className={[props.classes.linkButton].join(" ")}
                    onClick={props.onClick}>
                {props.offer.title}
            </button>
        </Typography>
        <OfferDetails offer={props.offer}/>
        <Typography
            variant={"body2"}>
            A appliqué: {application ? "Oui" : "Non"} &emsp;
            {application && <span>
            {
                application.interview ?
                    <span>
                   Entrevue: {parseInterviewDate(application.interview.dateTime)}, {parseInterviewState(application.interview)}
                </span>
                    :
                    <span>
                   Entrevue: Pas planifiée
                </span>
            }
                <br/>
                &emsp;A été sélectionné: {applicationAcceptedStates.indexOf(application.state) > -1 ? "Oui" : "Non"}
                &emsp;Offre: {parseApplicationState(application)}
                </span>
            }
        </Typography>
        <hr/>
    </div>
}

OfferStatus.propTypes = {
    classes: PropTypes.any,
    onClick: PropTypes.func,
    offer: PropTypes.any,
    currentStudent: PropTypes.any,
}

function EtatEtudiant(props) {
    var student = props.currentStudent;
    var string = ""
    var ctp = 0;
    var ctp2 = 0;

    if (student.resumes.length === 0) {
        string = "Aucun CV"
    } else if (student.resumes.length > 0 && student.offer === undefined) {
        ctp = 0;
        ctp2 = 0;
        for (var i = 0; i < student.resumes.length; i++) {
            if (student.resumes[i].reviewState === "APPROVED") {
                ctp += 1;
            } else if (student.resumes[i].reviewState === "PENDING") {
                ctp2 += 1;
            }
        }
        string = "A " + student.resumes.length + " CV en total: " + ctp + " aprouvé et " + ctp2 + " en attente"
    } else {
        string = ""
    }

    if (student.allowedOffers === undefined) {
        string += " - Aucune offre"
    } else if (student.allowedOffers.length > 0) {
        string += " - Droit a " + student.allowedOffers.length + " offres"
    } else {
        string += ""
    }
    if (student.applications !== undefined) {

        ctp = 0;
        for (var i = 0; i < student.applications.length; i++) {
            if (student.applications[i].interview !== null) {
                ctp += 1;
            }

        }
        string += " - " + student.applications.length + " offre accepter par l'étudiant - "
            + ctp + " demande d'entrevue"
        ctp = 0;
        for(var i = 0; i < student.applications.length;i++){
            if(student.applications[i].contract !== undefined){
                ctp = i;
            }
        }
        /*
        if(student.applications[ctp].contract !== undefined){
            switch (student.applications.contract.signatureState) {
                case "WAITING_FOR_EMPLOYER_SIGNATURE" :
                    string += "En attente de la signature de l'employeur"
                    break
                case "REJECTED_BY_EMPLOYER" :
                    string+="L'employeur a rejeté le contrat"
                    break
                case "WAITING_FOR_STUDENT_SIGNATURE" :
                    string += "En attente de la signature de l'étudiant"
                    break
                case "SIGNED":
                    string +="Contrat signé"
                    break
            }
        }*/
    } else {
        string += " - Aucune offre acepter par l'étudiant"
    }

    return <div><Typography>{string}</Typography></div>

}

EtatEtudiant.propTypes = {
    currentStudent: PropTypes.any,
}


export default function StudentStatus() {
    const classes = useStyles()
    const api = useApi()
    const [students, setStudents] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentSubtab, setCurrentSubtab] = useState(0)
    const [currentDoc, setCurrentDoc] = useState("")
    const [isPdfOpen, openPdf, closePdf] = useModal()

    useEffect(() => {
        api.get("students").then(resp => setStudents(resp ? resp.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function isResumesNotUndefined(students, currentIndex) {
        return students.length !== 0 && students[currentIndex].resumes.length > 0
    }

    function isOffersNotUndefined(students, currentIndex) {
        return students[currentIndex].allowedOffers && students[currentIndex].allowedOffers.length > 0
    }




    return <Grid
        container
        spacing={2}
        className={classes.main}>
        <Grid item xs={5} className={classes.list}>
            <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                État des étudiants
            </Typography>
            {students.length !== 0 ? students.map((item, i) =>
                <div key={i}>
                    <button
                        type={"button"}
                        className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(" ")}
                        onClick={() => {
                            setCurrentIndex(i)
                        }}>
                        <Typography color={"textPrimary"} variant={"body1"} display={"block"} align={"left"}>
                            {students[i].firstName} {students[i].lastName}
                        </Typography>
                    </button>

                    <EtatEtudiant currentStudent={students[i]}/>

                    {currentIndex === i &&
                    <div>
                        <button
                            type={"button"}
                            className={[classes.linkButton, currentSubtab === 0 ? classes.fileButton : null].join(" ")}
                            onClick={() => setCurrentSubtab(0)}>
                            <Typography color={"textSecondary"} variant={"body2"}>
                                CVs
                            </Typography>
                        </button>
                        <button
                            type={"button"}
                            className={[classes.linkButton, currentSubtab === 1 ? classes.fileButton : null].join(" ")}
                            onClick={() => setCurrentSubtab(1)}>
                            <Typography color={"textSecondary"} variant={"body2"}>
                                Offres de stage
                            </Typography>
                        </button>
                    </div>
                    }
                    <hr/>
                </div>
            ) : "Aucun étudiants"}
        </Grid>
        <Grid item xs={7} align="center" style={{overflow: "auto", height: "100%"}}>
            {currentSubtab === 0 ? isResumesNotUndefined(students, currentIndex) ? students[currentIndex].resumes.map((resume, index) =>
                <ResumeStatus key={index}
                              classes={classes}
                              resume={resume}
                              onClick={() => {
                                  setCurrentDoc(resume.file)
                                  openPdf()
                              }}/>
            ) : "L'étudiant n'a téléversé aucun CV" : ""}
            {currentSubtab === 1 ? isOffersNotUndefined(students, currentIndex) ? students[currentIndex].allowedOffers.map((offer, index) =>
                <OfferStatus key={index}
                             classes={classes}
                             offer={offer}
                             currentStudent={students[currentIndex]}
                             onClick={() => {
                                 setCurrentDoc(offer.file)
                                 openPdf()
                             }}/>
            ) : " L'étudiant n'a accès à aucune offre de stage" : ""}
        </Grid>
        <Dialog open={isPdfOpen} onClose={closePdf} maxWidth={"xl"}>
            <DialogContent className={classes.viewbox}>
                <PdfDocument document={currentDoc}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={closePdf} color="primary">
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    </Grid>
}