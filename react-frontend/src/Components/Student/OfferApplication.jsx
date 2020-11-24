import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import LinearProgress from "@material-ui/core/LinearProgress"
import MenuItem from "@material-ui/core/MenuItem"
import Typography from "@material-ui/core/Typography"
import {ErrorMessage, Field, Form, Formik} from "formik"
import {Select} from "formik-material-ui"
import React, {useEffect, useState} from "react"
import * as yup from "yup"
import AuthenticationService from "../../Services/AuthenticationService"
import {useApi, useModal} from "../Utils/Hooks"
import OfferDetails from "../Utils/OfferDetails"
import PdfSelectionViewer from "../Utils/PdfSelectionViewer"
import TextboxModal from "../Utils/TextboxModal"
import useStyles from "../Utils/useStyles"

export default function OfferApplication({count, pendingCount}) {
    const classes = useStyles()
    const api = useApi()
    const [offers, setOffers] = useState([])
    const [resumes, setResumes] = useState([])
    const [interviews, setInterviews] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isResumeModalOpen, openResumeModal, closeResumeModal] = useModal()
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal()
    const [isReasonOfInterviewModalOpen, openReasonOfInterviewModal, closeReasonOfInterviewModal] = useModal()

    useEffect(() => {
        api.get("/resumes/student/" + AuthenticationService.getCurrentUser().id)
            .then(result => setResumes(result ? result.data : []))

        api.get("/offers/student/" + AuthenticationService.getCurrentUser().id)
            .then(result => setOffers(result ? result.data.filter(offer => new Date(offer.details.limitDateToApply) >= new Date()) : []))

        api.get("/interviews/student/" + AuthenticationService.getCurrentUser().id)
            .then(result => setInterviews(result ? result.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        count(offers.filter(item => !hasStudentAppliedOnOffer(item, AuthenticationService.getCurrentUser())).length)

        pendingCount(
            offers.filter(item => hasEmployeurAcceptedStudentOnOffer(item, AuthenticationService.getCurrentUser()))
                .length
        )
    })

    function sendInterviewDecision(index, studentDecision, reason = "") {
        const nextState = [...interviews]
        const interview = nextState[index]
        interview.studentAcceptanceState = studentDecision
        interview.reasonForRejectionByStudent = reason
        return api.put("/interviews/" + nextState[index].id, nextState[index])
            .then(result => {
                if (result)
                    nextState[index] = result.data
                setInterviews(nextState)
                closeReasonOfInterviewModal()
            })
    }

    function sendDecision(index, studentDecision, reason = "") {
        const nextState = [...offers]
        const application = nextState[index].applications.find(a => a.student.id === AuthenticationService.getCurrentUser().id)
        application.reasonForRejection = reason
        application.state = studentDecision
        return api.put("/applications/state/" + application.id, application)
            .then(result => {
                nextState[index].applications.splice(nextState[index].applications.indexOf(application), 1, result.data)
                setOffers(nextState)
                closeReasonModal()
            })
    }

    function hasStudentAppliedOnOffer(offer, student) {
        return offer.applications.find(a => a.student.id === student.id) !== undefined && offer.applications.length !== 0
    }

    function hasEmployeurAcceptedStudentToInterview(i) {
        if (interviews[i]) {
            return interviews[i].studentApplication.student.id === AuthenticationService.getCurrentUser().id
        }
        return false
    }

    function hasEmployeurAcceptedStudentOnOffer(offer, student) {
        return offer.applications.find(a => a.student.id === student.id && a.state === "STUDENT_HIRED_BY_EMPLOYER") !== undefined && offer.applications.length !== 0
    }

    function getStudentDecision(offer, student) {
        if (offer.applications.find(a => a.student.id === student.id && a.state === "JOB_OFFER_ACCEPTED_BY_STUDENT")) {
            return " Vous avez accepté cette offre"
        } else if (offer.applications.find(a => a.student.id === student.id && a.state === "JOB_OFFER_DENIED_BY_STUDENT")) {
            return " Vous avez refusé cette offre"
        }
        return ""
    }

    function getStudentDecisionForInterview(i) {
        if (interviews[i]) {
            if (hasEmployeurAcceptedStudentToInterview(i) && interviews[i].studentAcceptanceState === "INTERVIEW_ACCEPTED_BY_STUDENT") {
                return " Vous avez accepté l'entrevue"
            } else if (hasEmployeurAcceptedStudentToInterview(i) && interviews[i].studentAcceptanceState === "INTERVIEW_REJECTED_BY_STUDENT") {
                return " Vous avez refusé l'entrevue"
            }
        }
        return ""
    }

    function getDateEntretien(i) {
        if (interviews[i]) {
            if (hasEmployeurAcceptedStudentToInterview(i)) {
                return new Date(interviews[i].date).toLocaleString()
            }
        }
        return ""
    }

    function generateMenuItems() {
        let filteredResumes = resumes.filter(r => r.reviewState === "APPROVED")
        if (filteredResumes.length !== 0) {
            filteredResumes = filteredResumes.map((item, i) =>
                <MenuItem key={i} value={item.id}>{item.name}</MenuItem>)
            filteredResumes.push(
                <MenuItem key={filteredResumes.length} value={-1} disabled>Veuillez choisir un CV</MenuItem>
            )
            return filteredResumes
        } else
            return <MenuItem value={-1} disabled>Aucun CV n'a été approuvé</MenuItem>
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Offres de stage disponibles"}>
            {(i, setCurrent) =>
                <div key={i}>
                    {!hasStudentAppliedOnOffer(offers[i], AuthenticationService.getCurrentUser()) &&
                    <div className={classes.buttonDiv}>
                        <button
                            type={"button"}
                            className={classes.linkButton}
                            style={{marginRight: 5}}
                            onClick={() => {
                                setCurrentIndex(i)
                                openResumeModal()
                            }}
                        >
                            <i className="fa fa-share-square-o"/>
                        </button>
                    </div>
                    }
                    {hasStudentAppliedOnOffer(offers[i], AuthenticationService.getCurrentUser()) &&
                    <div className={classes.buttonDiv}>
                        <i className={["fa fa-check-square", classes.appliedMark].join(" ")}
                           style={{color: "green", marginRight: 5}}/>
                    </div>
                    }
                    <button
                        type={"button"}
                        className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(" ")}
                        onClick={() => {
                            setCurrentIndex(i)
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
                    {hasStudentAppliedOnOffer(offers[i], AuthenticationService.getCurrentUser()) && hasEmployeurAcceptedStudentToInterview(i) &&
                    <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                        Date de l'entrevue : {getDateEntretien(i)}
                    </Typography>
                    }
                    {hasStudentAppliedOnOffer(offers[i], AuthenticationService.getCurrentUser()) && hasEmployeurAcceptedStudentToInterview(i) && interviews[i].studentAcceptanceState === "INTERVIEW_WAITING_FOR_STUDENT_DECISION" &&
                    <div className={classes.buttonDiv} style={{display: "block"}}>
                        Acceptez l'entrevue
                        <button
                            type={"button"}
                            className={[classes.linkButton].join(" ")}
                            onClick={() => sendInterviewDecision(i, "INTERVIEW_ACCEPTED_BY_STUDENT")}
                            style={{marginRight: 5}}
                        ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                        Refusez l'entrevue
                        <button
                            type={"button"}
                            className={[classes.linkButton].join(" ")}
                            onClick={() => {
                                setCurrentIndex(i)
                                openReasonOfInterviewModal()
                            }}
                        ><i className="fa fa-ban" style={{color: "red"}}/></button>
                    </div>
                    }
                    <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                        {getStudentDecisionForInterview(i)}
                    </Typography>
                    {hasEmployeurAcceptedStudentOnOffer(offers[i], AuthenticationService.getCurrentUser()) &&
                    <div className={classes.buttonDiv} style={{display: "block"}}>
                        Acceptez l'offre
                        <button
                            type={"button"}
                            className={[classes.linkButton].join(" ")}
                            onClick={() => sendDecision(i, "JOB_OFFER_ACCEPTED_BY_STUDENT")}
                            style={{marginRight: 5}}
                        ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                        Refusez l'offre
                        <button
                            type={"button"}
                            className={[classes.linkButton].join(" ")}
                            onClick={() => {
                                setCurrentIndex(i)
                                openReasonModal()
                            }}
                        ><i className="fa fa-ban" style={{color: "red"}}/></button>
                    </div>
                    }

                    <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                        {getStudentDecision(offers[i], AuthenticationService.getCurrentUser())}
                    </Typography>
                    <hr/>
                </div>
            }
        </PdfSelectionViewer>
        <Dialog open={isResumeModalOpen} onClose={closeResumeModal} fullWidth maxWidth={"md"}>
            <DialogTitle id="alert-dialog-title">{"Veuillez choisir un CV :"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" component={"div"}>
                    <Formik
                        onSubmit={async values => {
                            return api.post("/applications/" + offers[currentIndex].id + "/" + values.resumeId, {})
                                .then(r => {
                                    const nextState = [...offers]
                                    nextState[currentIndex].applications.push(r.data)
                                    setOffers(nextState)
                                    closeResumeModal()
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
                        {({isSubmitting}) =>
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
                        }
                    </Formik>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeResumeModal} color={"primary"}>
                    Annuler
                </Button>
            </DialogActions>
        </Dialog>
        <TextboxModal
            isOpen={isReasonModalOpen}
            hide={closeReasonModal}
            title={"Justifiez le refus"}
            onSubmit={async values => sendDecision(currentIndex, "JOB_OFFER_DENIED_BY_STUDENT", values.message)}
        />
        <TextboxModal
            isOpen={isReasonOfInterviewModalOpen}
            hide={closeReasonOfInterviewModal}
            title={"Justifiez le refus"}
            onSubmit={async values => sendInterviewDecision(currentIndex, "INTERVIEW_REJECTED_BY_STUDENT", values.message)}
        />
    </div>
}
