import {Button, Dialog, DialogContent, Grid, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {useApi, useModal} from "../Utils/Hooks";
import OfferDetails from "../Utils/OfferDetails";
import PdfDocument from "../Utils/PdfDocument";
import {useStyles} from "../Utils/useStyles";
import DialogActions from "@material-ui/core/DialogActions";


export default function StudentStatus() {
    const classes = useStyles();
    const api = useApi();
    const [employers, setEmployers] = useState([{}]);
    const [currentEmployer, setCurrentEmployer] = useState({});
    const [currentEmployerOffers, setCurrentEmployerOffers] = useState([{}]);
    const [currentOffer, setCurrentOffer] = useState({});
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isPdfOpen, openPdf, closePdf] = useModal();
    const [currentDoc, setCurrentDoc] = useState('');
    useEffect(() => {
        api.get("employers").then(resp => {
            setEmployers(resp ? resp.data : [])
            setCurrentEmployer(employers[0])
        })
    }, []);

    useEffect(() => {
        api.get("/offers/employer/" + currentEmployer.username)
            .then(r => {
                setCurrentEmployerOffers(r.data);
                console.log("Current Employer updated ")
            })
    }, [currentEmployer]);


    return (
        <Grid
            container
            spacing={2}
            className={classes.main}
        >
            <Grid item xs={5} className={classes.list}>
                <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                    Employés
                </Typography>
                {employers.map((item, i) =>
                    <div key={i}>
                        <button type={"button"}
                                className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                                onClick={() => {
                                    setCurrentIndex(i);
                                    setCurrentEmployer(employers[i]);
                                }}
                        >
                            <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                                {employers[i].companyName}
                            </Typography>
                        </button>

                    </div>
                )}
            </Grid>
            <Grid item xs={7} align="center" style={{overflow: "auto", height: "100%"}}>
                <h1>Detaille des l'offres</h1>

                {
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
        </Grid>
    );

    function hiredStudentsNames(o) {
        return o.reviewState == "APPROVED" ?
            o.applications.map((elem) =>
                <Typography
                    style={{fontWeight: "bold"}}>{elem.student.firstName + " " + elem.student.lastName}</Typography>
            )
            : "Aucun étudiant n'a été selectionné pour l'offre";
    }

    function printOfferStatus(offer) {


        if (offer.reviewState == "PENDING")
            return <span style={{color: "blue"}}>En attente</span>;
        else if (offer.reviewState == "DENIED")
            return (<span style={{color: "red"}}>Rejeté</span>);
        else
            return <span style={{color: "green"}}>Approuvé</span>;
    }


}