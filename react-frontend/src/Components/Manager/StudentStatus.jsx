import React, {useEffect, useState} from "react";
import {useApi, useModal} from "../Utils/Hooks";
import {useStyles} from "../Utils/useStyles";
import {Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import PdfDocument from "../Utils/PdfDocument";
import * as PropTypes from "prop-types";
import OfferDetails from "../Utils/OfferDetails";

function ResumeStatus(props) {
    function getResumeState(resume) {
        if (!resume.reviewed)
            return <span style={{color: "blue"}}>En attente</span>;
        else if (!resume.approuved)
            return (<span style={{color: "red"}}>Rejeté<span
                style={{color: "black"}}> : {resume.reasonForRejection} </span></span>);
        else
            return <span style={{color: "green"}}>Approuvé</span>;
    }

    return <div>
        <Typography>
            <button type={"button"}
                    className={[props.classes.linkButton].join(" ")}
                    onClick={props.onClick}>
                {props.resume.name}
            </button>
        </Typography>
        <Typography>
            État: {getResumeState(props.resume)}
        </Typography>
        <hr/>
    </div>;
}

ResumeStatus.propTypes = {
    classes: PropTypes.any,
    onClick: PropTypes.func,
    resume: PropTypes.any
};

function OfferStatus(props) {
    function getOfferState(offer) {
        if (!offer.reviewState === "PENDING")
            return <span style={{color: "blue"}}>En attente</span>;
        else if (!offer.reviewState === "REJECTED")
            return (<span style={{color: "red"}}>Rejeté<span
                style={{color: "black"}}> : {offer.reasonForRejection} </span></span>);
        else
            return <span style={{color: "green"}}>Approuvé</span>;
    }

    return <div>
        <Typography>
            <button type={"button"}
                    className={[props.classes.linkButton].join(" ")}
                    onClick={props.onClick}>
                {props.offer.title}
            </button>
        </Typography>
        <OfferDetails offer={props.offer}/>
        <Typography
            variant={"body2"}>
            État : {getOfferState(props.offer)}
        </Typography>
        <hr/>
    </div>;
}

OfferStatus.propTypes = {
    classes: PropTypes.any,
    onClick: PropTypes.func,
    offer: PropTypes.any
};

function ApplicationStatus(props) {
    console.log(props.application)
    return <div>
        <Typography>
            Application sur l'offre {props.application.offer.title} avec le CV {props.application.resume.name}
        </Typography>
        <hr/>
    </div>;
}

ApplicationStatus.propTypes = {
    application: PropTypes.any
};

export default function StudentStatus() {
    const classes = useStyles();
    const api = useApi();
    const [students, setStudents] = useState([{}]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSubtab, setCurrentSubtab] = useState(0);
    const [currentDoc, setCurrentDoc] = useState('');
    const [isPdfOpen, openPdf, closePdf] = useModal();

    useEffect(() => {
        api.get("students").then(resp => setStudents(resp ? resp.data : []))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <Grid
            container
            spacing={2}
            className={classes.main}>
            <Grid item xs={5} className={classes.list}>
                <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                    Étudiants
                </Typography>
                {students.map((item, i) =>
                    <div key={i}>
                        <button
                            type={"button"}
                            className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                            onClick={() => {
                                setCurrentIndex(i);
                            }}>
                            <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                                {students[i].firstName} {students[i].lastName}
                            </Typography>
                        </button>
                        {currentIndex === i &&
                        <div>
                            <button
                                type={"button"}
                                className={[classes.linkButton, currentSubtab === 0 ? classes.fileButton : null].join(' ')}
                                onClick={() => setCurrentSubtab(0)}>
                                <Typography color={"textSecondary"} variant={"body2"}>
                                    CVs
                                </Typography>
                            </button>
                            <button
                                type={"button"}
                                className={[classes.linkButton, currentSubtab === 1 ? classes.fileButton : null].join(' ')}
                                onClick={() => setCurrentSubtab(1)}>
                                <Typography color={"textSecondary"} variant={"body2"}>
                                    Offres permise
                                </Typography>
                            </button>
                            <button
                                type={"button"}
                                className={[classes.linkButton, currentSubtab === 2 ? classes.fileButton : null].join(' ')}
                                onClick={() => setCurrentSubtab(2)}>
                                <Typography color={"textSecondary"} variant={"body2"}>
                                    Applications
                                </Typography>
                            </button>
                        </div>
                        }
                        <hr/>
                    </div>
                )}
            </Grid>
            <Grid item xs={7} align="center" style={{overflow: "auto", height: "100%"}}>
                {currentSubtab === 0 && (students[currentIndex].resumes ? students[currentIndex].resumes : []).map((resume, index) =>
                    <ResumeStatus key={index}
                                  classes={classes}
                                  resume={resume}
                                  onClick={() => {
                                      setCurrentDoc(resume.file);
                                      openPdf();
                                  }}/>
                )}
                {currentSubtab === 1 && (students[currentIndex].allowedOffers ? students[currentIndex].allowedOffers : []).map((offer, index) =>
                    <OfferStatus key={index}
                                 classes={classes}
                                 offer={offer}
                                 onClick={() => {
                                     setCurrentDoc(offer.file);
                                     openPdf();
                                 }}/>
                )}
                {currentSubtab === 2 && (students[currentIndex].applications ? students[currentIndex].applications : []).map((appl, index) =>
                    <ApplicationStatus key={index}
                                       application={appl}/>
                )}
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
    );
}