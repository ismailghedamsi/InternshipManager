import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";
import { useApi } from "../../Services/Hooks";
import OfferDetails from "../Utils/OfferDetails";
import PdfSelectionViewer from "./PDF/PdfSelectionViewer";
import useStyles from "./Style/useStyles";

export default function OfferList({count}) {
    const classes = useStyles()
    const api = useApi()
    const history = useHistory()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [offers, setOffers] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [buttonSubmitting, setButtonSubmitting] = useState(-1)

    useEffect(() => {
        if (AuthenticationService.getCurrentUserRole() === "employer") {
            api.get("/offers/employer/" + AuthenticationService.getCurrentUser().email)
                    .then(r => setOffers(r ? r.data : []))
        } else if (AuthenticationService.getCurrentUserRole() === "admin") {
            api.get("/offers")
                    .then(r => {
                        setOffers(r ? r.data : [])
                    })
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (count)
            count(offers.length)
    })

    function deleteOffer(index) {
        const nextState = [...offers]
        
        return api.delete("/offers/" + nextState[index].id).then(() => {
            nextState.splice(index, 1)

            if (currentIndex >= nextState.length)
                setCurrentIndex(0)

            setOffers(nextState)
        })
    }

    function getOfferState(offer) {
        if (offer.reviewState === "PENDING")
            return <span style={{color: "blue"}}>En attente</span>
        else if (offer.reviewState === "DENIED")
            return <span style={{color: "red"}}>Rejeté
                <span style={{color: "black"}}>
                    : {offer.reasonForRejection}
                </span>
        </span>
        else
            return <span style={{color: "green"}}>Approuvé</span>
    }

    function showDeleteButtonCondition(i) {
        return AuthenticationService.getCurrentUserRole() === "employer" && i === currentIndex
    }

    function redirection(i) {
        if (AuthenticationService.getCurrentUserRole() === "employer") {
            return history.push("/dashboard/applications", {offerId: offers[i].id})
        } else if (AuthenticationService.getCurrentUserRole() === "admin") {
            return history.push("/dashboard/applicationsAdmin", {offerId: offers[i].id})
        }
        return "";
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Offres de stage"}>
            {(i, setCurrent) =>
                    <div key={i}>
                        <Button
                            className={[i === currentIndex ? classes.fileButton : null].join(" ")}
                            onClick={() => {
                                setCurrentIndex(i)
                                setCurrent(i)
                            }}
                        >
                            <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                                &ensp;{offers[i].title}&ensp;
                            </Typography>
                            <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                                {offers[i].employer.companyName}-{offers[i].employer.contactName}&ensp;
                            </Typography>
                        </Button>
                        <Typography
                                variant={"body2"}>
                            État : {getOfferState(offers[i])}
                        </Typography>
                        {currentIndex === i && <OfferDetails offer={offers[i]}/>}
                        {offers[i].applications.length !== 0 && <>
                            <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    onClick={() => redirection(i)}
                            >
                                Voir les applications
                            </Button>
                            &ensp;
                        </>}
                        {showDeleteButtonCondition(i) &&
                        <Button
                            variant={"contained"}
                            color={"secondary"}
                            onClick={() => {
                                setIsSubmitting(true)
                                setButtonSubmitting(i)
                                deleteOffer(i).then(() => {
                                    setIsSubmitting(false)
                                    setButtonSubmitting(-1)
                                })
                            }}
                            disabled={isSubmitting && buttonSubmitting === i}
                        >
                            <i className="fa fa-trash"/>&ensp;Supprimer
                        </Button>}
                        {isSubmitting && buttonSubmitting === i && <CircularProgress size={18}/>}
                        <Divider className={classes.dividers}/>
                    </div>}
        </PdfSelectionViewer>
    </div>
}