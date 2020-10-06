import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {useLocation} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import axios from 'axios';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {Document, Page} from "react-pdf";

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
        width: "80%",
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
    list: {
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

export default function ApplicationList() {
    const classes = useStyles();
    const location = useLocation();
    const [offer, setOffer] = useState({applications: [{resume: {}, student: {}}]});
    const [currentOfferId, setCurrentOfferId] = useState(-1);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [currentDoc, setCurrentDoc] = useState('');
    const [numPages, setNumPages] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/offers/" + location.state.offerId)
            .catch(() => setErrorModalOpen(true))
            .then((r) => setOffer(r.data))
    })

    useEffect(() => {
        if (offer)
            if (offer.applications[0]) {
                setCurrentOfferId(offer.applications.id)
                if (offer.applications[0].resume) {
                    if (offer.applications[0].resume.file !== '')
                        setCurrentDoc(offer.applications[0].resume.file)
                } else {
                    setCurrentDoc("")
                }
            }
    }, [offer])

    return (
        <Container component="main" className={classes.container}>
            <Grid
                container
                spacing={0}
                style={{alignItems: "stretch"}}
            >
                <Grid item xs={5} className={classes.list}>
                    <Typography variant="h4" className="title">Applications</Typography>
                    <Typography variant="h5" className="title">{offer.title}</Typography>
                    {
                        offer.applications.map((item, i) => (

                            <div key={i}>
                                <button
                                    type={"button"}
                                    className={[classes.linkButton, classes.fileButton].join(' ')}
                                    autoFocus={i === 0}
                                    onClick={() => {
                                        setCurrentOfferId(item.id);
                                        setCurrentDoc(item.resume.file)
                                    }}>
                                    <Typography color={"textPrimary"} variant={"h5"} style={{display: "block"}}>
                                        {item.student.firstName} {item.student.lastName}
                                    </Typography>
                                </button>
                                {currentOfferId === item.id &&
                                <div>
                                    <Typography color={"textPrimary"} variant={"body1"}>
                                        {item.student.phoneNumber} {item.student.email}
                                    </Typography>
                                    <Typography color={"textPrimary"} variant={"body1"}>
                                        {item.student.address}
                                    </Typography>
                                </div>
                                }
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
    )
}