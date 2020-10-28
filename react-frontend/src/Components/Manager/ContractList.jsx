import React, {useEffect, useState} from "react";
import useStyles from "../Utils/useStyles";
import {useApi, useModal} from "../Utils/Hooks";
import {Typography} from "@material-ui/core";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import {Field, Form, Formik} from "formik";
import Grid from "@material-ui/core/Grid";
import {TextField} from "formik-material-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";

const tooShortError = (value) => "Doit avoir au moins " + value.min + " caractères";
const tooLongError = (value) => "Doit avoir moins que " + value.max + " caractères";
const requiredFieldMsg = "Ce champs est requis";
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
                        {offers[i].applications.length !== 0 && offers[i].applications.find(a => a.state === "JOB_OFFER_ACCEPTED_BY_STUDENT") &&
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
                            {currentIndex === i && offers[i].applications.length !== 0 && offers[i].applications.find(a => a.state === "JOB_OFFER_ACCEPTED_BY_STUDENT") &&
                            students.map((student, j) => (
                                <div key={j}>
                                    {offers[i].applications.find(a => a.student.firstName === student.firstName && a.state === "JOB_OFFER_ACCEPTED_BY_STUDENT") &&
                                    <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                                        {student.firstName} {student.lastName}
                                        <button
                                            type={"button"}
                                            className={[classes.linkButton].join(' ')}
                                            onClick={() => {
                                                setCurrentIndex(i)
                                                openContractModal()
                                            }}
                                        ><i className="fa fa-envelope-square"/></button>
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
                <DialogTitle id="alert-dialog-title">{"Génerer le contrat"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" component={"div"}>
                        <Formik
                            onSubmit={async (values) => {
                                let dto = {...values};
                                // todo envoyer le id de apllication
                                // dto.studentApplication.id =
                                {
                                    console.log(dto.studentApplication)
                                }
                                return api.post("/contract", dto)
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