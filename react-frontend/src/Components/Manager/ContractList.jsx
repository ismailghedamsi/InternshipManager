import React, {useEffect, useState} from "react";
import useStyles from "../Utils/useStyles";
import {useApi} from "../Utils/Hooks";
import {Typography} from "@material-ui/core";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";

export default function ContractList() {
    const classes = useStyles();
    const api = useApi();
    const [contracts, setContracts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        api.get("/contract")
            .then(r => setContracts(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer
                documents={contracts ? contracts.map(c => c.file ? "data:application/pdf;base64," + c.file : "") : []}
                title={"Contracts"}>
                {/*{console.log(contracts[0].file)}*/}
                {(i, setCurrent) => (
                    <div key={i}>
                        <button
                            type={"button"}
                            className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                            onClick={() => {
                                setCurrent(i);
                                setCurrentIndex(i);
                            }}
                        >
                            <Typography color={"textPrimary"} variant={"body1"}>
                                Nom du gestionnaire de stage : {contracts[i].adminName}
                            </Typography>
                            <hr style={{width: "80%", marginLeft: "auto", marginRight: "auto"}}/>
                        </button>
                    </div>
                )}
            </PdfSelectionViewer>
        </div>
    )
}