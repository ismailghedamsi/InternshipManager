import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Document, Page, pdfjs} from 'react-pdf';
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
        padding: theme.spacing(2, 0)
    },
    page: {
        margin: theme.spacing(1, 0)
    },
    main: {
        backgroundColor: "#fff"
    }
}));

export default function ResumeApprobation() {
    const classes = useStyles();
    const [resumes, setResumes] = useState([{name: '', file: '', owner: {}}]);
    const [currentDoc, setCurrentDoc] = useState('');
    const [numPages, setNumPages] = useState(0);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [reasonModalOpen, setReasonModalOpen] = useState(false);
    const [refusalIndex, setRefusalIndex] = useState(-1);

    function sendDecision(index, approuved, reason = "") {
        const nextState = [...resumes];
        nextState[index].approuved = approuved;
        nextState[index].reviewed = true;
        nextState[index].reasonForRejection = reason;
        return axios.put("http://localhost:8080/resumes/" + nextState[index].id, nextState[index])
            .then(r => {
                nextState.splice(index, 1)
                setResumes(nextState)
                setReasonModalOpen(false)
            })
            .catch(() => setErrorModalOpen(true))
    }

    useEffect(() => {
        const getData = async () => {
            const result = await axios.get("http://localhost:8080/resumes/pending")
                .catch(() => {
                    console.log("bullshit")
                    setErrorModalOpen(true)
                })
            setResumes(result.data)
        }
        getData()
    }, [])

    useEffect(() => {
        if (resumes[0].file !== '')
            setCurrentDoc(resumes[0].file)
    }, [resumes])

    return (
        <Container component="main" className={classes.main}>
            <Grid
                container
                spacing={0}
                style={{alignItems: "stretch"}}
            >
                <Grid item xs={4}>
                    <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                        En attente d'approbation
                    </Typography>
                    {
                        resumes.map((item, i) => (
                            <div key={i}>
                                <button
                                    type={"button"}
                                    className={["nav-links", classes.linkButton, classes.fileButton].join(' ')}
                                    autoFocus={i === 0}
                                    onClick={() => setCurrentDoc(item.file)}
                                >
                                    <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                                        {item.name + " "}
                                    </Typography>
                                    <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                                        {item.owner.firstName} {item.owner.lastName}
                                    </Typography>
                                </button>
                                <div>
                                    <button
                                        type={"button"}
                                        className={["nav-links", classes.linkButton].join(' ')}
                                        onClick={() => sendDecision(i, true)}
                                        style={{marginRight: 5}}
                                    ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                                    <button
                                        type={"button"}
                                        className={["nav-links", classes.linkButton].join(' ')}
                                        onClick={() => {
                                            setRefusalIndex(i)
                                            setReasonModalOpen(true)
                                        }}
                                    ><i className="fa fa-ban" style={{color: "red"}}/></button>
                                </div>
                            </div>
                        ))
                    }
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
            <Dialog open={reasonModalOpen} onClose={() => setReasonModalOpen(false)} fullWidth maxWidth={"md"}>
                <DialogTitle id="alert-dialog-title">{"Refus d'un CV"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" component={"div"}>
                        <Formik
                            onSubmit={async (values) => sendDecision(refusalIndex, false, values.reasonForRejection)}

                            validationSchema={yup.object()
                                .shape({
                                    reasonForRejection: yup.string().trim().required("ce champ est requis")
                                })}
                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize={true}
                            initialValues={{reasonForRejection: ""}}
                        >
                            {({submitForm, isSubmitting}) => (
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
