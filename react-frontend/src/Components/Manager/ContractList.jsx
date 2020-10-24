import React, {useEffect, useState} from "react";
import {useStyles} from "../Utils/useStyles";
import {useApi} from "../Utils/Hooks";
import {Typography} from "@material-ui/core";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";

export default function ContractList() {
    const classes = useStyles();
    const api = useApi();
    const [offers, setOffers] = useState([]);
    const [students, setStudents] = useState([]);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

    useEffect(() => {
        api.get("/offers/approved")
            .then(r => setOffers(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("students").then(r => setStudents(r ? r.data : []))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Contracts"}>
                {(i, setCurrent) => (
                    <div key={i}>
                        <button
                            type={"button"}
                            className={[classes.linkButton, i === currentOfferIndex ? classes.fileButton : null].join(' ')}
                            onClick={() => {
                                setCurrent(i);
                                setCurrentOfferIndex(i);
                            }}
                        >
                            <Typography color={"textPrimary"} variant={"body1"}>
                                {offers[i].title}
                            </Typography>
                            <Typography color={"textSecondary"} variant={"body2"}>
                                {offers[i].employer.companyName}
                            </Typography>
                            {currentOfferIndex === i && offers[i].applications.length !== 0 && offers[i].applications.find(a => a.reviewState === "APPROVED") &&
                            <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                                Liste des étudiants qui ont été embauchés :
                                {offers[i].applications[i].student.firstName + " " + offers[i].applications[i].student.lastName}
                            </Typography>
                            }
                        </button>
                    </div>
                )}
            </PdfSelectionViewer>
        </div>
    )
}