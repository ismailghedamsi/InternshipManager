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
import AuthenticationService from "../../Services/AuthenticationService";

const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
const tooLongError = (value) => "Doit avoir moins que " + value.max + " caractères";
export default function SignContract() {
    const classes = useStyles();
    const api = useApi();
    const [contracts, setContracts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal();
    const [isSignModalOpen, openSignModal, closeSignModal] = useModal();

    function sendDecision(index, isApprouved, values) {
        const nextState = [...contracts];
        let dto = {};
        if (isApprouved) {
            readFileAsync(values.file).then(file => {
                dto.contractId = nextState[index].id;
                dto.isApproved = isApprouved;
                dto.imageSignature = file;
                dto.reasonForRejection = "";
                dto.nomSignataire = values.nomSignataire;
                dto.signatureTimestamp = new Date();

                return api.put("/contractGeneration/sign", dto)
                    .then(result => {
                        nextState.splice(index, 1, result.data);
                        setContracts(nextState);
                        closeSignModal()
                    })
            })
        } else {
            dto.contractId = nextState[index].id;
            dto.isApproved = isApprouved;
            dto.reasonForRejection = values.message;
            console.log(dto);
            return api.put("/contractGeneration/sign", dto)
                .then(result => {
                    nextState.splice(index, 1, result.data);
                    setContracts(nextState);
                    closeReasonModal()
                })
        }
    }

    useEffect(() => {
        api.get("/contract/employer/" + AuthenticationService.getCurrentUser().id)
            .then(r => setContracts(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

    function contractState(contract) {
        switch (contract.signatureState) {
            case "REJECTED_BY_EMPLOYER":
                return <Typography variant={"body1"} style={{color: "red"}}>
                    Rejeté :
                    {contract.reasonForRejection}
                </Typography>
            case "WAITING_FOR_STUDENT_SIGNATURE":
                return <Typography variant={"body1"} style={{color: "blue"}}>
                    En attente de la signature de l'étudiant
                </Typography>
            case "WAITING_FOR_ADMIN_SIGNATURE":
                return <Typography variant={"body1"} style={{color: "blue"}}>
                    En attente de la signature du gestionnaire de stage
                </Typography>
            case "SIGNED":
                return <Typography variant={"body1"} style={{color: "green"}}>
                    Contrat signé
                </Typography>
            default:
                return '';
        }
    }

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer
                documents={contracts ? contracts.map(c => c.file ? c.file : "") : []}
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
                        {currentIndex === i && contracts[i].signatureState === "WAITING_FOR_EMPLOYER_SIGNATURE" &&
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
                        {currentIndex === i &&
                        contractState(contracts[i])
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
                            onSubmit={async (values) =>
                                sendDecision(currentIndex, true, values)
                            }
                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize={true}
                            validate={(values) => {
                                const errors = {};
                                if (values.file.type !== "image/png" && values.file.type !== "image/jpeg") {
                                    errors.file = "L'image doit être de type PNG ou JPG"
                                }
                                return errors;
                            }}
                            validationSchema={yup.object()
                                .shape({
                                    nomSignataire: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required("Ce champs est requis")
                                })
                            }
                            initialValues={{
                                nomSignataire: "",
                                file: ""
                            }}>
                            {({submitForm, isSubmitting}) => (
                                <Form>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Field
                                                component={TextField}
                                                name="nomSignataire"
                                                id="nomSignataire"
                                                variant="outlined"
                                                label="Nom du signataire"
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
                                                label="Une image de signature en PNG ou JPG"
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
                onSubmit={async (values) => sendDecision(currentIndex, false, values)}
            />
        </div>
    )
}