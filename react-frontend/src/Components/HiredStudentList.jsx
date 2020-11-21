import React, {useEffect, useState} from "react"
import {useApi, useModal} from "./Utils/Hooks"
import useStyles from "./Utils/useStyles"
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import PdfDocument from "./Utils/PdfDocument";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import AuthenticationService from "../Services/AuthenticationService";
import * as PropTypes from "prop-types";
import OfferDetails from "./Utils/OfferDetails";
import PdfSelectionViewer from "./Utils/PdfSelectionViewer";

function OfferStatus(props) {
    return <div>
        <Typography>
            <button type={"button"}
                    className={[props.classes.linkButton].join(" ")}
                    onClick={props.onClick}>
            </button>
        </Typography>
        <OfferDetails offer={props.offer}/>
    </div>
}

OfferStatus.propTypes = {
    classes: PropTypes.any,
    offer: PropTypes.any,
    onClick: PropTypes.func
}

function ContractStatus(props) {
    return <div>
        <Typography>
            <button type={"button"}
                    className={[props.classes.linkButton].join(" ")}
                    onClick={props.onClick}>
            </button>
        </Typography>
        <PdfSelectionViewer
            documents={props.contract.file}
            title={"Contrats"}></PdfSelectionViewer>
    </div>
}

ContractStatus.propTypes = {
    classes: PropTypes.any,
    contract: PropTypes.any,
    onClick: PropTypes.func
}

export default function HiredStudentList() {
    const classes = useStyles()
    const api = useApi()
    const [applications, setApplications] = useState([])
    const [currentOffer, setCurrentOffer] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentSubtab, setCurrentSubtab] = useState(0)
    const [currentDoc, setCurrentDoc] = useState('')
    const [currentContract, setCurrentContract] = useState([])
    const [isPdfOpen, openPdf, closePdf] = useModal()

    useEffect(() => {
        api.get("/applications")
            .then(r => setApplications(r ? r.data.filter(a => a.state === "JOB_OFFER_ACCEPTED_BY_STUDENT"
                && a.offer.employer.id === AuthenticationService.getCurrentUser().id) : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("/contract")
            .then(r => setCurrentContract(r ? r.data.filter(c => c.signatureState === "SIGNED"
                && c.studentApplication.offer.employer.id === AuthenticationService.getCurrentUser().id) : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("/offers")
            .then(r => setCurrentOffer(r ? r.data.filter(o => o.employer.id === AuthenticationService.getCurrentUser().id) : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return <Grid
        container
        spacing={2}
        className={classes.main}>
        <Grid item xs={5} className={classes.list}>
            <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                Les étudiants embauchés
            </Typography>
            {applications.length !== 0 ? applications.map((item, i) =>
                <div key={i}>
                    <button
                        type={"button"}
                        className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                        onClick={() => {
                            setCurrentIndex(i);
                        }}>
                        <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                            {item.student.firstName} {item.student.lastName}
                        </Typography>
                    </button>
                    {currentIndex === i &&
                    <div>
                        <button
                            type={"button"}
                            className={[classes.linkButton, currentSubtab === 0 ? classes.fileButton : null].join(' ')}
                            onClick={() => setCurrentSubtab(0)}>
                            <Typography color={"textSecondary"} variant={"body2"}>
                                Offre
                            </Typography>
                        </button>
                        <button
                            type={"button"}
                            className={[classes.linkButton, currentSubtab === 1 ? classes.fileButton : null].join(' ')}
                            onClick={() => setCurrentSubtab(1)}>
                            <Typography color={"textSecondary"} variant={"body2"}>
                                Contrat
                            </Typography>
                        </button>
                    </div>
                    }
                    <hr/>
                </div>
            ) : "Aucun étudiants embauché"}
        </Grid>
        <Grid item xs={7} align="start" style={{overflow: "auto", height: "100%"}}>
            {currentSubtab === 0 && currentOffer ? currentOffer.length > 0 ? currentOffer.map((item, index) =>
                    <OfferStatus key={index}
                                 classes={classes}
                                 offer={item}
                                 onClick={() => {
                                     setCurrentDoc(currentOffer.file);
                                     openPdf();
                                 }}/>
                ) : "Aucun étudiant embauché"
                : ""}
            {currentSubtab === 1 && currentContract ? currentContract.length > 0 ? currentContract.map((item, index) =>
                    <ContractStatus key={index}
                                    classes={classes}
                                    contract={item}
                                    onClick={() => {
                                        setCurrentDoc(currentContract.file);
                                        openPdf();
                                    }}/>
                ) : "Le contract n'est pas encore finalisé"
                : ""}
        </Grid>
        <Dialog open={isPdfOpen} onClose={closePdf} maxWidth={"xl"}>
            <DialogContent className={classes.viewbox}>
                <PdfDocument document={currentDoc}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={closePdf} color="primary">
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    </Grid>

}