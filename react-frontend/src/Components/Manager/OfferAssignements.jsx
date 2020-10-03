import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import {Document, Page} from "react-pdf";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {Field, Form, Formik} from "formik";
import {Checkbox} from "formik-material-ui";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    linkButton: {
        fontSize: "1.5rem",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        margin: 0,
        padding: 5,
        borderRadius: 0,
        textAlign: 'left',
        width: "100%",
        '&:hover': {
            backgroundColor: "#00000055",
        },
        '&:focus': {
            outline: "none",
        }
    },
    fileButton: {
        outline: "none",
        backgroundColor: theme.palette.secondary.light,
        display: "inline"

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
    resumeList: {
        height: "90vh",
        overflow: "auto",
    },
    page: {
        margin: theme.spacing(1, 0)
    },
    main: {
        backgroundColor: "#fff"
    }
}));

export default function OfferAssignements() {
    const classes = useStyles();
    const [students, setStudents] = useState([{firstName: '', lastName: ''}])
    const [offers, setOffers] = useState([{title: '', employer: {}, joinedFile: '', allowedStudents: [{}]}]);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [currentDoc, setCurrentDoc] = useState('');
    const [numPages, setNumPages] = useState(0);
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8080/offers")
            .catch(() => {
                setErrorModalOpen(true)
            })
            .then(r => setOffers(r.data))
    }, [])

    useEffect(() => {
        axios.get("http://localhost:8080/students")
            .catch(() => {
                setErrorModalOpen(true)
            })
            .then(r => setStudents(r.data))
    }, [])

    useEffect(() => {
        if (offers[0]) {
            if (offers[0].joinedFile !== '' && offers[0].joinedFile !== undefined && offers[0].joinedFile !== null) {
                setCurrentDoc(offers[0].joinedFile)
            }
            setCurrentOfferIndex(0);
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
                <Grid item xs={4} className={classes.resumeList}>
                    <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                        En attente d'approbation
                    </Typography>
                    {offers.map((offer, i) => (
                        <div key={i} style={{width: "80%"}}>
                            <button
                                type={"button"}
                                className={[classes.linkButton, i === currentOfferIndex ? classes.fileButton : null].join(' ')}
                                onClick={() => {
                                    setCurrentDoc(offer.joinedFile);
                                    setCurrentOfferIndex(i);
                                }}
                            >
                                <Typography color={"textPrimary"} variant={"body1"}>
                                    {offer.title}
                                </Typography>
                                <Typography color={"textSecondary"} variant={"body2"}>
                                    {offer.employer.companyName}
                                </Typography>
                            </button>
                            {currentOfferIndex === i &&
                            students.map((student, i) => (
                                <div key={i}>
                                    <Formik
                                        initialValues={{
                                            offerId: offer.id,
                                            studentId: student.id,
                                            allowed: offer.allowedStudents.map(s => s.id === student.id) && offer.allowedStudents.length !== 0
                                        }}
                                        onSubmit={async (values) => {
                                            axios.put("http://localhost:8080/" + {offerId} + "/addStudent/" + {studentId})
                                        }}
                                    >
                                        {({submitForm, isSubmitting}) => (
                                            <Form style={{display: "inline", marginLeft: 16}}>
                                                <Field name={"offerId"} type={"hidden"}/>
                                                <Field name={"studentId"} type={"hidden"}/>
                                                <label
                                                    htmlFor={"allowed"}>{student.firstName} {student.lastName}</label>
                                                <Field id={"allowed"} name={"allowed"} component={Checkbox}
                                                       type="checkbox" onChange={submitForm} disabled={isSubmitting}/>
                                                {isSubmitting && <CircularProgress size={18}/>}
                                            </Form>)}
                                    </Formik>
                                </div>
                            ))}
                        </div>
                    ))}
                </Grid>
                <Grid item className={classes.viewbox} xs={8} align="center">
                    <Document
                        onLoadSuccess={({numPages}) => setNumPages(numPages)}
                        error={"Veuillez choisir un fichier"}
                        file={"data:application/pdf;base64," + currentDoc}
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