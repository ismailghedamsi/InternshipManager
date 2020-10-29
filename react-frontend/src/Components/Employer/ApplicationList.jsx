import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {Link, useLocation} from "react-router-dom";
import useStyles from "../Utils/useStyles";
import {useApi, useModal} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import {Checkbox} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import {TextField} from "formik-material-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
const tooLongError = (value) => "Doit avoir moins que " + value.max + " caractères";
const requiredFieldMsg = "Ce champs est requis";
export default function ApplicationList() {
    const classes = useStyles();
    const location = useLocation();
    const api = useApi();
    const [offer, setOffer] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentApplicationId, setCurrentApplicationId] = useState(0);
    const [isContractModalOpen, openContractModal, closeContractModal] = useModal();

    const applicationStudentStates = [
        "WAITING_FOR_STUDENT_HIRING_FINAL_DECISION",
        "JOB_OFFER_ACCEPTED_BY_STUDENT",
        "JOB_OFFER_DENIED_BY_STUDENT"
    ]

    useEffect(() => {
        api.get("/offers/" + location.state.offerId)
            .then((r) => setOffer(r.data))
    }, [location.state.offerId]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={(offer.applications ? offer.applications : []).map(o => o.resume.file)}
                                title={(<span>Application<br/>{offer.title}</span>)}>
                {(i, setCurrent) => (
                    <div key={i}>
                        <button
                            type={"button"}
                            className={[classes.linkButton, classes.fileButton].join(' ')}
                            autoFocus={i === 0}
                            onClick={() => {
                                setCurrent(i)
                                setCurrentIndex(i)
                            }}>
                            <Typography color={"textPrimary"} variant={"h5"} style={{display: "block"}}>
                                {offer.applications[i].student.firstName} {offer.applications[i].student.lastName}
                            </Typography>
                        </button>
                        {currentIndex === i &&
                        <div>
                            <Typography color={"textPrimary"} variant={"body1"}>
                                {offer.applications[i].student.phoneNumber} {offer.applications[i].student.email}
                            </Typography>
                            <Typography color={"textPrimary"} variant={"body1"}>
                                {offer.applications[i].student.address}
                            </Typography>

                            {applicationStudentStates.indexOf(offer.applications[i].state) > -1 ? (
                                offer.applications[i].state === "JOB_OFFER_ACCEPTED_BY_STUDENT" ?
                                (<Typography variant={"body1"} style={{color: "blue"}}>
                                    L'étudiant a été embauché
                                    <button
                                        type={"button"}
                                        className={[classes.linkButton].join(' ')}
                                        onClick={() => {
                                            setCurrentApplicationId(offer.applications[i].id);
                                            openContractModal();
                                        }}
                                    ><i className="fa fa-envelope-square"/></button>
                                </Typography>) :
                                
                                offer.applications[i].state === "JOB_OFFER_DENIED_BY_STUDENT" ?
                                (<Typography variant={"body1"} style={{color: "red"}}>
                                    L'étudiant a refusé l'offre de stage
                                </Typography>) :

                                (<Typography variant={"body1"}>
                                    L'étudiant n'a pas encore décidé
                                </Typography>)
                            ) :

                            <Typography>
                                Application acceptée:

                                <Checkbox
                                    value="state"
                                    checked={offer.applications[i].state === "STUDENT_HIRED_BY_EMPLOYER"}
                                    onChange={
                                        () => {
                                            var copy = {...offer}
                                            copy.applications[i].state = copy.applications[i].state === "STUDENT_HIRED_BY_EMPLOYER" ? "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION" : "STUDENT_HIRED_BY_EMPLOYER"
                                            
                                            api.put(`applications/state/${offer.applications[i].id}`, offer.applications[i])
                                                .then(r => {
                                                    if (r) {
                                                        copy.applications[i].state = r.data.state;
                                                    }
                                                    setOffer(copy)
                                                });
                                        }}
                                    inputProps={{'aria-label': 'state'}}
                                />
                            </Typography>}

                            <Link variant={"body1"}
                                  to={{
                                      pathname: "/dashboard/interviewConvocation",
                                      state: {...offer.applications[i]}
                                  }}
                                  style={{display: "block"}}
                            >
                                Convoquer l'étudiant pour un entrevue
                            </Link>
                        </div>
                        }
                        <hr/>
                    </div>
                )}
            </PdfSelectionViewer>
            <Dialog open={isContractModalOpen} onClose={closeContractModal} fullWidth maxWidth={"md"}>
                <DialogTitle id="alert-dialog-title">{"Génerer le contrat"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" component={"div"}>
                        <Formik
                            onSubmit={async (values) => {
                                let dto = {...values};
                                dto.studentApplicationId = currentApplicationId;
                                return api.post("/contractGeneration", dto)
                                    .then(() => {
                                        closeContractModal();
                                    })
                            }}
                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize={true}
                            validationSchema={yup.object()
                                .shape({
                                    adminName: yup.string().trim().min(3, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
                                    engagementCollege: yup.string().trim().min(20, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
                                    engagementCompany: yup.string().trim().min(20, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
                                    engagementStudent: yup.string().trim().min(20, tooShortError).max(255, tooLongError).required(requiredFieldMsg),
                                    totalHoursPerWeek: yup.number().min(0).max(40).required(requiredFieldMsg)
                                })}
                            initialValues={{
                                adminName: "",
                                engagementCollege: "",
                                engagementCompany: "",
                                engagementStudent: "",
                                totalHoursPerWeek: 0
                            }}
                        >
                            {({isSubmitting}) => (
                                <Form className={classes.form}>
                                    <Grid container>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={TextField}
                                                name="adminName"
                                                id="adminName"
                                                variant="outlined"
                                                label="Nom du gestionnaire de stage"
                                                required
                                                fullWidth
                                                autoFocus
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={TextField}
                                                name="totalHoursPerWeek"
                                                id="totalHoursPerWeek"
                                                variant="outlined"
                                                label="Nombre d'heures par semaine"
                                                required
                                                fullWidth
                                                type={"number"}
                                                InputProps={{inputProps: {min: 0}}}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={TextField}
                                                name="engagementCollege"
                                                id="engagementCollege"
                                                variant="outlined"
                                                label="Engagements du collège"
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={TextField}
                                                name="engagementCompany"
                                                id="engagementCompany"
                                                variant="outlined"
                                                label="Engagements de l'entreprise"
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={TextField}
                                                name="engagementStudent"
                                                id="engagementStudent"
                                                variant="outlined"
                                                label="Engagements de l'étudiant"
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                    <br/>
                                    {isSubmitting && <LinearProgress/>}
                                    <Button
                                        type={"submit"}
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        size={"large"}
                                        className={classes.submit}
                                        disabled={isSubmitting}
                                    >
                                        Génerer
                                    </Button>
                                </Form>
                            )}
                        </Formik>
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