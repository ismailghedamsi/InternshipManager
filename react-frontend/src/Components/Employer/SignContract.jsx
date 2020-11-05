import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Field, Form, Formik} from "formik";
import {SimpleFileUpload, TextField} from "formik-material-ui";
import React, {useEffect, useState} from "react";
import * as yup from "yup";
import AuthenticationService from "../../Services/AuthenticationService";
import {useApi, useModal} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import TextboxModal from "../Utils/TextboxModal";
import useStyles from "../Utils/useStyles";

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
            return readFileAsync(values.file).then(file => {
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
            return api.put("/contractGeneration/sign", dto)
                .then(result => {
                    nextState.splice(index, 1, result.data);
                    setContracts(nextState);
                    closeReasonModal()
                })
        }
    }

    useEffect(() => {
        if (AuthenticationService.getCurrentUserRole() === "employer") {
            api.get("/contract/employer/" + AuthenticationService.getCurrentUser().id)
                .then(r => setContracts(r ? r.data : []))
        } else if (AuthenticationService.getCurrentUserRole() === "student") {
            api.get("/contract/student/" + AuthenticationService.getCurrentUser().id)
                .then(r => setContracts(r ? r.data : []))
        }
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
            case "WAITING_FOR_EMPLOYER_SIGNATURE":
                if (AuthenticationService.getCurrentUserRole() !== "employer") {
                    return <Typography variant={"body1"} style={{color: "blue"}}>
                        En attente de la signature de l'employeur
                    </Typography>
                }
                break;
            case "WAITING_FOR_STUDENT_SIGNATURE":
                if (AuthenticationService.getCurrentUserRole() !== "student") {
                    return <Typography variant={"body1"} style={{color: "blue"}}>
                        En attente de la signature de l'étudiant
                    </Typography>
                }
                break;
            case "SIGNED":
                return <Typography variant={"body1"} style={{color: "green"}}>
                    Contrat signé
                </Typography>
            default:
                return '';
        }
    }

    function ownerCondition(i) {
        if (contracts[i].signatureState === "WAITING_FOR_EMPLOYER_SIGNATURE" && AuthenticationService.getCurrentUserRole() === "employer"
            || contracts[i].signatureState === "WAITING_FOR_STUDENT_SIGNATURE" && AuthenticationService.getCurrentUserRole() === "student")
            return true;
        else return false;
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer
            documents={contracts ? contracts.map(c => c.file ? c.file : "") : []}
            title={"Contrats"}>
            {(i, setCurrent) =>
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
                            {contracts[i].studentApplication.student.firstName} {contracts[i].studentApplication.student.lastName}
                            &ensp;&mdash;&ensp;{contracts[i].studentApplication.offer.employer.companyName}
                        </Typography>
                    </button>
                    {currentIndex === i && ownerCondition(i) &&
                    <div className={classes.buttonDiv} style={{display: "block"}}>
                        <button
                            type={"button"}
                            className={[classes.linkButton].join(' ')}
                            onClick={() => {
                                setCurrentIndex(i);
                                openSignModal()
                            }}
                        >
                            <i className="fa fa-check-square" style={{color: "green"}}/>
                            <Typography display={"inline"}>
                                &ensp;Signer le contrat
                            </Typography>
                        </button>
                        {AuthenticationService.getCurrentUserRole() !== "student" &&
                        <button
                            type={"button"}
                            className={[classes.linkButton].join(' ')}
                            onClick={() => {
                                setCurrentIndex(i);
                                openReasonModal()
                            }}
                        >
                            <i className="fa fa-ban" style={{color: "red"}}/>
                            <Typography display={"inline"}>
                                &ensp;Refuser le contrat
                            </Typography>
                        </button>
                        }
                    </div>}
                    {currentIndex === i &&
                    contractState(contracts[i])
                    }
                    <hr/>
                </div>}
        </PdfSelectionViewer>
        <Dialog open={isSignModalOpen} onClose={closeSignModal} fullWidth maxWidth={"md"}>
            <DialogTitle id="alert-dialog-title">{"Veuillez signer le contrat :"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" component={"div"}>
                    <Formik
                        onSubmit={async values => sendDecision(currentIndex, true, values)}
                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validate={values => {
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
                        {({submitForm, isSubmitting}) =>
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
                                </Grid>
                                <br/>
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
                            </Form>}
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
            onSubmit={async values => sendDecision(currentIndex, false, values)}
        />
    </div>
}