import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import ApprovalButtons from "../Utils/ApprovalButtons";
import PdfSelectionViewer from "../Utils/PDF/PdfSelectionViewer";
import {useApi} from "../Utils/Services/Hooks";
import useStyles from "../Utils/Style/useStyles";

export default function ContractList() {
    const classes = useStyles()
    const api = useApi()
    const history = useHistory()
    const [contracts, setContracts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        api.get("/contract")
            .then(r => setContracts(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function sendDecision(index, isApproved) {
        const nextState = [...contracts]
        const signDto = {}
        signDto.contractId = nextState[index].id
        signDto.isApproved = isApproved

        return api.put("/contractGeneration/sign", signDto)
            .then(r => {
                nextState.splice(index, 1, r.data)
                setContracts(nextState)
            })
    }

    function deleteContract(index) {
        const nextState = [...contracts]
        return api.delete("/contract/" + nextState[index].id)
            .then(() => {
                nextState.splice(index, 1)
                setContracts(nextState)
            })
    }

    function showContractState(index) {
        const nextState = [...contracts]
        const contractState = nextState[index].signatureState

        switch (contractState) {
            case "WAITING_FOR_EMPLOYER_SIGNATURE" :
                return <Typography variant={"body1"} style={{color: "blue"}}>
                    En attente de la signature de l'employeur
                </Typography>
            case "REJECTED_BY_EMPLOYER" :
                return <Typography variant={"body1"} style={{color: "red"}}>
                    L'employeur a rejeté le contrat :
                    {nextState[index].reasonForRejection}
                </Typography>
            case "WAITING_FOR_STUDENT_SIGNATURE" :
                return <Typography variant={"body1"} style={{color: "blue"}}>
                    En attente de la signature de l'étudiant
                    {nextState[index].reasonForRejection}
                </Typography>
            case "SIGNED":
                return <Typography variant={"body1"} style={{color: "green"}}>
                    Contrat signé
                </Typography>
            default:
                return ""
        }
    }


    function showDeleteContractButtonCondition(i) {
        return contracts[i].signatureState === "WAITING_FOR_EMPLOYER_SIGNATURE" || contracts[i].signatureState === "REJECTED_BY_EMPLOYER"
    }

    function showEvaluationButtonCondition(i) {
        return contracts[i].signatureState === "SIGNED" && contracts[i].businessEvaluation === null
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer
            documents={contracts ? contracts.map(c => c.file ? c.file : "") : []}
            title={"Contrats"}>
            {(i, setCurrent) =>
                <div key={i}>
                    <div className={classes.buttonDiv}>
                        {showDeleteContractButtonCondition(i) &&
                        <button
                            type={"button"}
                            className={classes.linkButton}
                            onClick={() => deleteContract(i)}>
                            <i className="fa fa-trash" style={{color: "red"}}/>
                        </button>
                        }
                    </div>
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
                        <Typography color={"textPrimary"} variant={"body2"}>
                            Nom du gestionnaire de stage : {contracts[i].admin.name}
                        </Typography>
                    </button>
                    <div className={classes.buttonDiv} style={{display: "block"}}>
                        {contracts[i].signatureState === "PENDING_FOR_ADMIN_REVIEW" &&
                        <ApprovalButtons
                            onApprove={() => sendDecision(i, true)}
                            onDeny={() => deleteContract(i)}
                            approveLabel={"Approuvez le contrat"}
                            denyLabel={"Supprimez le contrat"}
                        />
                        }
                        {contracts[i].signatureState === "WAITING_FOR_ADMIN_SIGNATURE" &&
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => {
                                history.push("/dashboard/signFormAdmin", {...contracts[i]})
                            }}>
                            Signer le contrat
                        </Button>
                        }
                        {showContractState(i)}
                    </div>
                    {showEvaluationButtonCondition(i) &&
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => {
                            history.push("/dashboard/businessEvaluation", {...contracts[i]})
                        }}
                    >
                        Évaluer l'entreprise
                    </Button>
                    }
                    <hr className={classes.hrStyle}/>
                </div>}
        </PdfSelectionViewer>
    </div>
}
