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
        fontSize: 20,
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        margin: 0,
        borderRadius: 0,
        '&:hover': {
            backgroundColor: "#00000099",
        },
        '&:focus': {
            outline: "none"
        }
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: theme.spacing(2),
        flexGrow: 1,
        alignItems: "center",
        minHeight: "100%"
    }
}));

export default function ResumeApprobation() {
    const classes = useStyles();
    const [currentDoc, setCurrentDoc] = useState('');
    const [resumes, setResumes] = useState([{name: '', file: '', owner: {}}]);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }

    useEffect(() => {
        const getData = async () => {
            const result = await axios.get("http://localhost:8080/resumes")
            console.log(result)
            setResumes(result.data)
        }
        getData()
    }, [])


    return (
        <Container component="main" maxWidth="xl" className={classes.container}>
            <Typography variant={"h2"}>Approbations des CV</Typography>
            <Grid
                container
                spacing={0}
            >
                <Grid item xs={4}>
                    <Typography>Fichiers</Typography>
                    {
                        resumes.map((item, i) => (
                            <button
                                key={i}
                                type={"button"}
                                className={["nav-links", classes.linkButton].join(' ')}
                                onClick={() => setCurrentDoc(item.file)}
                            >
                                <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                                    {item.name + " "}
                                </Typography>
                                <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                                    {item.owner.firstName} {item.owner.lastName}
                                </Typography>
                            </button>
                        ))
                    }
                </Grid>
                <Grid item xs={8}>
                    <Typography>Fichier sélectionné</Typography>
                    <Document
                        onLoadSuccess={onDocumentLoadSuccess}
                        file={"data:application/pdf;base64," + currentDoc}
                    >
                        <Page pageNumber={pageNumber}/>
                    </Document>
                    <PageSelector {...{pageNumber, setPageNumber, numPages}} />
                </Grid>
            </Grid>
        </Container>
    )
}

function PageSelector(props) {
    const classes = useStyles();
    const prevPage = () => {
        if (props.pageNumber > 1)
            props.setPageNumber(props.pageNumber - 1)
    }
    const nextPage = () => {
        if (props.pageNumber < props.numPages)
            props.setPageNumber(props.pageNumber + 1)
    }

    return (
        <p>
            <button className={classes.linkButton} onClick={prevPage}>
                <i className="fa fa-angle-left"/>
            </button>
            Page {props.pageNumber} of {props.numPages}
            <button className={classes.linkButton} onClick={nextPage}>
                <i className="fa fa-angle-right"/>
            </button>
        </p>
    )
}