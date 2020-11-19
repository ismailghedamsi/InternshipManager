import {Typography} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import React, {useEffect, useRef, useState} from "react"
import PdfDocument from "./PdfDocument"
import useStyles from "./useStyles"

export default function PdfSelectionViewer(props) {
    const classes = useStyles()
    const [currentDoc, setCurrentDoc] = useState(null)
    const [childs, setChilds] = useState([])
    const container = useRef()

    useEffect(() => {
        if (props.documents) {
            if (props.documents[currentDoc] !== "" && props.documents[currentDoc] !== undefined && props.documents[currentDoc] !== null)
                setCurrentDoc(currentDoc)
            else if (props.documents[0] !== "" && props.documents[0] !== undefined && props.documents[0] !== null)
                setCurrentDoc(0)
        } else
            setCurrentDoc(null)
    }, [props.documents, currentDoc])

    useEffect(() => setChilds(props.documents.map((item, i) => props.children(i, setCurrent))), [props])

    function setCurrent(index) {
        setCurrentDoc(index)
    }

    function getCurrentDoc() {
        return currentDoc >= props.documents.length ? 0 : currentDoc
    }

    return <Grid
        container
        spacing={0}
        className={classes.main}>
        <Grid item xs={3} className={classes.list}>
            <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                {props.title}
            </Typography>
            {childs.length > 0 ? childs : "Aucun élément à afficher"}
        </Grid>
        <Grid item xs={9} className={classes.viewbox} align="center" ref={container}>
            <PdfDocument document={props.documents[getCurrentDoc()] ? props.documents[getCurrentDoc()] : ""}
                         container={container}/>
        </Grid>
    </Grid>
}
