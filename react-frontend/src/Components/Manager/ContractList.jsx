import React, {useEffect, useState} from "react";
import {useStyles} from "../Utils/useStyles";
import {useApi, useModal} from "../Utils/Hooks";
import {Typography} from "@material-ui/core";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

export default function ContractList() {
    const classes = useStyles();
    const api = useApi();
    const [offers, setOffers] = useState([]);
    const [students, setStudents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isContractModalOpen, openContractModal, closeContractModal] = useModal();

    useEffect(() => {
        api.get("/offers/approved")
            .then(r => setOffers(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("students").then(r => setStudents(r ? r.data : []))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Contracts"}>
                {(i, setCurrent) => (
                    <div key={i}>
                        {offers[i].applications.length !== 0 && offers[i].applications.find(a => a.reviewState === "APPROVED") &&
                        <button
                            type={"button"}
                            className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                            onClick={() => {
                                setCurrent(i);
                                setCurrentIndex(i);
                            }}
                        >
                            <Typography color={"textPrimary"} variant={"body1"}>
                                {offers[i].title}
                            </Typography>
                            <Typography color={"textSecondary"} variant={"body2"}>
                                {offers[i].employer.companyName}
                            </Typography>
                            <hr style={{width: "80%", marginLeft: "auto", marginRight: "auto"}}/>
                            {currentIndex === i && offers[i].applications.length !== 0 && offers[i].applications.find(a => a.reviewState === "APPROVED") &&
                            students.map((student, j) => (
                                <div key={j}>
                                    {offers[i].applications.find(a => a.student.firstName === student.firstName && a.reviewState === "APPROVED") &&
                                    <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                                        {student.firstName} {student.lastName}
                                        <button
                                            type={"button"}
                                            className={[classes.linkButton].join(' ')}
                                            onClick={() => {
                                                setCurrentIndex(i)
                                                openContractModal()
                                            }}
                                        ><i className="fa fa-ban" style={{color: "red"}}/></button>
                                    </Typography>}
                                </div>
                            ))
                            }
                        </button>
                        }
                    </div>
                )}
            </PdfSelectionViewer>
            <Dialog open={isContractModalOpen} onClose={closeContractModal} fullWidth maxWidth={"md"}>
                <DialogTitle id="alert-dialog-title">{"Contract :"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" component={"div"}>
                        {/*    formulaire pour contracter un etudiant*/}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeContractModal} color={"primary"}>
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}