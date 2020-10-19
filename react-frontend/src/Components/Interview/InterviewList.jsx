import {Button, Container, makeStyles, Typography} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
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
        api.get("/interviews")
            .then((r) => setInterviews(r.data))
    }, [])

    function redirectEditFormInterview(interview) {
        console.log("redired reschedule")
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
                            : {interview.date ? parseDate(interview.date) : ""}</Typography>
                        <Typography>Titre de l'offre
                            : {interview.studentApplication ? interview.studentApplication.offer.title : ""}</Typography>
                        {<Typography>Etudiant a entrevoir
                            : {interview.studentApplication ? interview.studentApplication.student.firstName + " " + interview.studentApplication.student.lastName : ""}</Typography>}
                        <Button>Supprimer</Button>
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
