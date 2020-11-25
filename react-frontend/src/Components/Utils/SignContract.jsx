import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";
import TextboxModal from "./Modal/TextboxModal";
import PdfSelectionViewer from "./PDF/PdfSelectionViewer";
import {useApi, useModal} from "./Services/Hooks";
import useStyles from "./Style/useStyles";

export default function SignContract({count, waitingCount}) {
    const classes = useStyles()
    const api = useApi()
    const history = useHistory()
    const [contracts, setContracts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal()

    useEffect(() => {
        if (AuthenticationService.getCurrentUserRole() === "employer") {
            api.get("/contract/employer/" + AuthenticationService.getCurrentUser().id)
                .then(r => setContracts(r ? r.data : []))
        } else if (AuthenticationService.getCurrentUserRole() === "student") {
            api.get("/contract/student/" + AuthenticationService.getCurrentUser().id)
                .then(r => setContracts(r ? r.data : []))
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        count(contracts.length)

        if (AuthenticationService.getCurrentUserRole() === "student")
            waitingCount(contracts.filter(c => c.signatureState === "WAITING_FOR_STUDENT_SIGNATURE").length)
        else if (AuthenticationService.getCurrentUserRole() === "employer")
            waitingCount(contracts.filter(c => c.signatureState === "WAITING_FOR_EMPLOYER_SIGNATURE").length)
    })

    function sendDecision(index, isApproved, values) {
        const nextState = [...contracts]
        let dto = {}
        dto.contractId = nextState[index].id
        dto.isApproved = isApproved
        dto.reasonForRejection = values.message
        return api.put("/contractGeneration/sign", dto)
            .then(result => {
                nextState.splice(index, 1, result.data)
                setContracts(nextState)
                closeReasonModal()
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
                break
            case "WAITING_FOR_STUDENT_SIGNATURE":
                if (AuthenticationService.getCurrentUserRole() !== "student") {
                    return <Typography variant={"body1"} style={{color: "blue"}}>
                        En attente de la signature de l'étudiant
                    </Typography>
                }
                break
            case "WAITING_FOR_ADMIN_SIGNATURE":
                if (AuthenticationService.getCurrentUserRole() !== "admin") {
                    return <Typography variant={"body1"} style={{color: "blue"}}>
                        En attente de la signature du gestionnaire de stage
                    </Typography>
                }
                break
            case "SIGNED":
                return <Typography variant={"body1"} style={{color: "green"}}>
                    Contrat signé
                </Typography>
            default:
                return ""
        }
    }

    function ownerCondition(i) {
        if ((contracts[i].signatureState === "WAITING_FOR_EMPLOYER_SIGNATURE" && AuthenticationService.getCurrentUserRole() === "employer")
            || (contracts[i].signatureState === "WAITING_FOR_STUDENT_SIGNATURE" && AuthenticationService.getCurrentUserRole() === "student"))
            return true
        else return false
    }

    function directionLink() {
        return AuthenticationService.getCurrentUserRole() === "employer" ?
            "/dashboard/signFormEmployer" : "/dashboard/signFormStudent"
    }

    function showEvaluationButtonCondition(i) {
        return contracts[i].signatureState === "SIGNED"
            && AuthenticationService.getCurrentUserRole() === "employer"
            && contracts[i].internEvaluation === null
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer
            documents={contracts ? contracts.map(c => c.file ? c.file : "") : []}
            title={"Contrats"}>
            {(i, setCurrent) =>
                <div key={i}>
                    <button
                        type={"button"}
                        className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(" ")}
                        onClick={() => {
                            setCurrent(i)
                            setCurrentIndex(i)
                        }}
                    >
                        <Typography color={"textPrimary"} variant={"body1"}>
                            {contracts[i].studentApplication.student.firstName} {contracts[i].studentApplication.student.lastName}
                            &ensp;&mdash;&ensp;{contracts[i].studentApplication.offer.employer.companyName}
                        </Typography>
                    </button>
                    {currentIndex === i && ownerCondition(i) &&
                    <div className={classes.buttonDiv} style={{display: "block"}}>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => {
                                history.push(directionLink(), {...contracts[i]})
                            }}>
                            Signer le contrat
                        </Button>
                        &ensp;
                        {AuthenticationService.getCurrentUserRole() !== "student" &&
                        <Button
                            variant={"contained"}
                            style={{backgroundColor: "red", color: "white"}}
                            onClick={() => {
                                setCurrentIndex(i)
                                openReasonModal()
                            }}>
                            Refuser le contrat
                        </Button>
                        }
                    </div>}
                    {currentIndex === i &&
                    contractState(contracts[i])
                    }
                    {showEvaluationButtonCondition(i) &&
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => {
                            history.push("/dashboard/evaluateStudent", {...contracts[i]})
                        }}
                    >
                        Évaluer l'étudiant
                    </Button>
                    }
                    <hr/>
                </div>}
        </PdfSelectionViewer>
        <TextboxModal
            isOpen={isReasonModalOpen}
            hide={closeReasonModal}
            title={"Justifiez le refus"}
            onSubmit={async values => sendDecision(currentIndex, false, values)}
        />
    </div>
}
