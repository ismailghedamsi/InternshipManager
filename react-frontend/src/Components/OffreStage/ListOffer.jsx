import React, {useEffect, useState} from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import {Document, Page, pdfjs} from 'react-pdf';
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AuthenticationService from '../../js/AuthenticationService';
import Container from "@material-ui/core/Container";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const useStyles = makeStyles((theme) => ({
    linkButton: {
        fontSize: "1.5rem",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        margin: 0,
        padding: 5,
        borderRadius: 0,
        textAlign: "left",
        '&:hover': {
            backgroundColor: "#00000055",
        },
        '&:focus': {
            outline: "none",
        }
    },
    fileButton: {
        '&:focus': {
            outline: "none",
            backgroundColor: theme.palette.secondary.light,
        }
    },
    viewbox: {
        height: "90vh",
        overflow: "auto",
        backgroundColor: "#888",
        padding: theme.spacing(2, 0),
    },
    listOffers: {
        height: "90vh",
        overflow: "auto",
    },
    page: {
        margin: theme.spacing(1, 0)
    },
    container: {
        backgroundColor: "#fff",
    },
    offerState: {
        color: "black",
        display: "block",
        padding: theme.spacing(0.5, 2, 2),
        textAlign: "justify"
    }
}));

export default function ListOffer() {
    const classes = useStyles();
    const [currentDoc, setCurrentDoc] = useState('');
    const [offers, setOffers] = useState([{
        title: '',
        description: '',
        nbOfWeeks: '',
        salary: '',
        beginHour: '',
        endHour: '',
        creationDate: '',
        limitDateToApply: '',
        joinedFile: "",
        owner: {}
    }]);
    const [numPages, setNumPages] = useState(null);
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    useEffect(() => {
        const getData = async () => {

            const result = await axios.get("http://localhost:8080/offers/employer/" + AuthenticationService.getCurrentUser().username)
                .catch(() => {
                    setErrorModalOpen(true)
                })

            setOffers(result.data)
        }
        getData()
    }, [])

    useEffect(() => {
        if (offers[0]) {
            if (offers[0].joinedFile !== '')
                setCurrentDoc(offers[0].joinedFile)
        } else {
            setCurrentDoc("")
        }
    }, [offers])

    function deleteOffer(index) {
        const nextState = [...offers];
        return axios.delete("http://localhost:8080/offers/" + nextState[index].id)
            .then(r => {
                nextState.splice(index, 1)
                setOffers(nextState)
            })
            .catch(() => setErrorModalOpen(true))
    }

    function parseDate(date) {
        const m = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        const d = new Date(date);
        return d.getDate() + " " + m[d.getMonth()] + " " + d.getFullYear();
    }

    return (
        <Container component="main" className={classes.container}>
            <Grid
                container
                spacing={0}
                style={{alignItems: "stretch"}}
            >
                <Grid item xs={5} className={classes.listOffers}>
                    <Typography variant="h4" id="title">Mes offres de stage</Typography>
                    {
                        offers.map((item, i) => (

                            <div key={i}>
                                <button
                                    type={"button"}
                                    className={classes.linkButton}
                                    onClick={() => deleteOffer(i)}>
                                    <i className="fa fa-trash" style={{color: "red"}}/>
                                </button>
                                <button
                                    type={"button"}
                                    className={[classes.linkButton, classes.fileButton].join(' ')}
                                    autoFocus={i === 0}
                                    onClick={() => {
                                        setCurrentDoc(item.joinedFile)
                                    }}
                                >
                                    <Typography color={"textPrimary"} variant={"body1"}>
                                        {`Titre :${item.title}`}
                                    </Typography>
                                    <Typography color={"textPrimary"} variant={"body2"}>
                                        {`Description: ${item.description}`}
                                    </Typography>
                                    <Typography color={"textPrimary"} variant={"body2"}>
                                        {`Nombre de semaine: ${item.nbOfWeeks}`}
                                    </Typography>
                                    <Typography color={"textPrimary"} variant={"body2"}>
                                        {`Salaire: ${item.salary}`}
                                    </Typography>
                                    <Typography color={"textPrimary"} variant={"body2"}>
                                        {`Heure de début: ${item.beginHour}h00`}
                                    </Typography>
                                    <Typography color={"textPrimary"} variant={"body2"}>
                                        {`Heure de fin: ${item.endHour}h00`}
                                    </Typography>
                                    <Typography color={"textPrimary"} variant={"body2"}>
                                        {`Date de création: ${parseDate(item.creationDate)}`}
                                    </Typography>
                                    <Typography color={"textPrimary"} variant={"body2"}>
                                        {`Date limite pour appliquer : ${parseDate(item.limitDateToApply)}`}
                                    </Typography>
                                </button>
                                <hr/>
                            </div>
                        ))
                    }
                </Grid>
                <Grid item className={classes.viewbox} xs={7} align="center">
                    <Document
                        onLoadSuccess={({numPages}) => {
                            setNumPages(numPages)
                        }}

                        error={"Veuillez choisir un fichier"}
                        file={currentDoc}
                    >
                        {Array.from(
                            new Array(numPages),
                            (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    renderTextLayer={false}
                                    className={classes.page}
                                />
                            ),
                        )}
                    </Document>

                </Grid>
            </Grid>
            <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
                <DialogTitle id="alert-dialog-title">{"Erreur réseau"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Erreur réseau: impossible de communiquer avec le serveur
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorModalOpen(false)} color="primary">
                        J'ai compris
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}