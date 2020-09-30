import React, {useEffect, useState} from "react";
import './ListCV.css'
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import {Document, Page} from 'react-pdf';
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AuthenticationService from '../../js/AuthenticationService';

const useStyles = makeStyles((theme) => ({
    viewbox: {
        height: "90vh",
        overflow: "auto",
        backgroundColor: "#888",
        padding: theme.spacing(2, 0)
    },
    page: {
        margin: theme.spacing(1, 0)
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: theme.spacing(2)
    }
}));

export default function ListCV() {
    const classes = useStyles();
    const [currentDoc, setCurrentDoc] = useState('');
    const [resumes, setResumes] = useState([{name: '', file: '', owner: {}}]);
    const [numPages, setNumPages] = useState(null);
    const [errorModalOpen, setErrorModalOpen] = useState(false);


    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }

    useEffect(() => {
        const getData = async () => {
            const result = await axios.get("http://localhost:8080/resumes")
                .catch(() => {
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
        <Container component="main" maxWidth="sm" className={classes.container}>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{minHeight: '100vh'}}
            >
                <Grid item xs={12}>
                    <Typography variant="h5" id="title">Étudiant :
                        {JSON.parse(AuthenticationService.getValueFromSession("authenticatedUser")).firstName},
                        {JSON.parse(AuthenticationService.getValueFromSession("authenticatedUser")).lastName}
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
    );
}