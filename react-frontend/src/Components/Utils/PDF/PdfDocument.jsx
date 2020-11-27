import * as PropTypes from "prop-types";
import React, {useState} from "react";
import {Document, Page} from "react-pdf";
import useStyles from "../Style/useStyles";

export default function PdfDocument(props) {
    const classes = useStyles()
    const [numPages, setNumPages] = useState(0)
    //todo simon will fix it at some point
    // const [pageWidth, setPageWidth] = useState(0)
    // useEffect(() => setPageWidth(props.container.current.offsetWidth * .95),
    //     [props.container])

    return <Document
        onLoadSuccess={async ({numPages}) => await setNumPages(numPages)}
        error={"Impossible d'afficher"}
        file={props.document}>
        {Array.from(
            new Array(numPages),
            (el, index) => <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                className={classes.page}
                // width={pageWidth}
                width={props.container.current.offsetWidth * .95}
            />,
        )}
    </Document>
}

PdfDocument.propTypes = {
    document: PropTypes.any.isRequired,
}
