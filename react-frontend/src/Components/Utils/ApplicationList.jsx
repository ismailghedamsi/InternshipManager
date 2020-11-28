import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";
import {useApi} from "../../Services/Hooks";
import ApprovalButtons from "./ApprovalButtons";
import PdfSelectionViewer from "./PDF/PdfSelectionViewer";
import useStyles from "./Style/useStyles";

export default function ApplicationList() {
    const classes = useStyles()
    const location = useLocation()
    const history = useHistory()
    const api = useApi()
    const [offer, setOffer] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        api.get("/offers/" + location.state.offerId)
            .then(r => setOffer(r.data))
    }, [location.state.offerId]) // eslint-disable-line react-hooks/exhaustive-deps

    function applicationActions(i) {
        function hirementDecision(copy) {
            api.put(`applications/state/${offer.applications[i].id}`, offer.applications[i])
                    .then(r => {
                        if (r) copy.applications[i].state = r.data.state
                        setOffer(copy)
                    })
        }

        switch (offer.applications[i].state) {
            case "APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW":
            case "STUDENT_INVITED_FOR_INTERVIEW_BY_EMPLOYER":
            case "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION":
                return <ApprovalButtons
                        onApprove={() => {
                            const copy = {...offer}
                            copy.applications[i].state = copy.applications[i].state === "STUDENT_HIRED_BY_EMPLOYER" ?
                                    "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION" : "STUDENT_HIRED_BY_EMPLOYER"
                            hirementDecision(copy);
                        }}
                        onDeny={() => {
                            const copy = {...offer}
                            copy.applications[i].state = "STUDENT_REJECTED_BY_EMPLOYER"
                            hirementDecision(copy)
                        }
                        }
                        approveLabel={"Embaucher l'étudiant"}
                        denyLabel={"Refuser l'application"}
                />
            default:
                return ""
        }
    }

    function applicationDecisionMessage(i) {
        switch (offer.applications[i].state) {
            case "STUDENT_HIRED_BY_EMPLOYER":
                return applicationDecisionStatus("Application acceptée", "green")
            case "APPLICATION_REJECTED_BY_EMPLOYER":
            case "STUDENT_REJECTED_BY_EMPLOYER":
                return applicationDecisionStatus("L'employeur a refusé la demande", "red")
            case "WAITING_FOR_STUDENT_HIRING_FINAL_DECISION":
                return applicationDecisionStatus("En attente de la décision de l'étudiant", "blue")
            case "JOB_OFFER_DENIED_BY_STUDENT":
                return applicationDecisionStatus("L'étudiant a refusé l'offre de stage", "red")
            case "JOB_OFFER_ACCEPTED_BY_STUDENT":
                return applicationDecisionStatus("L'étudiant a accepté l'offre de stage", "green")

            default:
                return ""
        }
    }

    function applicationDecisionStatus(statusMessage, messageColor) {
        return <Typography variant={"body1"} style={{color: messageColor}}>
            {statusMessage}
        </Typography>
    }

    function showInterviewConvocationButtonCondition(i) {
        return AuthenticationService.getCurrentUserRole() === "employer"
                && offer.applications[i].interview === null
                && (offer.applications[i].state === "APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW"
                        || offer.applications[i].state === "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION"
                        || offer.applications[i].state === "WAITING_FOR_STUDENT_HIRING_FINAL_DECISION")
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer
                documents={(offer.applications ? offer.applications : []).map(o => o.resume.file)}
                title={<span>Application<br/>{offer.title}</span>}>
            {(i, setCurrent) => <div key={i}>
                <Button
                        className={[currentIndex === i ? classes.fileButton : ""].join(" ")}
                        onClick={() => {
                            setCurrent(i)
                            setCurrentIndex(i)
                        }}
                >
                    <Typography color={"textPrimary"} variant={"h5"} style={{display: "block"}}>
                        {offer.applications[i].student.firstName} {offer.applications[i].student.lastName}
                    </Typography>
                </Button>
                {currentIndex === i && <div>
                    <Typography color={"textPrimary"} variant={"body1"}>
                        {offer.applications[i].student.phoneNumber} {offer.applications[i].student.email}
                    </Typography>
                    <Typography color={"textPrimary"} variant={"body1"}>
                        {offer.applications[i].student.address}
                    </Typography>
                    {applicationActions(i)}
                    {applicationDecisionMessage(i)}
                    {showInterviewConvocationButtonCondition(i) &&
                    <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => {
                                history.push("/dashboard/interviewConvocation", {...offer.applications[i]})
                            }}
                    >
                        Convoquer l'étudiant pour un entrevue
                    </Button>
                    }
                </div>}
                <hr/>
            </div>}
        </PdfSelectionViewer>
    </div>
}