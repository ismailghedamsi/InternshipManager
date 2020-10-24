import {Button, Container, Typography} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import AuthenticationService from '../../../Services/AuthenticationService'
import {useApi, useTimeParserFromDate} from '../../Utils/Hooks'
import useStyles from "../../Utils/useStyles";

export default function Interviewlist() {
    const [interviews, setInterviews] = useState([{}])
    const api = useApi()
    const history = useHistory();
    const classes = useStyles();
    const parseTimeFromDate = useTimeParserFromDate();

    useEffect(() => {
        api.get("/interviews/employer/" + AuthenticationService.getCurrentUser().id)
            .then((r) => setInterviews(r.data))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function redirectEditFormInterview(interview) {
        history.push("/dashboard/rescheduleInterview", {...interview})
    }

    function isInterviewAccepted(interview) {
        if (interview.reviewState === "APPROVED") {
            return "L'étudiant a accepté l'entrevue"
        } else if (interview.reviewState === "DENIED") {
            return (<span style={{color: "red"}}>Rejeté<span
                style={{color: "black"}}> : {interview.reasonForRejection} </span></span>);
        }
        return "En attente d'approbation"
    }

    return (
        <div className={classes.viewbox}>
            <Container className={classes.container}>
                {
                    interviews.length > 0 ?
                        interviews.map((interview, key) => <div key={key}>
                            <Typography>Date de l'entrevue
                                : {interview.date ? new Date(interview.date).toLocaleDateString() : ""}</Typography>
                            <Typography>L'heure de l'entrevue
                                : {interview.date ? parseTimeFromDate(interview.date) : ""}</Typography>
                            <Typography>Titre de l'offre
                                : {interview.studentApplication ? interview.studentApplication.offer.title : ""}</Typography>
                            {<Typography> Étudiants à rencontrer
                                : {interview.studentApplication ? interview.studentApplication.student.firstName + " " + interview.studentApplication.student.lastName : ""}</Typography>}
                            <Typography>{isInterviewAccepted(interview)}</Typography>
                            <Button onClick={() => {
                                const interviewToDeleteIndex = interviews.findIndex(interv => interv.id === interview.id);
                                const copyInterviews = [...interviews]
                                api.delete("/interviews/" + interview.id)
                                    .then(() => {
                                        copyInterviews.splice(interviewToDeleteIndex, 1)
                                        setInterviews(copyInterviews)
                                    })
                            }}>Supprimer</Button>
                            <Button onClick={() => {
                                redirectEditFormInterview(interview);
                            }}>Reprogrammer</Button>
                            <hr/>
                        </div>)
                        : "Aucune entrevue a été crée"
                }
            </Container>
        </div>
    )
}
