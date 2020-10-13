import React, {useEffect, useState} from 'react';
import {Typography} from "@material-ui/core";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import TextboxModal from "../Utils/TextboxModal";
import {useApi, useModal} from "../Utils/Hooks";
import {useStyles} from "../Utils/useStyles";

export default function OfferApprobation() {
    const classes = useStyles();
    const api = useApi();
    const [offers, setOffers] = useState([]);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal();

    useEffect(() => {
        api.get("/offers/pending")
            .then(r => setOffers(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function sendDecision(index, reviewState, reason = "") {
        const nextState = [...offers];
        delete nextState[index].applications;
        nextState[index].reviewState = reviewState;
        nextState[index].reasonForRejection = reason;
        return api.put("/offers/" + nextState[index].id, nextState[index])
            .then(() => {
                nextState.splice(index, 1)
                setOffers(nextState)

                if (currentOfferIndex >= nextState.length)
                    setCurrentOfferIndex(0)

                closeReasonModal()
            })
    }

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={offers.map(o => o.file)} title={"En attente d'approbation"}>
                {(i, setCurrent) => (
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
                                setCurrent(i);
                                setCurrentOfferIndex(i);
                            }}
                        >
                            <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                                {" " + offers[i].title + " "}
                            </Typography>
                            <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                                {offers[i].employer.companyName} {offers[i].employer.contactName}
                            </Typography>
                        </button>
                        {currentOfferIndex === i &&
                        <div>
                            <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                {"Date limite d'application : " + (offers[i].limitDateToApply + "").split("T")[0]}
                            </Typography>

                            <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                {"Date de création de l'offre : " + (offers[i].creationDate + "").split("T")[0]}
                            </Typography>

                            <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                {"Nombre de semaines : " + offers[i].nbOfWeeks}
                            </Typography>

                            <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                {"Salaire horaire : $ " + offers[i].salary}
                            </Typography>

                            <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                {"Horaire : " + (offers[i].beginHour < 10 ? "0" : "") + offers[i].beginHour + ":00 - " + offers[i].endHour + ":00"}
                            </Typography>

                            <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                {"Description de l'offre : " + offers[i].description}
                            </Typography>
                        </div>
                        }
                        <hr/>
                    </div>
                )}
            </PdfSelectionViewer>
            <TextboxModal
                isOpen={isReasonModalOpen}
                hide={closeReasonModal}
                title={"Justifiez le refus"}
                onSubmit={async (values) => sendDecision(currentOfferIndex, "DENIED", values.reasonForRejection)}
            />
        </div>
    )
}


