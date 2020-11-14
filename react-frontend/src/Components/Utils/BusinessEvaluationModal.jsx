import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";

export default function BusinessEvaluationModal({isOpen, data, hide}) {

    return <Dialog open={isOpen} onClose={hide} fullWidth={true} fullScreen={true}
                   maxWidth={'md'}>
        <DialogTitle id="alert-dialog-title">{"Sommaire evaluation"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {data ?
                    <div>
                        <Typography variant="body1">
                            Nom de l’élève : {data.infos.fullname}
                        </Typography>

                        <Typography variant="body1">
                            Programme d’études : {data.infos.studentProgram}
                        </Typography>

                        {/* <Typography variant="body1">
                                        Nom de l’entreprise : {data.infos}
                                    </Typography>
                                    <Typography variant="body1">
                                        Nom du superviseur : {data.program}
                                    </Typography>
                                    <Typography variant="body1">
                                        Fonction : {data.program}
                                    </Typography>
                                    <Typography variant="body1">
                                        Téléphone: {data.program}
                                    </Typography> */}
                    </div>
                    : ""
                }
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={hide}>
                J'ai compris
            </Button>
        </DialogActions>
    </Dialog>
}
