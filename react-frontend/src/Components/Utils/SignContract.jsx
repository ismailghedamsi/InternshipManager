import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";
import {useApi, useModal} from "../../Services/Hooks";
import TextboxModal from "./Modal/TextboxModal";
import PdfSelectionViewer from "./PDF/PdfSelectionViewer";
import useStyles from "./Style/useStyles";
import SignModal from "./Modal/SignModal";

export default function SignContract({count, waitingCount}) {
    const classes = useStyles()
    const api = useApi()
    const history = useHistory()
    const [contract, setContract] = useState([])
    const [contracts, setContracts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isSignModalOpen, openSignModal, closeSignModal] = useModal()
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
                    <Button
                        variant={currentIndex === i ? "contained" : "outlined"}
                        color={"primary"}
                        size={"large"}
                        onClick={() => {
                            setCurrent(i)
                            setCurrentIndex(i)
                        }}
                    >
                        <Typography variant={"button"}>
                            {contracts[i].studentApplication.student.firstName} {contracts[i].studentApplication.student.lastName}
                            &ensp;&mdash;&ensp;{contracts[i].studentApplication.offer.employer.companyName}
                        </Typography>
                    </Button>
                    {currentIndex === i && ownerCondition(i) &&
                    <div className={classes.buttonDiv}>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            size={"small"}
                            onClick={() => {
                                setContract(contracts[i])
                                openSignModal()
                            }}>
                            <i className="fa fa-pencil-square-o" style={{color: "white"}}/>&ensp;Signer le contrat
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
                            <i className="fa fa-times" style={{color: "white"}}/>&ensp;Refuser le contrat
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
        <SignModal isOpen={isSignModalOpen}
                   hide={closeSignModal}
                   title={"Veuillez signer le contrat"}
                   contract={contract}
        />
        <TextboxModal
            isOpen={isReasonModalOpen}
            hide={closeReasonModal}
            title={"Justifiez le refus"}
            onSubmit={async values => sendDecision(currentIndex, false, values)}
        />
    </div>
}
