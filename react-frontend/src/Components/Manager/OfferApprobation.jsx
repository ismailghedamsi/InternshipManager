import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Document, Page} from 'react-pdf';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Typography} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import * as yup from "yup";
import {Field, Form, Formik} from "formik";
import LinearProgress from "@material-ui/core/LinearProgress";
import {TextField} from "formik-material-ui";

const useStyles = makeStyles((theme) => ({
    linkButton: {
        fontSize: "1.5rem",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        margin: 0,
        padding: 5,
        borderRadius: 0,
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
            display: "inline"
        }
    },
    buttonDiv: {
        display: "inline"
    },
    viewbox: {
        height: "90vh",
        overflow: "auto",
        backgroundColor: "#888",
        padding: theme.spacing(2, 0)
    },
    offerList: {
        height: "90vh",
        overflow: "auto",
    },
    page: {
        margin: theme.spacing(1, 0)
    },
    offreInfos: {
        margin: theme.spacing(1, 3, 2)
    },
    main: {
        backgroundColor: "#fff"
    }
}));

export default function OfferApprobation() {
    const classes = useStyles();
    const [offers, setOffers] = useState([{title: '', joinedFile: '', employer: {companyName: "", contactName: ""}}]);
    const [currentDoc, setCurrentDoc] = useState('');
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [numPages, setNumPages] = useState(0);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [reasonModalOpen, setReasonModalOpen] = useState(false);
    const [refusalIndex, setRefusalIndex] = useState(-1);

    function sendDecision(index, reviewState, reason = "") {
        const nextState = [...offers];
        nextState[index].reviewState = reviewState;
        nextState[index].reasonForRejection = reason;
        return axios.put("http://localhost:8080/offers/" + nextState[index].id, nextState[index])
            .then(r => {
                nextState.splice(index, 1)
                setOffers(nextState)
                setReasonModalOpen(false)
            })
            .catch(() => setErrorModalOpen(true))
    }

    useEffect(() => {
        const getData = async () => {
            const result = await axios.get("http://localhost:8080/offers/pending")
                .catch(() => {
                    setErrorModalOpen(true)
                })
            setOffers(result.data)
        }
        getData()
    }, [])

    useEffect(() => {
        if (offers[0]) {
            if (offers[0].joinedFile !== '' && offers[0].joinedFile !== undefined && offers[0].joinedFile !== null)
                setCurrentDoc(offers[0].joinedFile)
        } else
            setCurrentDoc('')
    }, [offers])

    return (
        <Container component="main" className={classes.main}>
            <Grid
                container
                spacing={0}
                style={{alignItems: "stretch"}}
            >
                <Grid item xs={5} className={classes.offerList}>
                    <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                        En attente d'approbation
                    </Typography>
                    {
                        offers.map((item, i) => (
                            <div key={i}>
                                <div className={classes.buttonDiv}>
                                    <button
                                        type={"button"}
                                        className={[classes.linkButton].join(' ')}
                                        onClick={() => sendDecision(i, "APPROVED")}
                                        style={{marginRight: 5}}
                                    ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                                    <button
                                        type={"button"}
                                        className={[classes.linkButton].join(' ')}
                                        onClick={() => {
                                            setRefusalIndex(i)
                                            setReasonModalOpen(true)
                                        }}
                                    ><i className="fa fa-ban" style={{color: "red"}}/></button>
                                </div>
                                <button
                                    type={"button"}
                                    className={[classes.linkButton, classes.fileButton].join(' ')}
                                    autoFocus={i === 0}
                                    onClick={() => {
                                        setCurrentDoc(item.joinedFile);
                                        setCurrentOfferIndex(i);
                                    }}
                                >
                                    <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                                        {" " + item.title + " "}
                                    </Typography>
                                    <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                                        {item.employer.companyName} {item.employer.contactName}
                                    </Typography>
                                </button>
                                {currentOfferIndex === i &&
                                <div className={[classes.offreInfos]}>
                                    <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                        {"Date limite d'application : " + (item.limitDateToApply + "").split("T")[0]}
                                    </Typography>

                                    <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                        {"Date de création de l'offre : " + (item.creationDate + "").split("T")[0]}
                                    </Typography>

                                    <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                        {"Nombre de semaines : " + item.nbOfWeeks}
                                    </Typography>

                                    <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                        {"Salaire horaire : $ " + item.salary}
                                    </Typography>

                                    <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                        {"Horaire : " + (item.beginHour < 10 ? "0" : "") + item.beginHour + ":00 - " + item.endHour + ":00"}
                                    </Typography>

                                    <Typography color={"textSecondary"} variant={"body1"} display={"block"}>
                                        {"Description de l'offre : " + item.description}
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
                        onLoadSuccess={({numPages}) => setNumPages(numPages)}
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
            <Dialog open={reasonModalOpen} onClose={() => setReasonModalOpen(false)} fullWidth maxWidth={"md"}>
                <DialogTitle id="alert-dialog-title">{"Refus d'une offre de stage"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" component={"div"}>
                        <Formik
                            onSubmit={async (values) => sendDecision(refusalIndex, "DENIED", values.reasonForRejection)}

                            validationSchema={yup.object()
                                .shape({
                                    reasonForRejection: yup.string().trim().max(255).required("ce champ est requis")
                                })}
                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize={true}
                            initialValues={{reasonForRejection: ""}}
                        >
                            {({isSubmitting}) => (
                                <Form>
                                    <Field
                                        component={TextField}
                                        multiline
                                        rows={5}
                                        name="reasonForRejection"
                                        id="reasonForRejection"
                                        variant="outlined"
                                        label="Justifiez le refus"
                                        required
                                        fullWidth
                                    />
                                    <br/>
                                    {isSubmitting && <LinearProgress/>}
                                    <Button
                                        type={"submit"}
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        size={"large"}
                                        className={classes.submit}
                                        disabled={isSubmitting}
                                    >
                                        Envoyer
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReasonModalOpen(false)} color={"primary"}>
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
