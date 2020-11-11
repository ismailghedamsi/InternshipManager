import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";

export default function EvaluationModal({data, isOpen, onClose}) {
    // console.log("from modal")
    // console.log(data)
    return (
            <Dialog open={isOpen}>
                <DialogTitle id="alert-dialog-title">{"Sommaire evaluation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {data ?
                                <div style={{
                                    width: "50VW",
                                    height: "10VH",
                                    border: "1px solid #969696",
                                    margin: "10px"
                                }}>

                                    <Typography variant="body1">
                                        Nom de l’élève : {data.fullname}
                                    </Typography>

                                    <Typography variant="body1">
                                        Programme d’études : {data.program}
                                    </Typography>

                                    <Typography variant="body1">
                                        Nom de l’entreprise : {data.entrpriseName}
                                    </Typography>

                                    <Typography variant="body1">
                                        Nom du superviseur : {data.program}
                                    </Typography>

                                    <Typography variant="body1">
                                        Fonction : {data.program}
                                    </Typography>

                                    <Typography variant="body1">
                                        Téléphone: {data.program}
                                    </Typography>
                                </div>
                                : ""
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary">
                        J'ai compris
                    </Button>
                </DialogActions>
            </Dialog>
    )
}