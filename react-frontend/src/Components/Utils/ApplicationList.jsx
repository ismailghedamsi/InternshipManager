import {Checkbox} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";
import {useApi, useModal} from "../../Services/Hooks";
import PdfSelectionViewer from "./PDF/PdfSelectionViewer";
import useStyles from "./Style/useStyles";
import InterviewConvocationModal from "../Employer/Interview/InterviewConvocationModal";

export default function ApplicationList() {
    const classes = useStyles()
    const location = useLocation()
    const history = useHistory()
    const api = useApi()
    const [offer, setOffer] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)
    const [application, setApplication] = useState({})
    const [isInterviewConvocationModalOpen, openInterviewConvocationModal, closeInterviewConvocationModal] = useModal()

    useEffect(() => {
        api.get("/offers/" + location.state.offerId)
            .then(r => setOffer(r.data))
    }, [location.state.offerId]) // eslint-disable-line react-hooks/exhaustive-deps

    function studentApplicationState(i) {
        switch (offer.applications[i].state) {
            case "STUDENT_HIRED_BY_EMPLOYER":
                if (AuthenticationService.getCurrentUserRole() === "admin")
                    return <Typography variant={"body1"} style={{color: "green"}}>Application acceptée</Typography>
                break;
            case "APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW":
            case "STUDENT_INVITED_FOR_INTERVIEW_BY_EMPLOYER":
            case "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION":
                return <Typography>
                    Application acceptée:
                    <Checkbox
                        value="state"
                        checked={offer.applications[i].state === "STUDENT_HIRED_BY_EMPLOYER"}
                        onChange={() => {
                            var copy = {...offer}
                            copy.applications[i].state = copy.applications[i].state === "STUDENT_HIRED_BY_EMPLOYER" ?
                                "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION" : "STUDENT_HIRED_BY_EMPLOYER"
                            api.put(`applications/state/${offer.applications[i].id}`, offer.applications[i])
                                .then(r => {
                                    if (r) copy.applications[i].state = r.data.state
                                    setOffer(copy)
                                })
                        }}
                        inputProps={{"aria-label": "state"}}
                    />
                </Typography>
            case "APPLICATION_REJECTED_BY_EMPLOYER":
            case "STUDENT_REJECTED_BY_EMPLOYER":
                return <Typography variant={"body1"} style={{color: "red"}}>
                    L'employeur a refusé la demande
                </Typography>
            case "WAITING_FOR_STUDENT_HIRING_FINAL_DECISION":
                return <Typography variant={"body1"} style={{color: "blue"}}>
                    En attente de la décision de l'étudiant
                </Typography>
            case "JOB_OFFER_ACCEPTED_BY_STUDENT":
                return <Typography variant={"body1"} style={{color: "green"}}>
                    L'étudiant a été embauché
                    <br/>
                    {offer.applications[i].contract === null && AuthenticationService.getCurrentUserRole() === "admin" &&
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => {
                            history.push("/dashboard/contractForm", {...offer.applications[i]})
                        }}>
                        Genérer le contrat
                    </Button>
                    }
                </Typography>
            case "JOB_OFFER_DENIED_BY_STUDENT":
                return <Typography variant={"body1"} style={{color: "red"}}>
                    L'étudiant a refusé l'offre de stage
                </Typography>
            default:
                return ""
        }
    }

    function showButtonCondition(i) {
        return AuthenticationService.getCurrentUserRole() === "employer"
            && offer.applications[i].state !== "STUDENT_INVITED_FOR_INTERVIEW_BY_EMPLOYER"
            && offer.applications[i].state !== "JOB_OFFER_DENIED_BY_STUDENT"
            && offer.applications[i].interview === null
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer
            documents={(offer.applications ? offer.applications : []).map((o) => o.resume.file)}
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
                    {studentApplicationState(i)}
                    {showButtonCondition(i) &&
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => {
                            setApplication(offer.applications[i])
                            openInterviewConvocationModal()
                        }}
                    >
                        Convoquer l'étudiant pour un entrevue
                    </Button>
                    }
                </div>}
                <hr/>
            </div>}
        </PdfSelectionViewer>
        <InterviewConvocationModal isOpen={isInterviewConvocationModalOpen}
                                   hide={closeInterviewConvocationModal}
                                   title={"Étudiant à rencontrer"}
                                   application={application}
        />
    </div>
}