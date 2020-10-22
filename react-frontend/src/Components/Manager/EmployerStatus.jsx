import {Button, Dialog, DialogContent, Grid, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {useApi, useModal} from "../Utils/Hooks";
import OfferDetails from "../Utils/OfferDetails";
import PdfDocument from "../Utils/PdfDocument";
import useStyles from "../Utils/useStyles";
import DialogActions from "@material-ui/core/DialogActions";


export default function StudentStatus() {
    const classes = useStyles();
    const api = useApi();
    const [employers, setEmployers] = useState([{}]);
    const [currentEmployerOffers, setCurrentEmployerOffers] = useState([{}]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPdfOpen, openPdf, closePdf] = useModal();
    const [currentDoc, setCurrentDoc] = useState('');
    useEffect(() => {
        api.get("employers").then(resp => {
            setEmployers(resp ? resp.data : [])
        })
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("/offers/employer/" + employers[currentIndex].username)
            .then(r => {
                setCurrentEmployerOffers(r.data);
            })
    }, [currentIndex, employers]); // eslint-disable-line react-hooks/exhaustive-deps

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
            return (<span style={{color: "red"}}>Rejeté<span
                style={{color: "black"}}> : {offer.reasonForRejection} </span></span>);
        else
            return <span style={{color: "green"}}>Approuvé</span>;
    }

    return (
        <Grid
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
                                className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                                onClick={() => {
                                    setCurrentIndex(i);
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
                <h1>Détails des offres</h1>
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
}
