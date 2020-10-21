import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {Link, useHistory, useLocation} from "react-router-dom";
import {useStyles} from "../Utils/useStyles";
import {useApi} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import {Checkbox} from "@material-ui/core";

export default function ApplicationList() {
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const api = useApi();
    const [offer, setOffer] = useState({});
    const [currentApplication, setCurrentApplication] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const noContent = ""
    useEffect(() => {
        api.get("/offers/" + location.state.offerId)
            .then((r) => setOffer(r.data))
    }, [])

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={(offer.applications ? offer.applications : []).map(o => o.resume.file)}
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
                                setCurrentApplication(offer.applications[i])
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
                            <Typography>
                                Application acceptée:
                                <Checkbox
                                    value="hired"
                                    checked={offer.applications[i].hired}
                                    onChange={
                                        () => {
                                            var copy = {...offer}
                                            api.put(`applications/hire/${offer.applications[i].id}`)
                                                .then(r => {
                                                    if (r)
                                                        copy.applications[i].hired = r.data.hired;
                                                    setOffer(copy)
                                                });
                                        }}
                                    inputProps={{'aria-label': 'hired'}}
                                />
                            </Typography>

                            <Link variant={"body1"}
                                  to={{
                                      pathname: "/dashboard/interviewConvocation",
                                      state: {...offer.applications[i]}
                                  }}
                            >
                                Convoquer l'étudiant pour un entrevue
                            </Link>
                        </div>
                        }
                        <hr/>
                    </div>
                )}
            </PdfSelectionViewer>
        </div>
    )
}