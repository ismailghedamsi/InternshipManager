import React, {useEffect, useState} from "react";
import useStyles from "../Utils/useStyles";
import {useApi, useModal} from "../Utils/Hooks";
import {Typography} from "@material-ui/core";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import {SimpleFileUpload, TextField} from "formik-material-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import TextboxModal from "../Utils/TextboxModal";
import Grid from "@material-ui/core/Grid";

const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
const tooLongError = (value) => "Doit avoir moins que " + value.max + " caractères";
export default function SignContract() {
    const classes = useStyles();
    const api = useApi();
    const [contracts, setContracts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal();
    const [isSignModalOpen, openSignModal, closeSignModal] = useModal();

    function sendDecision(index, studentDecision, reason = "") {
        const nextState = [...contracts];
        const application = nextState[index];
        application.reasonForRejection = reason;
        application.signatureState = studentDecision;
        console.log(application)
        return api.put("/contract/state/" + application.id, application)
            .then(result => {
                nextState.splice(index, 1);
                setContracts(nextState);
                closeReasonModal()
            })
    }

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result)
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        })
    }

    useEffect(() => {
        api.get("/contract")
            .then(r => setContracts(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer
                documents={contracts ? contracts.map(c => c.file ? "data:application/pdf;base64," + c.file : "") : []}
                title={"Contrats"}>
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
                        </button>
                        {currentIndex === i &&
                        <div className={classes.buttonDiv} style={{display: "block"}}>
                            Signez le contrat
                            <button
                                type={"button"}
                                className={[classes.linkButton].join(' ')}
                                onClick={() => {
                                    setCurrentIndex(i);
                                    openSignModal()
                                }}
                                style={{marginRight: 5}}
                            ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                            Refusez le contrat
                            <button
                                type={"button"}
                                className={[classes.linkButton].join(' ')}
                                onClick={() => {
                                    setCurrentIndex(i);
                                    openReasonModal()
                                }}
                            ><i className="fa fa-ban" style={{color: "red"}}/></button>
                        </div>}
                        {currentIndex === i && contracts[i].signatureState === "WAITING_FOR_STUDENT_SIGNATURE" &&
                        <Typography variant={"body1"} style={{color: "blue"}}>
                            En attente de la signature de l'étudiant
                        </Typography>
                        }
                        <hr/>
                    </div>
                )}
            </PdfSelectionViewer>
            <Dialog open={isSignModalOpen} onClose={closeSignModal} fullWidth maxWidth={"md"}>
                <DialogTitle id="alert-dialog-title">{"Veuillez signer le contrat :"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" component={"div"}>
                        <Formik
                            onSubmit={async (values) => readFileAsync(values.file).then((file) => {
                                let dto = {...values};
                                dto.file = file;
                                const nextState = [...contracts];
                                nextState[currentIndex].employerName = values.employerName;
                                nextState[currentIndex].file = dto.file;
                                nextState[currentIndex].date = new Date();
                                nextState[currentIndex].signatureState = "WAITING_FOR_STUDENT_SIGNATURE";
                                console.log(nextState[currentIndex])
                                return api.put("/contract/state/" + nextState[currentIndex].id, nextState[currentIndex])
                                    .then(result => closeReasonModal())
                            })}
                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize={true}
                            validate={(values) => {
                                const errors = {};
                                if (values.file.type === "image/png" || values.file.type === "image/jpeg") {
                                } else {
                                    errors.file = "L'image doit être de type PNG ou JPG"
                                }
                                return errors;
                            }}
                            validationSchema={yup.object()
                                .shape({
                                    employerName: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required("Ce champs est requis")
                                })
                            }
                            initialValues={{
                                employerName: "",
                                file: ""
                            }}>
                            {({submitForm, isSubmitting}) => (
                                <Form>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Field
                                                component={TextField}
                                                name="employerName"
                                                id="employerName"
                                                variant="outlined"
                                                label="Nom du employeur"
                                                required
                                                fullWidth
                                                autoFocus
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={SimpleFileUpload}
                                                type={"file"}
                                                name="file"
                                                id="file"
                                                variant="outlined"
                                                label="Image PNG ou JPG"
                                                fullwidth
                                                required
                                            />
                                        </Grid>
                                        {isSubmitting && <LinearProgress/>}
                                        <Button
                                            id="buttonSubmit"
                                            type={"submit"}
                                            variant="contained"
                                            fullWidth
                                            size={"large"}
                                            color="primary"
                                            disabled={isSubmitting}
                                            onClick={submitForm}
                                        >
                                            ENVOYER
                                        </Button>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeSignModal} color={"primary"}>
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>
            <TextboxModal
                isOpen={isReasonModalOpen}
                hide={closeReasonModal}
                title={"Justifiez le refus"}
                onSubmit={async (values) => sendDecision(currentIndex, "REJECTED_BY_EMPLOYER", values.message)}
            />
        </div>
    )
}