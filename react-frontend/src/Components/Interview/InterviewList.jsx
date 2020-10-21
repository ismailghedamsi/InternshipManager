import {Button, Container, makeStyles, Typography} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import AuthenticationService from '../../Services/AuthenticationService'
import {useApi} from '../Utils/Hooks'

export default function Interviewlist(props) {
    const [interviews, setInterviews] = useState([{}])
    const api = useApi()
    const history = useHistory()
    const useStyles = makeStyles(() => ({
        container: {
            flex: 1,
            height: "90vh",
            overflow: "hidden"
        },
        viewbox: {
            height: "90vh",
            overflow: "auto",
            backgroundColor: "#fff",
        }
    }));

    const classes = useStyles();

    useEffect(() => {
        api.get("/interviews/employer/" + AuthenticationService.getCurrentUser().id)
            .then((r) => setInterviews(r.data))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function redirectEditFormInterview(interview) {
        history.push("/dashboard/rescheduleInterview", {...interview})
    }

    function isInterviewAccepted(interview) {
        if (interview.reviewState == "APPROVED") {
            return "L'étudiant a accepté l'entrevue"
        } else if (interview.reviewState == "DENIED") {
            return "L'étudiant a refusé  l'entrevue"
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
                                : {interview.date ? new Date(interview.date).toLocaleTimeString() : ""}</Typography>
                            <Typography>Titre de l'offre
                                : {interview.studentApplication ? interview.studentApplication.offer.title : ""}</Typography>
                            {<Typography>Etudiant à entrevoir
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
