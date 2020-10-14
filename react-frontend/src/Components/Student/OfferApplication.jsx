import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import AuthenticationService from "../../Services/AuthenticationService";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Select} from "formik-material-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import {useStyles} from "../Utils/useStyles";
import {useApi, useModal} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import MenuItem from "@material-ui/core/MenuItem";
import OfferDetails from "../Utils/OfferDetails";

export default function OfferApplication() {
    const classes = useStyles();
    const api = useApi();
    const [offers, setOffers] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isResumeModalOpen, openReasonModal, closeResumeModal] = useModal();

    useEffect(() => {
        api.get("/resumes/student/" + AuthenticationService.getCurrentUser().id)
            .then(result => setResumes(result.data))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("/offers/student/" + AuthenticationService.getCurrentUser().id)
            .then(result => setOffers(result.data))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function hasStudentAppliedOnOffer(offer, student) {
        return offer.applications.find(a => a.student.id === student.id) !== undefined && offer.applications.length !== 0;
    }

    function generateMenuItems() {
        let filteredResumes = resumes.filter(r => r.approuved);
        if (filteredResumes.length !== 0) {
            filteredResumes = filteredResumes.map((item, i) => (
                <MenuItem key={i} value={item.id}>{item.name}</MenuItem>));
            filteredResumes.push(<MenuItem key={filteredResumes.length} value={-1} disabled>Veuillez choisir un
                CV</MenuItem>);
            return filteredResumes;
        } else
            return <MenuItem value={-1} disabled>Aucun CV n'a été approuvé</MenuItem>;
    }

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={offers.map(o => o.file)} title={"En attente d'approbation"}>
                {(i, setCurrent) => (
                    <div key={i}>
                        {!hasStudentAppliedOnOffer(offers[i], AuthenticationService.getCurrentUser()) &&
                        <div className={classes.buttonDiv}>
                            <button
                                type={"button"}
                                className={classes.linkButton}
                                style={{marginRight: 5}}
                                onClick={() => {
                                    setCurrentIndex(i);
                                    openReasonModal();
                                }}
                            ><i className="fa fa-share-square-o"/></button>
                        </div>
                        }
                        {hasStudentAppliedOnOffer(offers[i], AuthenticationService.getCurrentUser()) &&
                        <div className={classes.buttonDiv}>
                            <i className={["fa fa-check-square", classes.appliedMark].join(' ')}
                               style={{color: "green", marginRight: 5}}/>
                        </div>
                        }
                        <button
                            type={"button"}
                            className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                            onClick={() => {
                                setCurrentIndex(i);
                                setCurrent(i)
                            }}
                        >

                            <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                                {offers[i].title + " "}
                            </Typography>
                            <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                                {offers[i].employer.companyName}
                            </Typography>
                        </button>
                        {currentIndex === i && <OfferDetails offer={offers[i]}/>}
                        <hr/>
                    </div>
                )}
            </PdfSelectionViewer>
            <Dialog open={isResumeModalOpen} onClose={closeResumeModal} fullWidth maxWidth={"md"}>
                <DialogTitle id="alert-dialog-title">{"Veuillez choisir un CV :"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" component={"div"}>
                        <Formik
                            onSubmit={async (values) => {
                                return api.post("/application/" + offers[currentIndex].id + "/" + values.resumeId, {})
                                    .then((r) => {
                                        const nextState = [...offers];
                                        nextState[currentIndex].applications.push(r.data)
                                        setOffers(nextState);
                                        closeResumeModal();
                                    })
                            }}
                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize={true}
                            validationSchema={yup.object()
                                .shape({
                                    resumeId: yup.number().notOneOf([-1], "Impossible d'appliquer sans un CV valide").required("Ce champ est requis")
                                })
                            }
                            initialValues={{resumeId: -1}}>
                            {({isSubmitting}) => (
                                <Form>
                                    <Field
                                        component={Select}
                                        id="resumeId"
                                        name="resumeId"
                                        fullWidth
                                        style={{marginBottom: "10px"}}
                                    >
                                        {generateMenuItems()}
                                    </Field>
                                    <ErrorMessage name="resumeId">
                                        {msg => <span
                                            style={{color: "red", lineHeight: 3, verticalAlign: "center"}}>{msg}</span>}
                                    </ErrorMessage>
                                    {isSubmitting && <LinearProgress/>}
                                    <Button
                                        id="buttonSubmit"
                                        type={"submit"}
                                        variant="contained"
                                        fullWidth
                                        size={"large"}
                                        color="primary"
                                        disabled={isSubmitting}
                                    >
                                        Soumettre ma candidature
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeResumeModal} color={"primary"}>
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}