import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Document, Page, pdfjs} from 'react-pdf';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Typography} from "@material-ui/core";

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
    }
}));

export default function ResumeApprobation() {
    const classes = useStyles();
    const [currentDoc, setCurrentDoc] = useState('');
    const [resumes, setResumes] = useState([{name: '', file: '', owner: {}}]);
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }

    function sendDecision(index, approuved) {
        const nextState = [...resumes];
        nextState[index].approuved = approuved;
        nextState[index].reviewed = true;
        setResumes(nextState)
        axios.put("http://localhost:8080/resumes/" + resumes[index].id, resumes[index])
            .then(r => {
                const nextState = [...resumes];
                nextState.splice(index, 1)
                console.log(nextState)
                setResumes(nextState)
            })
    }

    useEffect(() => {
        const getData = async () => {
            const result = await axios.get("http://localhost:8080/resumes/pending")
            setResumes(result.data)
        }
        getData()
    }, [])

    return (
        <Container component="main">
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
                                        style={{marginRight: 25}}
                                    ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                                    <button
                                        type={"button"}
                                        className={["nav-links", classes.linkButton].join(' ')}
                                        onClick={() => sendDecision(i, false)}
                                    ><i className="fa fa-ban" style={{color: "red"}}/></button>
                                </div>
                            </div>
                        ))
                    }
                </Grid>
                <Grid item className={classes.viewbox} xs={8} align="center">
                    <Document
                        onLoadSuccess={onDocumentLoadSuccess}
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
        </Container>
    )
}
