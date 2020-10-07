import React, {useEffect, useState} from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import {Document, Page} from 'react-pdf';
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
        width: "90%",
        '&:hover': {
            backgroundColor: "#00000055",
        },
        '&:focus': {
            outline: "none",
        }
    },
    fileButton: {
        outline: "none",
        backgroundColor: theme.palette.primary.light,
        display: "inline"

    },
    buttonDiv: {
        display: "inline"
    },
    viewbox: {
        height: "90vh",
        overflow: "auto",
        backgroundColor: "#888",
        padding: theme.spacing(2, 0),
    },
    listResumes: {
        height: "90vh",
        overflow: "auto",
    },
    page: {
        margin: theme.spacing(1, 0)
    },
    container: {
        backgroundColor: "#fff",
    },
    resumeState: {
        color: "black",
        display: "block",
        padding: theme.spacing(0.5, 2, 2),
        textAlign: "justify"
    }
}));

export default function ResumeList() {
    const classes = useStyles();
    const [currentDoc, setCurrentDoc] = useState('');
    const [resumes, setResumes] = useState([{name: '', file: '', owner: {}, applications: [{id: null}]}]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [numPages, setNumPages] = useState(null);
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    useEffect(() => {
        const getData = async () => {
            await axios.get("http://localhost:8080/resumes/student/" + AuthenticationService.getCurrentUser().id)
                .catch(() => {
                    setErrorModalOpen(true)
                })
                .then(r => setResumes(r.data))
        }
        getData()
    }, [])

    useEffect(() => {
        if (resumes[currentIndex]) {
            if (resumes[currentIndex].file !== '' && resumes[currentIndex].file !== undefined && resumes[currentIndex].file !== null) {
                setCurrentDoc(resumes[currentIndex].file)
            }
        } else
            setCurrentDoc('')
    }, [resumes, currentIndex])

    function deleteResume(index) {
        const nextState = [...resumes];
        return axios.delete("http://localhost:8080/resumes/" + nextState[index].id)
            .then(() => {
                nextState.splice(index, 1)
                setResumes(nextState)
            })
            .catch(() => setErrorModalOpen(true))
    }

    function getResumeState(resume) {
        if (!resume.reviewed)
            return <span style={{color: "blue"}}>En attente</span>;
        else if (!resume.approuved)
            return (<span style={{color: "red"}}>Rejeté<span
                style={{color: "black"}}> : {resume.reasonForRejection} </span></span>);
        else
            return <span style={{color: "green"}}>Approuvé</span>;
    }


    return (
        <Container component="main" className={classes.container}>
            <Grid
                container
                spacing={0}
                style={{alignItems: "stretch"}}
            >
                <Grid item xs={5} className={classes.listResumes}>
                    <Typography variant="h4" id="title">Mes résumés</Typography>
                    {
                        resumes.map((item, i) => (
                            <div key={i} style={{width: "90%"}}>
                                <button
                                    type={"button"}
                                    className={classes.linkButton}
                                    onClick={() => deleteResume(i)}
                                    style={{width: "auto"}}
                                    disabled={item.applications.length !== 0}
                                    title={item.applications.length === 0 ? '' : 'Impossible de supprimer un CV déja soumis dans une offre'}
                                >
                                    <i className="fa fa-trash"
                                       style={item.applications.length === 0 ? {color: "red"} : {
                                           color: "grey",
                                           cursor: "not-allowed"
                                       }}/>
                                </button>
                                <button
                                    type={"button"}
                                    className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                                    autoFocus={i === 0}
                                    onClick={() => {
                                        setCurrentIndex(i)
                                    }}
                                >
                                    <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                                        {item.name + " "}
                                    </Typography>
                                    <Typography
                                        className={classes.resumeState}
                                        variant={"body2"}>
                                        État : {getResumeState(item)}
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