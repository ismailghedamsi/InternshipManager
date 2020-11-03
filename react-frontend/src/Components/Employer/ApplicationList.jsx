import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {Link, useLocation} from "react-router-dom";
import useStyles from "../Utils/useStyles";
import {useApi} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import {Checkbox} from "@material-ui/core";
import AuthenticationService from "../../Services/AuthenticationService";

export default function ApplicationList() {
    const classes = useStyles();
    const location = useLocation();
    const api = useApi();
    const [offer, setOffer] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        api.get("/offers/" + location.state.offerId)
            .then((r) => setOffer(r.data))
    }, [location.state.offerId]) // eslint-disable-line react-hooks/exhaustive-deps

    function studentApplicationState(i) {
        switch (offer.applications[i].state) {
            case "APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW":
            case "STUDENT_INVITED_FOR_INTERVIEW_BY_EMPLOYER":
            case "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION":
            case "STUDENT_HIRED_BY_EMPLOYER":
                if (AuthenticationService.getCurrentUserRole() === "admin" && offer.applications[i].state === "STUDENT_HIRED_BY_EMPLOYER") {
                    return <Typography variant={"body1"} style={{color: "green"}}> Application acceptée </Typography>
                }
                return <Typography>
                    {console.log(offer.applications[i].state)}
                    Application acceptée:
                    <Checkbox
                        value="state"
                        checked={offer.applications[i].state === "STUDENT_HIRED_BY_EMPLOYER"}
                        onChange={
                            () => {
                                var copy = {...offer}
                                copy.applications[i].state = copy.applications[i].state === "STUDENT_HIRED_BY_EMPLOYER" ?
                                    "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION" : "STUDENT_HIRED_BY_EMPLOYER"
                                api.put(`applications/state/${offer.applications[i].id}`, offer.applications[i])
                                    .then(r => {
                                        if (r) {
                                            copy.applications[i].state = r.data.state;
                                        }
                                        setOffer(copy)
                                    });
                            }}
                        inputProps={{'aria-label': 'state'}}
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
                    {
                        offer.applications[i].contract === null && AuthenticationService.getCurrentUserRole() === "admin" &&
                        <Link variant={"body1"}
                              to={{
                                  pathname: "/dashboard/contractForm",
                                  state: {...offer.applications[i]}
                              }}
                              style={{display: "block"}}
                        >
                            Genérer le contrat
                        </Link>
                    }
                </Typography>
            case "JOB_OFFER_DENIED_BY_STUDENT":
                return <Typography variant={"body1"} style={{color: "red"}}>
                    L'étudiant a refusé l'offre de stage
                </Typography>
            default:
                return '';
        }
    }

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={(offer.applications ? offer.applications : []).map(o => o.resume.file)}
                                title={(<span>Application<br/>{offer.title}</span>)}>
                {(i, setCurrent) => (
                    <div key={i}>
                        <button
                            type={"button"}
                            className={[classes.linkButton, classes.fileButton].join(' ')}
                            autoFocus={i === 0}
                            onClick={() => {
                                setCurrent(i)
                                setCurrentIndex(i)
                            }}>
                            <Typography color={"textPrimary"} variant={"h5"} style={{display: "block"}}>
                                {offer.applications[i].student.firstName} {offer.applications[i].student.lastName}
                            </Typography>
                        </button>
                        {currentIndex === i &&
                        <div>
                            <Typography color={"textPrimary"} variant={"body1"}>
                                {offer.applications[i].student.phoneNumber} {offer.applications[i].student.email}
                            </Typography>
                            <Typography color={"textPrimary"} variant={"body1"}>
                                {offer.applications[i].student.address}
                            </Typography>
                            {studentApplicationState(i)}
                            {AuthenticationService.getCurrentUserRole() === "employer" &&
                            offer.applications[i].state !== "STUDENT_INVITED_FOR_INTERVIEW_BY_EMPLOYER" &&
                            <Link variant={"body1"}
                                  to={{
                                      pathname: "/dashboard/interviewConvocation",
                                      state: {...offer.applications[i]}
                                  }}
                                  style={{display: "block"}}
                            >
                                Convoquer l'étudiant pour un entrevue
                            </Link>
                            }
                        </div>
                        }
                        <hr/>
                    </div>
                )}
            </PdfSelectionViewer>
        </div>
    )
}