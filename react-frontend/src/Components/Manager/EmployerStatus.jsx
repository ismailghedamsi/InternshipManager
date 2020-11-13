import {Button, Dialog, DialogContent, Grid, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {useApi, useDateParser, useModal, useTimeParserFromDate} from "../Utils/Hooks";
import OfferDetails from "../Utils/OfferDetails";
import PdfDocument from "../Utils/PdfDocument";
import useStyles from "../Utils/useStyles";
import DialogActions from "@material-ui/core/DialogActions";

export default function StudentStatus() {
    const offersTabIndex = 0;
    const interviewsTabIndex = 1;
    const classes = useStyles();
    const api = useApi();
    const parseDate = useDateParser();
    const parseTimeFromDate = useTimeParserFromDate();
    const [employers, setEmployers] = useState([{}]);
    const [currentEmployerOffers, setCurrentEmployerOffers] = useState([{}]);
    const [currentEmployerInterviews, setCurrentEmployerInterviews] = useState([{}]);
    const [currentEmployerIndex, setCurrentEmployerIndex] = useState(0);
    const [isPdfOpen, openPdf, closePdf] = useModal();
    const [currentDoc, setCurrentDoc] = useState('');
    const [currentSubtab, setCurrentSubtab] = useState(0);

    useEffect(() => {
        api.get("employers").then(resp => {
            setEmployers(resp ? resp.data : [])
        })
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("/offers/employer/" + employers[currentEmployerIndex].username)
            .then(r => {
                setCurrentEmployerOffers(r.data);
            })
    }, [currentEmployerIndex, employers]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (typeof employers[currentEmployerIndex].id !== "undefined") {
            api.get("/interviews/employer/" + employers[currentEmployerIndex].id)
                .then(r => {
                    setCurrentEmployerInterviews(r ? r.data : []);
                })
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    function getCurrentEmployerInterviews(index) {
        api.get("/interviews/employer/" + employers[index].id)
            .then(r => {
                setCurrentEmployerInterviews(r ? r.data : []);
            })
    }

    function hiredStudentsNames(o) {
        return o.reviewState === "APPROVED" ?
            o.applications.map((elem) =>
                <Typography
                    style={{fontWeight: "bold"}}>{elem.student.firstName + " " + elem.student.lastName}</Typography>
            )
            : <Typography style={{fontWeight: "bold"}}>Aucun étudiant n'a été selectionné pour l'offre</Typography>;
    }

    function printOfferStatus(offer) {
        if (offer.reviewState === "PENDING")
            return <span style={{color: "blue"}}>En attente</span>;
        else if (offer.reviewState === "DENIED")
            return <span style={{color: "red"}}>Rejeté<span
                style={{color: "black"}}> : {offer.reasonForRejection} </span></span>;
        else
            return <span style={{color: "green"}}>Approuvé</span>;
    }

    function InterviewStatus(props) {
        function getInterviewState(interview) {
            if (interview.reviewState === "PENDING")
                return <span style={{color: "blue"}}>En attente</span>;
            else if (interview.reviewState === "DENIED")
                return <span style={{color: "red"}}>Rejeté<span
                    style={{color: "black"}}> : {interview.reasonForRejection} </span></span>;
            else
                return <span style={{color: "green"}}>Approuvé</span>;
        }

        return <div>
            <Typography>
                Entrevue pour
                l'étudiant {props.interview.studentApplication ? props.interview.studentApplication.student.firstName + " " + props.interview.studentApplication.student.lastName : ""}
            </Typography>
            <Typography>
                Date : {props.interview ? parseDate(props.interview.date) : ""}
            </Typography>
            <Typography>
                Heure : {props.interview ? parseTimeFromDate(props.interview.date) : ""}
            </Typography>
            <Typography>Titre de l'offre :
                {props.interview.studentApplication ? props.interview.studentApplication.offer.title : ""}</Typography>
            <Typography>
                État : {getInterviewState(props.interview)}
            </Typography>
        </div>;
    }

    return <Grid
        container
        spacing={2}
        className={classes.main}
    >
        <Grid item xs={5} className={classes.list}>
            <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                État des employeurs
            </Typography>
            {employers.map((item, i) =>
                <div key={i}>
                    <button type={"button"}
                            className={[classes.linkButton, i === currentEmployerIndex ? classes.fileButton : null].join(' ')}
                            onClick={() => {
                                setCurrentEmployerIndex(i);
                            }}
                    >
                        <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                            {employers[i].companyName}
                        </Typography>
                    </button>
                    {currentEmployerIndex === i &&
                    <div>
                        <button
                            type={"button"}
                            className={[classes.linkButton, currentSubtab === 0 ? classes.fileButton : null].join(' ')}
                            onClick={() => setCurrentSubtab(0)}>
                            <Typography color={"textSecondary"} variant={"body2"}>
                                Offers
                            </Typography>
                        </button>
                        <button
                            type={"button"}
                            className={[classes.linkButton, currentSubtab === 1 ? classes.fileButton : null].join(' ')}
                            onClick={() => {
                                setCurrentSubtab(1)
                                getCurrentEmployerInterviews(currentEmployerIndex)
                            }
                            }>
                            <Typography color={"textSecondary"} variant={"body2"}>
                                Inteviews
                            </Typography>
                        </button>
                    </div>
                    }
                </div>
            )}
        </Grid>
        <Grid item xs={7} align="center" style={{overflow: "auto", height: "100%"}}>
            {currentSubtab === offersTabIndex ? <h1>Détails des offres</h1> : <h1>Détails des entrevues</h1>}
            {
                currentSubtab === offersTabIndex ?
                    currentEmployerOffers ? currentEmployerOffers.map((o, k) => {
                            return <div>
                                <Typography>
                                    <button type={"button"} className={[classes.linkButton].join(" ")}
                                            onClick={() => {
                                                setCurrentDoc(o.file);
                                                openPdf();
                                            }}
                                    >
                                        {o.title}
                                    </button>
                                </Typography>
                                <OfferDetails key={k} offer={o}/>
                                <Typography>
                                    <span>Liste des étudiants selectionnés</span>
                                </Typography>
                                {hiredStudentsNames(o)}
                                {printOfferStatus(o)}
                                <hr/>
                            </div>
                        })
                        : "L'employeur n'a aucune offre"
                    : ""
            }
            {
                currentSubtab === interviewsTabIndex ?
                    currentSubtab === interviewsTabIndex && currentEmployerInterviews ? currentEmployerInterviews.map((interview, index) => {
                            return <div>
                                <InterviewStatus key={index} classes={classes} interview={interview}/>
                                <hr/>
                            </div>
                        })
                        : "L'employeur n'a programmé aucune entrevue"
                    : ""
            }
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
    </Grid>;
}
