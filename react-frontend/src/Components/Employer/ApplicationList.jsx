import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {useLocation} from "react-router-dom";
import {useStyles} from "../Utils/useStyles";
import {useApi} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";

export default function ApplicationList() {
    const classes = useStyles();
    const location = useLocation();
    const api = useApi();
    const [offer, setOffer] = useState({applications: [{resume: {}, student: {}}]});
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        api.get("/offers/" + location.state.offerId)
            .then((r) => setOffer(r.data))
    })

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={offer.applications.map(o => o.resume.file)}
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
                        </div>
                        }
                        <hr/>
                    </div>
                )}
            </PdfSelectionViewer>
        </div>
    )
}