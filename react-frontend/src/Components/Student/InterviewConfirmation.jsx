import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import AuthenticationService from "../../Services/AuthenticationService";
import {useStyles} from "../Utils/useStyles";
import {useApi, useModal} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import OfferDetails from "../Utils/OfferDetails";
import TextboxModal from "../Utils/TextboxModal";

export default function OfferApplication() {
    const classes = useStyles();
    const api = useApi();
    const [offers, setOffers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal();

    function sendDecision(index, studentDecision, reason = "") {
        const nextState = [...offers];
        const application = nextState[index].applications.find(a => a.student.id === AuthenticationService.getCurrentUser().id);
        application.reasonForRejection = reason;
        application.reviewState = studentDecision;
        return api.put("/applications/interviews/" + application.id, application)
            .then(result => {
                nextState[index].applications.splice(nextState[index].applications.indexOf(application), 1, result.data);
                setOffers(nextState);
                closeReasonModal()
            })
    }

    useEffect(() => {
        api.get("/offers/student/" + AuthenticationService.getCurrentUser().id)
            .then(result => setOffers(result ? result.data.filter(offer => new Date(offer.limitDateToApply) >= new Date()) : []))
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    function hasEmployeurAcceptedStudentToInterview(offer, student) {
        return offer.applications.find(a => a.student.id === student.id && a.hasEmployerAccepted === true && a.reviewState === "PENDING") !== undefined && offer.applications.length !== 0;
    }

    function getStudentDecision(offer, student) {
        if (offer.applications.find(a => a.student.id === student.id && a.reviewState === "APPROVED")) {
            return " Vous avez accepté l'entrevue";
        } else if (offer.applications.find(a => a.student.id === student.id && a.reviewState === "DENIED")) {
            return " Vous avez refusé l'entrevue";
        }
    }

    function getDateEntretien(i) {
        const nextState = [...offers];
        const application = nextState[i].applications.find(a => a.student.id === AuthenticationService.getCurrentUser().id);
        return new Date(application.date);
    }

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Les entrevues"}>
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
                        {hasEmployeurAcceptedStudentToInterview(offers[i], AuthenticationService.getCurrentUser()) &&
                        <div className={classes.buttonDiv} style={{display: "block"}}>
                            Date de l'entretien : {getDateEntretien(i)}
                            Acceptez l'entrevue
                            <button
                                type={"button"}
                                className={[classes.linkButton].join(' ')}
                                onClick={() => sendDecision(i, "APPROVED")}
                                style={{marginRight: 5}}
                            ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                            Refusez l'entrevue
                            <button
                                type={"button"}
                                className={[classes.linkButton].join(' ')}
                                onClick={() => {
                                    setCurrentIndex(i)
                                    openReasonModal()
                                }}
                            ><i className="fa fa-ban" style={{color: "red"}}/></button>
                        </div>
                        }
                        <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                            {getStudentDecision(offers[i], AuthenticationService.getCurrentUser())}
                        </Typography>
                        <hr/>
                    </div>
                )}
            </PdfSelectionViewer>
            <TextboxModal
                isOpen={isReasonModalOpen}
                hide={closeReasonModal}
                title={"Justifiez le refus"}
                onSubmit={async (values) => sendDecision(currentIndex, "DENIED", values.message)}
            />
        </div>
    );
}