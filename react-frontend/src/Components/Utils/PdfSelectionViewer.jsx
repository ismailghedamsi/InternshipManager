import React, {useEffect, useState} from "react";
import {Document, Page} from "react-pdf";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import {useStyles} from "./useStyles";

export default function PdfSelectionViewer(props) {
    const classes = useStyles();
    const [currentDoc, setCurrentDoc] = useState(null);
    const [numPages, setNumPages] = useState(0);

    useEffect(() => {
        if (props.documents) {
            if (props.documents[currentDoc] !== '' && props.documents[currentDoc] !== undefined && props.documents[currentDoc] !== null)
                setCurrentDoc(currentDoc)
            else if (props.documents[0] !== '' && props.documents[0] !== undefined && props.documents[0] !== null)
                setCurrentDoc(0)
        } else
            setCurrentDoc(null)
    }, [props.documents, currentDoc])

    function setCurrent(index) {
        setCurrentDoc(index)
    }

    function getCurrentDoc() {
        return currentDoc >= props.documents.length ? 0 : currentDoc
    }

    return (
        <Grid
            container
            spacing={0}
            className={classes.main}>
            <Grid item xs={5} className={classes.list}>
                <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                    {props.title}
                </Typography>
                {props.documents.map((item, i) => props.children(i, setCurrent))}
            </Grid>
            <Grid item xs={7} className={classes.viewbox} align="center">
                <Document
                    onLoadSuccess={async ({numPages}) => await setNumPages(numPages)}
                    error={"Impossible d'afficher"}
                    file={props.documents[getCurrentDoc()]}>
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
    )
}