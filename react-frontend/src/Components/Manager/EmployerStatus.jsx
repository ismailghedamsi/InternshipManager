import {Button, Divider, Grid, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {useApi, useDateParser, useModal, useTimeParserFromDate} from "../../Services/Hooks";
import OfferDetails from "../Utils/OfferDetails";
import PdfModal from "../Utils/PdfModal"
import useStyles from "../Utils/Style/useStyles";
import * as PropTypes from "prop-types";

function EmployerApplicationDetails({offers}) {

    function interviewStatus() {
        let interviewCount = 0

        for (const offer of offers)
            interviewCount += offer.applications.filter(appli => appli.interview).length

        if (interviewCount > 0)
            return interviewCount + " demandes d'entrevue"
        else
            return "Aucune demande d'entrevue"
    }

    function isApplicationWaitingForEmployer(appli) {
        return appli.state === "APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW" ||
            appli.state === "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION"
    }

    function applicationsStatus() {
        let applisWaitingForEmployerCount = 0

        for (const offer of offers)
            applisWaitingForEmployerCount += offer.applications.filter(appli => isApplicationWaitingForEmployer(appli)).length

        return applisWaitingForEmployerCount + " applications en attente de l'employeur"
    }

    function contractsStatus() {
        let contractsWaitingCount = 0
        let contractFinalizedCount = 0

        for (const offer of offers)
            for (const appli of offer.applications)
                if (appli.contract)
                    switch (appli.contract.signatureState) {
                        case "PENDING_FOR_ADMIN_REVIEW":
                        case "WAITING_FOR_EMPLOYER_SIGNATURE" :
                        case "WAITING_FOR_STUDENT_SIGNATURE" :
                        case "WAITING_FOR_ADMIN_SIGNATURE":
                            contractsWaitingCount++
                            break;
                        case "SIGNED":
                            contractFinalizedCount++
                            break;
                        default:
                            break;
                    }

        return contractsWaitingCount + " contrats en attente, " + contractFinalizedCount + " contrats finalisés"
    }

    return offers.find(offer => offer.applications).applications.length > 0 ? <>
        <Typography>
            {interviewStatus()}
        </Typography>
        <Typography>
            {applicationsStatus()}
        </Typography>
        <Typography>
            {contractsStatus()}
        </Typography>
    </> : <Typography>
        N'a reçu aucune application d'étudiant
    </Typography>
}

EmployerApplicationDetails.propTypes = {
    offers: PropTypes.array.isRequired
}

function EmployerStatusDetails({offers}) {
    function offerStatus() {
        if (offers.length === 0)
            return "Aucune offre"
        else {
            let approvedOffers = 0
            let pendingOffers = 0
            let rejectedOffers = 0

            for (const offer of offers) {
                if (offer.reviewState === "APPROVED")
                    approvedOffers++
                else if (offer.reviewState === "PENDING")
                    pendingOffers++
                else if (offer.reviewState === "DENIED")
                    rejectedOffers++
            }

            return offers.length + " offres: " + approvedOffers + " approuvées, "
                + pendingOffers + " en attente, " + rejectedOffers + " rejetées"
        }
    }

    return <>
        <Typography>
            {offerStatus()}
        </Typography>
        {offers.find(offer => offer.applications) &&
        <EmployerApplicationDetails offers={offers}/>
        }
    </>
}

EmployerStatusDetails.propTypes = {
    offers: PropTypes.array.isRequired
}

function InterviewStatus(props) {
    const parseDate = useDateParser()
    const parseTimeFromDate = useTimeParserFromDate()

    function getInterviewState(interview) {
        if (interview.reviewState === "PENDING")
            return <span style={{color: "blue"}}>En attente</span>
        else if (interview.reviewState === "DENIED")
            return <span style={{color: "red"}}>Rejeté<span
                style={{color: "black"}}> : {interview.reasonForRejection} </span></span>
        else
            return <span style={{color: "green"}}>Approuvé</span>
    }

    return <div>
        <Typography>
            Entrevue pour
            l'étudiant {props.interview.studentApplication ? props.interview.studentApplication.student.firstName + " " + props.interview.studentApplication.student.lastName : ""}
        </Typography>
        <Typography>
            Date : {props.interview ? parseDate(props.interview.date) : ""}
        </Typography>
        <Typography>
            Heure : {props.interview ? parseTimeFromDate(props.interview.date) : ""}
        </Typography>
        <Typography>Titre de l'offre :
            {props.interview.studentApplication ? props.interview.studentApplication.offer.title : ""}</Typography>
        <Typography>
            État : {getInterviewState(props.interview)}
        </Typography>
    </div>
}

function Offer(props) {
    return <div>
        <Typography variant={"h5"}>
            {props.o.title}
        </Typography>
        <OfferDetails offer={props.o}/>
        <Typography>
            <span>Liste des étudiants sélectionnés</span>
        </Typography>
        {props.hiredStudentsNames}
        {props.printOfferStatus}
        <Button
            variant={"contained"}
            color={"primary"}
            size={"small"}
            onClick={props.onClick}>
            <i className="fa fa-file-text-o"/>&ensp;Afficher l'offre
        </Button>
        <Divider className={props.classes.dividers}/>
    </div>;
}

Offer.propTypes = {
    o: PropTypes.any,
    hiredStudentsNames: PropTypes.any,
    printOfferStatus: PropTypes.any,
    onClick: PropTypes.func,
    classes: PropTypes.any
};

function EmployerInformation(props) {
    return <div>
        <Button
            variant={"contained"}
            color={"primary"}
            style={{textTransform: "none", marginBottom: 10}}
            onClick={props.onClick}
        >
            <Typography variant={"body1"} display={"block"}>
                {props.employers[props.i].companyName + " - " + props.employers[props.i].contactName}
            </Typography>
        </Button>
        {props.currentEmployerIndex === props.i &&
        <div>
            <EmployerStatusDetails offers={props.offers}/>
            <Button
                variant={props.currentSubtab === 0 ? "contained" : "outlined"}
                color={"primary"}
                style={{textTransform: "none"}}
                onClick={props.onClick1}>
                <Typography variant={"body2"}>
                    Offres
                </Typography>
            </Button>
            &ensp;
            <Button
                variant={props.currentSubtab === 1 ? "contained" : "outlined"}
                color={"primary"}
                style={{textTransform: "none"}}
                onClick={props.onClick2
                }>
                <Typography color={"textSecondary"} variant={"body2"}>
                    Entrevues
                </Typography>
            </Button>
        </div>}
        <Divider className={props.classes.dividers}/>
    </div>;
}

EmployerInformation.propTypes = {
    onClick: PropTypes.func,
    employers: PropTypes.arrayOf(PropTypes.any),
    i: PropTypes.number,
    currentEmployerIndex: PropTypes.number,
    offers: PropTypes.arrayOf(PropTypes.any),
    currentSubtab: PropTypes.number,
    onClick1: PropTypes.func,
    onClick2: PropTypes.func,
    classes: PropTypes.any
};
export default function EmployerStatus() {
    const offersTabIndex = 0
    const interviewsTabIndex = 1
    const classes = useStyles()
    const api = useApi()
    const [employers, setEmployers] = useState([])
    const [currentEmployerOffers, setCurrentEmployerOffers] = useState([])
    const [currentEmployerInterviews, setCurrentEmployerInterviews] = useState([])
    const [currentEmployerIndex, setCurrentEmployerIndex] = useState(0)
    const [isPdfOpen, openPdf, closePdf] = useModal()
    const [currentDoc, setCurrentDoc] = useState("")
    const [currentSubtab, setCurrentSubtab] = useState(0)

    useEffect(() => {
        api.get("employers").then(resp => {
            setEmployers(resp ? resp.data : [])
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (employers[currentEmployerIndex])
            api.get("/offers/employer/" + employers[currentEmployerIndex].email)
                .then(r => {
                    setCurrentEmployerOffers(r.data)
                })
    }, [currentEmployerIndex, employers]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (employers[currentEmployerIndex]) {
            api.get("/interviews/employer/" + employers[currentEmployerIndex].id)
                .then(r => {
                    setCurrentEmployerInterviews(r ? r.data : [])
                })
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getCurrentEmployerInterviews(index) {
        api.get("/interviews/employer/" + employers[index].id)
            .then(r => {
                setCurrentEmployerInterviews(r ? r.data : [])
            })
    }

    function hiredStudentsNames(o) {
        return o.reviewState === "APPROVED" ?
            o.applications.map(elem =>
                <Typography
                    style={{fontWeight: "bold"}}>{elem.student.firstName + " " + elem.student.lastName}</Typography>
            )
            : <Typography style={{fontWeight: "bold"}}>Aucun étudiant n'a été selectionné pour l'offre</Typography>
    }

    function printOfferStatus(offer) {
        if (offer.reviewState === "PENDING")
            return <span style={{color: "blue"}}>En attente</span>
        else if (offer.reviewState === "DENIED")
            return <span style={{color: "red"}}>Rejeté<span
                style={{color: "black"}}> : {offer.reasonForRejection} </span></span>
        else
            return <span style={{color: "green"}}>Approuvé</span>
    }

    return <Grid
        container
        spacing={2}
        wrap={"nowrap"}
        className={classes.main}
        style={{padding: "15px 0 0 15px"}}
    >
        <Grid item xs={5} className={classes.list}>
            <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                État des employeurs
            </Typography>
            {employers.length !== 0 ? employers.map((item, i) =>
                <EmployerInformation key={i}
                                     onClick={() => {
                                         setCurrentEmployerIndex(i)
                                     }}
                                     employers={employers}
                                     i={i}
                                     currentEmployerIndex={currentEmployerIndex}
                                     offers={currentEmployerOffers}
                                     currentSubtab={currentSubtab}
                                     onClick1={() => setCurrentSubtab(0)}
                                     onClick2={() => {
                                         setCurrentSubtab(1)
                                         getCurrentEmployerInterviews(currentEmployerIndex)
                                     }}
                                     classes={classes}/>
            ) : <Typography variant={"h5"}>Aucun employeurs</Typography>}
        </Grid>
        <Divider orientation={"vertical"} flexItem/>
        <Grid item xs={7} align="center" style={{overflow: "auto", height: "100%"}}>
            {employers.length !== 0 && <>
                {currentSubtab === offersTabIndex && (currentEmployerOffers.length > 0 ? currentEmployerOffers.map((o, k) =>
                        <Offer key={k} o={o} hiredStudentsNames={hiredStudentsNames(o)}
                               printOfferStatus={printOfferStatus(o)} onClick={() => {
                            setCurrentDoc(o.file)
                            openPdf()
                        }} classes={classes}/>
                    )
                    : <Typography variant={"h5"}>L'employeur n'a aucune offre</Typography>)}
                {currentSubtab === interviewsTabIndex && (currentEmployerInterviews.length > 0 ? currentEmployerInterviews.map((interview, index) =>
                        <>
                            <InterviewStatus key={index} classes={classes} interview={interview}/>
                            <Divider className={classes.dividers}/>
                        </>
                    )
                    : <Typography variant={"h5"}>L'employeur n'a programmé aucune entrevue</Typography>)
                }
            </>}
        </Grid>
        <PdfModal open={isPdfOpen}
                  onClose={closePdf}
                  document={currentDoc}
        />
    </Grid>
}
