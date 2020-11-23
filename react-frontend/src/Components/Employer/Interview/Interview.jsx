import {Button, Typography} from "@material-ui/core";
import React from 'react'
import {useTimeParserFromDate} from "../../Utils/Services/Hooks";

export default function Interview(props) {
    const parseTimeFromDate = useTimeParserFromDate();

    function isInterviewAccepted(interview) {
        if (interview.studentAcceptanceState === "INTERVIEW_ACCEPTED_BY_STUDENT") {
            return "L'étudiant a accepté l'entrevue"
        } else if (interview.studentAcceptanceState === "INTERVIEW_REJECTED_BY_STUDENT") {
            return <span style={{color: "red"}}>Rejeté<span
                    style={{color: "black"}}> : {interview.reasonForRejectionByStudent} </span></span>;
        }
        return "En attente d'approbation"
    }

    return <>
        <Typography>Date de l'entrevue
            : {props.interview.dateTime ? new Date(props.interview.dateTime).toLocaleDateString() : ""}</Typography>
        <Typography>L'heure de l'entrevue
            : {props.interview.dateTime ? parseTimeFromDate(props.interview.dateTime) : ""}</Typography>
        <Typography>Titre de l'offre
            : {props.interview.studentApplication ? props.interview.studentApplication.offer.title : ""}</Typography>
        {<Typography> Étudiants à rencontrer
            : {props.interview.studentApplication ? props.interview.studentApplication.student.firstName + " " + props.interview.studentApplication.student.lastName : ""}</Typography>}
        <Typography>{isInterviewAccepted(props.interview)}</Typography>
        <Button onClick={() => {
            props.onDelete(props.interview)
        }}>Supprimer</Button>
        <Button onClick={() => {
            props.onReschedule(props.interview)
        }}>Reprogrammer</Button>
    </>
}