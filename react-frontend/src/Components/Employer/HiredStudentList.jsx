import React, {useEffect, useState} from "react"
import {useApi} from "../Utils/Hooks"
import useStyles from "../Utils/useStyles"
import {Typography} from "@material-ui/core";
import AuthenticationService from "../../Services/AuthenticationService";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";

export default function HiredStudentList() {
    const classes = useStyles()
    const api = useApi()
    const [contracts, setContracts] = useState([])
    const [applications, setApplications] = useState([])
    const [currentOffer, setCurrentOffer] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        api.get("/applications")
            .then(r => setApplications(r ? r.data.filter(a => a.state === "JOB_OFFER_ACCEPTED_BY_STUDENT"
                && a.offer.employer.id === AuthenticationService.getCurrentUser().id) : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("/contract")
            .then(r => setContracts(r ? r.data.filter(c => c.signatureState === "SIGNED"
                && c.studentApplication.offer.employer.id === AuthenticationService.getCurrentUser().id) : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("/offers")
            .then(r => setCurrentOffer(r ? r.data.filter(o => o.employer.id === AuthenticationService.getCurrentUser().id) : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={contracts.map(c => c.file)} title={"Les étudiants embauchés"}>
            {(i, setCurrent) => <div key={i}>
                <button
                    type={"button"}
                    className={[classes.buttonDiv, i === currentIndex ? classes.fileButton : null].join(' ')}
                    autoFocus={i === 0}
                    onClick={() => {
                        setCurrentIndex(i)
                        setCurrent(i)
                    }}>
                    <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                        {contracts[i].studentApplication.student.firstName} {contracts[i].studentApplication.student.lastName}
                    </Typography>
                </button>
                <Typography
                    variant={"body2"}>

                </Typography>
                <hr/>
            </div>}
        </PdfSelectionViewer>
    </div>
}