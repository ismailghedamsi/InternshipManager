import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Document, Page} from "react-pdf";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import AuthenticationService from "../js/AuthenticationService";

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
    }, viewbox: {
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

export default function ApplyStage() {
    const classes = useStyles();
    const [currentDoc, setCurrentDoc] = useState('');
    const [resumes, setResumes] = useState([{name: '', file: '', owner: {}}]);
    const [numPages, setNumPages] = useState(null);
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const result = await axios.get("http://localhost:8080/resumes/student/" + AuthenticationService.getCurrentUser().id)
                .catch(() => {
                    console.log("bullshit")
                    setErrorModalOpen(true)
                })
            setResumes(result.data)
        }
        getData()
    }, [])

    useEffect(() => {
        if (resumes[0]) {
            if (resumes[0].file !== '' && resumes[0].file !== undefined && resumes[0].file !== null)
                setCurrentDoc(resumes[0].file)
        } else
            setCurrentDoc('')
    }, [resumes])

    return (
        <Container component="main" className={classes.container}>
            <Grid
                container
                spacing={0}
                style={{alignItems: "stretch"}}
            >
                <Grid item xs={5} className={classes.listResumes}>
                    <Typography variant="h4" id="title">Les stages</Typography>
                    {
                        resumes.map((item, i) => (
                            <div key={i}>
                                <div className={classes.buttonDiv}>
                                    <button
                                        type={"button"}
                                        className={[classes.linkButton].join(' ')}
                                    ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                                </div>
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