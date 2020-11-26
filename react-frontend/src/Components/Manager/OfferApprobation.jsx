import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from "react";
import TextboxModal from "../Utils/Modal/TextboxModal";
import OfferDetails from "../Utils/OfferDetails";
import PdfSelectionViewer from "../Utils/PDF/PdfSelectionViewer";
import {useApi, useModal} from "../Utils/Services/Hooks";
import useStyles from "../Utils/Style/useStyles";
import ApprovalButtons from "../Utils/ApprovalButtons";

export default function OfferApprobation({count}) {
    const classes = useStyles()
    const api = useApi()
    const [offers, setOffers] = useState([])
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal()

    useEffect(() => {
        api.get("/offers/pending")
            .then(r => setOffers(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => count(offers.length))

    function sendDecision(index, reviewState, reason = "") {
        const nextState = [...offers]
        nextState[index].applications = undefined
        nextState[index].reviewState = reviewState
        nextState[index].reasonForRejection = reason
        return api.put("/offers/" + nextState[index].id, nextState[index])
            .then(() => {
                nextState.splice(index, 1)
                setOffers(nextState)

                if (currentOfferIndex >= nextState.length)
                    setCurrentOfferIndex(0)

                closeReasonModal()
            })
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Offres de stage en attente"}>
            {(i, setCurrent) =>
                <div key={i}>
                    <Button
                        onClick={() => {
                            setCurrent(i)
                            setCurrentOfferIndex(i)
                        }}
                        variant={i === currentOfferIndex ? "contained" : "outlined"}
                        color={"primary"}>
                        <Typography variant={"body1"} display={"inline"}>
                            {offers[i].title}&ensp;
                        </Typography>
                        <Typography variant={"body2"} display={"inline"}>
                            {offers[i].employer.companyName} {offers[i].employer.contactName}
                        </Typography>
                    </Button>
                    {currentOfferIndex === i && <>
                        <OfferDetails offer={offers[i]}/>
                        <Grid container spacing={1} className={classes.buttonDiv}>
                            <Grid item xs={6}>
                                <Button
                                    onClick={() => sendDecision(i, "APPROVED")}
                                    variant={"contained"}
                                    color={"primary"}
                                    fullWidth
                                    style={{backgroundColor: "green"}}
                                >
                                    <i className="fa fa-check-square" style={{color: "white"}}/>&ensp;Approuver
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    onClick={() => {
                                        setCurrentOfferIndex(i)
                                        openReasonModal()
                                    }}
                                    variant={"contained"}
                                    color={"primary"}
                                    fullWidth
                                    style={{backgroundColor: "red"}}
                                >
                                    <i className="fa fa-ban" style={{color: "white"}}/>&ensp;Refuser
                                </Button>
                            </Grid>
                        </Grid>
                        <ApprovalButtons
                            onApprove={() => sendDecision(i, "APPROVED")}
                            onDeny={() => {
                                setCurrentOfferIndex(i)
                                openReasonModal()
                            }}
                            approveLabel={"Approuver"}
                            denyLabel={"Refuser"}
                        />
                    </>}
                    <hr className={classes.hrStyle}/>
                </div>
            }
        </PdfSelectionViewer>
        <TextboxModal
            isOpen={isReasonModalOpen}
            hide={closeReasonModal}
            title={"Justifiez le refus"}
            onSubmit={async values => sendDecision(currentOfferIndex, "DENIED", values.message)}
        />
    </div>
}
