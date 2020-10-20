import {Button, Container, makeStyles, Typography} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import AuthenticationService from '../../Services/AuthenticationService'
import {useApi, useDateParser} from '../Utils/Hooks'

export default function Interviewlist(props) {
    const [interviews, setInterviews] = useState([{}])
    const api = useApi()
    const history = useHistory()
    const parseDate = useDateParser()

    const useStyles = makeStyles(() => ({
        root: {
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
        },
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
    }, [])

    function redirectEditFormInterview(interview) {
        history.push("/dashboard/rescheduleInterview", {...interview})
    }

    return (
        <div className={classes.viewbox}>
            <Container className={classes.container}>
                {

                    interviews.map((interview, key) => <div key={key}>
                        {console.log(interview.studentApplication ? interview.studentApplication.student : "")}
                        <Typography>Date de l'entrevue
                            : {interview.date ? new Date(interview.date).toLocaleDateString() : ""}</Typography>
                        <Typography>L'heure de l'entrevue
                            : {interview.date ? new Date(interview.date).toLocaleTimeString() : ""}</Typography>
                        <Typography>Titre de l'offre
                            : {interview.studentApplication ? interview.studentApplication.offer.title : ""}</Typography>
                        {<Typography>Etudiant a entrevoir
                            : {interview.studentApplication ? interview.studentApplication.student.firstName + " " + interview.studentApplication.student.lastName : ""}</Typography>}
                        <Button onClick={() => {
                            const interviewToDeleteIndex = interviews.findIndex(interv => interv.id === interview.id);
                            console.log("interviewToDeleteIndex " + interviewToDeleteIndex)
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
                }
            </Container>

        </div>

    )
}
