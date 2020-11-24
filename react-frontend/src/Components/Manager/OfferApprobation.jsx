import {Typography} from "@material-ui/core";
import React, {useEffect, useState} from 'react';
import TextboxModal from "../Utils/Modal/TextboxModal";
import OfferDetails from "../Utils/OfferDetails";
import PdfSelectionViewer from "../Utils/PDF/PdfSelectionViewer";
import {useApi, useModal} from "../Utils/Services/Hooks";
import useStyles from "../Utils/Style/useStyles";

export default function OfferApprobation() {
    const classes = useStyles()
    const api = useApi()
    const [offers, setOffers] = useState([])
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal()

    useEffect(() => {
        api.get("/offers/pending")
            .then(r => setOffers(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function sendDecision(index, reviewState, reason = "") {
        const nextState = [...offers]
        delete nextState[index].applications
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
        <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Offres de stage en attente d'approbation"}>
            {(i, setCurrent) =>
                <div key={i}>
                    <div className={classes.buttonDiv}>
                        <button
                            type={"button"}
                            className={classes.linkButton}
                            onClick={() => sendDecision(i, "APPROVED")}
                            style={{marginRight: 5}}
                        ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                        <button
                            type={"button"}
                            className={classes.linkButton}
                            onClick={() => {
                                setCurrentOfferIndex(i)
                                openReasonModal()
                            }}
                        ><i className="fa fa-ban" style={{color: "red"}}/></button>
                    </div>
                    <button
                        type={"button"}
                        className={[classes.linkButton, i === currentOfferIndex ? classes.fileButton : null].join(' ')}
                        autoFocus={i === 0}
                        onClick={() => {
                            setCurrent(i)
                            setCurrentOfferIndex(i)
                        }}>
                        <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                            {" " + offers[i].title + " "}
                        </Typography>
                        <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                            {offers[i].employer.companyName} {offers[i].employer.contactName}
                        </Typography>
                    </button>
                    {currentOfferIndex === i && <OfferDetails offer={offers[i]}/>}
                    <hr/>
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
