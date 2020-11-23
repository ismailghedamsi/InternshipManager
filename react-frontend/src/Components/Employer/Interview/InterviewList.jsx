import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import AuthenticationService from '../../../Services/AuthenticationService'
import {useApi, useTimeParserFromDate} from '../../Utils/Services/Hooks'
import useStyles from "../../Utils/Style/useStyles";
import Interview from "./Interview";

export default function Interviewlist() {
    const [interviews, setInterviews] = useState([{}])
    const api = useApi()
    const history = useHistory();
    const classes = useStyles();
    const parseTimeFromDate = useTimeParserFromDate();

    useEffect(() => {
        api.get("/interviews/employer/" + AuthenticationService.getCurrentUser().id)
                .then(r => {
                    setInterviews(r.data)
                })

    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function redirectEditFormInterview(interview) {
        history.push("/dashboard/rescheduleInterview", {...interview})
    }

    function isInterviewAccepted(interview) {
        if (interview.studentAcceptanceState === "INTERVIEW_ACCEPTED_BY_STUDENT") {
            return "L'étudiant a accepté l'entrevue"
        } else if (interview.studentAcceptanceState === "INTERVIEW_REJECTED_BY_STUDENT") {
            return <span style={{color: "red"}}>Rejeté<span
                    style={{color: "black"}}> : {interview.reasonForRejectionByStudent} </span></span>;
        }
        return "En attente d'approbation"
    }

    function handleDelete(interview) {
        const interviewToDeleteIndex = interviews.findIndex(interv => interv.id === interview.id);
        const copyInterviews = [...interviews]
        api.delete("/interviews/" + interview.id)
                .then(() => {
                    copyInterviews.splice(interviewToDeleteIndex, 1)
                    setInterviews(copyInterviews)
                })
    }

    function handleReschedule(interview) {
        redirectEditFormInterview(interview);
    }

    return <Grid
            container
            spacing={2}
            className={classes.main}>
        <Grid item xs={5} className={classes.list}>
            {
                interviews.length > 0 ?
                        interviews.map((interview, key) => <div key={key}>
                            <Interview interview={interview} onDelete={handleDelete} onReschedule={handleReschedule}/>
                            <hr/>
                        </div>)
                        : "Aucune entrevue n'a été créée"
            }
        </Grid>
    </Grid>
}
