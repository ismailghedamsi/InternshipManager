import React, {useState} from "react";
import {Document, Page} from "react-pdf";
import * as PropTypes from "prop-types";
import useStyles from "./useStyles";

export default function PdfDocument(props) {
    const classes = useStyles();
    const [numPages, setNumPages] = useState(0);

    return (
        <Document
            onLoadSuccess={async ({numPages}) => await setNumPages(numPages)}
            error={"Impossible d'afficher"}
            file={props.document}>
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
    )
}

PdfDocument.propTypes = {
    document: PropTypes.any.isRequired,
};