import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import AuthenticationService from "../../../Services/AuthenticationService";
import {useApi, useTimeParserFromDate} from "../../../Services/Hooks";
import useStyles from "../../Utils/Style/useStyles";

export default function Interviewlist() {
    const [interviews, setInterviews] = useState([{}])
    const api = useApi()
    const history = useHistory()
    const classes = useStyles()
    const parseTimeFromDate = useTimeParserFromDate()

    useEffect(() => {
        api.get("/interviews/employer/" + AuthenticationService.getCurrentUser().id)
                .then(r => {
                    setInterviews(r ? r.data : [])
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
                    style={{color: "black"}}> : {interview.reasonForRejectionByStudent} </span></span>
        }
        return "En attente d'approbation"
    }

    return <Grid
            container
            spacing={2}
            className={classes.main}>
        <Grid item xs={12} className={classes.list}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Heure</TableCell>
                            <TableCell>Titre</TableCell>
                            <TableCell>Etudiant</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Reprogrammer</TableCell>
                            <TableCell>Supprimer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {interviews && interviews.map((interview, key) =>
                                <TableRow key={key}>
                                    <TableCell>{interview.dateTime ? new Date(interview.dateTime).toLocaleDateString() : ""}</TableCell>
                                    <TableCell>{interview.dateTime ? parseTimeFromDate(interview.dateTime) : ""}</TableCell>
                                    <TableCell>{interview.studentApplication ? interview.studentApplication.offer.title : ""}</TableCell>
                                    <TableCell>{interview.studentApplication ? interview.studentApplication.student.firstName + " " + interview.studentApplication.student.lastName : ""}</TableCell>
                                    <TableCell>{isInterviewAccepted(interview)}</TableCell>
                                    <TableCell>
                                        <Button
                                                variant={"contained"}
                                                color={"primary"}
                                                onClick={() => {
                                                    redirectEditFormInterview(interview)
                                                }}>Reprogrammer</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                                style={{backgroundColor: "red"}}
                                                variant={"contained"}
                                                color={"primary"}
                                                onClick={() => {
                                                    const interviewToDeleteIndex = interviews.findIndex(interv => interv.id === interview.id)
                                                    const copyInterviews = [...interviews]
                                                    api.delete("/interviews/" + interview.id)
                                                            .then(() => {
                                                                copyInterviews.splice(interviewToDeleteIndex, 1)
                                                                setInterviews(copyInterviews)
                                                            })
                                                }}>Supprimer
                                        </Button>
                                    </TableCell>
                                </TableRow>)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>
}
