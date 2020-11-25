import {Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import AuthenticationService from "../../Services/AuthenticationService";
import {useApi} from "../../Services/Hooks";
import OfferDetails from "../Utils/OfferDetails";
import PdfSelectionViewer from "../Utils/PDF/PdfSelectionViewer";
import useStyles from "../Utils/Style/useStyles";

export default function HiredStudentList() {
    const classes = useStyles()
    const api = useApi()
    const [contracts, setContracts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        api.get("/contract")
            .then(r => setContracts(r ? r.data.filter(c => c.signatureState === "SIGNED"
                && c.studentApplication.offer.employer.id === AuthenticationService.getCurrentUser().id) : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={contracts.map(c => c.file)} title={"Les étudiants embauchés"}>
            {(i, setCurrent) =>
                <div key={i}>
                    <button
                        type={"button"}
                        className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(" ")}
                        autoFocus={i === 0}
                        onClick={() => {
                            setCurrentIndex(i)
                            setCurrent(i)
                        }}>
                        <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                            {contracts[i].studentApplication.student.firstName} {contracts[i].studentApplication.student.lastName}
                        </Typography>
                    </button>
                    {currentIndex === i && <div>
                        <OfferDetails offer={contracts[i].studentApplication.offer}/>
                    </div>}
                    <hr/>
                </div>
            }
        </PdfSelectionViewer>
    </div>
}