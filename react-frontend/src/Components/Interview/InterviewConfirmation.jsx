import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import AuthenticationService from "../../Services/AuthenticationService";
import {useStyles} from "../Utils/useStyles";
import {useApi, useModal} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import OfferDetails from "../Utils/OfferDetails";
import TextboxModal from "../Utils/TextboxModal";

export default function InterviewConfirmation() {
    const classes = useStyles();
    const api = useApi();
    const [offers, setOffers] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReasonOfInterviewModalOpen, openReasonOfInterviewModal, closeReasonOfInterviewModal] = useModal();

    function sendInterviewDecision(index, studentDecision, reason = "") {
        const nextState = [...interviews];
        const interview = nextState[index];
        interview.reviewState = studentDecision;
        interview.reasonForRejection = reason;
        return api.put("/interviews/" + nextState[index].id, nextState[index])
            .then(result => {
                if (result)
                    nextState[index] = result.data;
                setInterviews(nextState);
                closeReasonOfInterviewModal()
            })
    }

    useEffect(() => {
        api.get("/offers/student/" + AuthenticationService.getCurrentUser().id)
            .then(result => setOffers(result ? result.data.filter(offer => new Date(offer.limitDateToApply) >= new Date()) : []))
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("/interviews/student/" + AuthenticationService.getCurrentUser().id)
            .then(result => setInterviews(result ? result.data : []))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function hasEmployeurAcceptedStudentToInterview(i) {
        if (interviews[i]) {
            return interviews[i].studentApplication.student.id === AuthenticationService.getCurrentUser().id !== undefined;
        }
        return false;
    }

    function getStudentDecisionForInterview(i) {
        if (interviews[i]) {
            if (hasEmployeurAcceptedStudentToInterview(i) && interviews[i].reviewState === "APPROVED") {
                return " Vous avez accepté l'entrevue";
            } else if (hasEmployeurAcceptedStudentToInterview(i) && interviews[i].reviewState === "DENIED") {
                return " Vous avez refusé l'entrevue";
            }
        }
        return ""
    }

    function getDateEntretien(i) {
        if (interviews[i]) {
            if (hasEmployeurAcceptedStudentToInterview(i)) {
                return new Date(interviews[i].date).toLocaleString()
            }
        }
        return ""
    }

    return (
        <div style={{height: "100%"}}>
            <div>
                <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Entrevues"}>
                    {(i, setCurrent) => (
                        <div key={i}>
                            <button
                                type={"button"}
                                className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                                onClick={() => {
                                    setCurrentIndex(i);
                                    setCurrent(i)
                                }}
                            >
                                <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                                    {offers[i].title + " "}
                                </Typography>
                                <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                                    {offers[i].employer.companyName}
                                </Typography>
                            </button>
                            {currentIndex === i && <OfferDetails offer={offers[i]}/>}
                            <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                                Date de l'entretien : {getDateEntretien(i)}
                            </Typography>
                            {hasEmployeurAcceptedStudentToInterview(i) && interviews[i].reviewState === "PENDING" &&
                            <div className={classes.buttonDiv} style={{display: "block"}}>
                                Acceptez l'entrevue
                                <button
                                    type={"button"}
                                    className={[classes.linkButton].join(' ')}
                                    onClick={() => sendInterviewDecision(i, "APPROVED")}
                                    style={{marginRight: 5}}
                                ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                                Refusez l'entrevue
                                <button
                                    type={"button"}
                                    className={[classes.linkButton].join(' ')}
                                    onClick={() => {
                                        setCurrentIndex(i)
                                        openReasonOfInterviewModal()
                                    }}
                                ><i className="fa fa-ban" style={{color: "red"}}/></button>
                            </div>
                            }
                            <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                                {getStudentDecisionForInterview(i)}
                            </Typography>
                            <hr/>
                        </div>
                    )}
                </PdfSelectionViewer>
            </div>
            <TextboxModal
                isOpen={isReasonOfInterviewModalOpen}
                hide={closeReasonOfInterviewModal}
                title={"Justifiez le refus"}
                onSubmit={async (values) => sendInterviewDecision(currentIndex, "DENIED", values.message)}
            />
        </div>
    );
}