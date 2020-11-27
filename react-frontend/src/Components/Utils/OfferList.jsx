import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";
import {useApi} from "../../Services/Hooks";
import OfferDetails from "../Utils/OfferDetails";
import PdfSelectionViewer from "./PDF/PdfSelectionViewer";
import useStyles from "./Style/useStyles";

export default function OfferList({count}) {
    const classes = useStyles()
    const api = useApi()
    const history = useHistory()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [offers, setOffers] = useState([])

    useEffect(() => {
        if (AuthenticationService.getCurrentUserRole() === "employer") {
            api.get("/offers/employer/" + AuthenticationService.getCurrentUser().email)
                .then(r => setOffers(r ? r.data : []))
        } else if (AuthenticationService.getCurrentUserRole() === "admin") {
            api.get("/offers/approved")
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
        return api.delete("/offers/" + nextState[index].id)
            .then(() => {
                nextState.splice(index, 1)

                if (currentIndex >= nextState.length)
                    setCurrentIndex(0)

                setOffers(nextState)
            })
    }

    function getOfferState(offer) {
        if (offer.reviewState === "PENDING")
            return <span style={{color: "blue"}}>En attente</span>
        else if (offer.reviewState === "REJECTED")
            return <span style={{color: "red"}}>Rejeté
                <span style={{color: "black"}}>
                    : {offer.reasonForRejection}
                </span>
        </span>
        else
            return <span style={{color: "green"}}>Approuvé</span>
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Offres de stage"}>
            {(i, setCurrent) =>
                <div key={i}>
                    <div className={classes.buttonDiv}>
                        <button
                            type={"button"}
                            className={classes.linkButton}
                            onClick={() => deleteOffer(i)}>
                            <i className="fa fa-trash" style={{color: "red"}}/>
                        </button>
                    </div>
                    <button
                        type={"button"}
                        className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(" ")}
                        autoFocus={i === 0}
                        onClick={() => {
                            setCurrentIndex(i)
                            setCurrent(i)
                        }}
                    >
                        <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                            {" " + offers[i].title + " "}
                        </Typography>
                        <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                            {offers[i].employer.companyName} {offers[i].employer.contactName}
                        </Typography>
                        <Typography
                            variant={"body2"}>
                            État : {getOfferState(offers[i])}
                        </Typography>
                    </button>
                    {currentIndex === i && <OfferDetails offer={offers[i]}/>}
                    {offers[i].applications.length !== 0 &&
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => {
                            if (AuthenticationService.getCurrentUserRole() === "employer") {
                                history.push("/dashboard/applications", {offerId: offers[i].id})
                            } else if (AuthenticationService.getCurrentUserRole() === "admin") {
                                history.push("/dashboard/applicationsAdmin", {offerId: offers[i].id})
                            }
                        }}
                    >
                        Voir les applications
                    </Button>
                    }
                    <hr/>
                </div>
            }
        </PdfSelectionViewer>
    </div>
}