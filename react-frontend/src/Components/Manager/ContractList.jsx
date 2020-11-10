import {Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useApi} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import useStyles from "../Utils/useStyles";

export default function ContractList() {
    const classes = useStyles();
    const api = useApi();
    const [contracts, setContracts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        api.get("/contract")
            .then(r => setContracts(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function sendDecision(index, contractState) {
        const nextState = [...contracts];
        const contract = nextState[index];
        contract.signatureState = contractState;
        delete contract.studentApplication.contract;
        delete contract.studentApplication.resume;
        return api.put("/contract/" + contract.id, contract)
            .then(r => {
                nextState.splice(index, 1, r.data)
                setContracts(nextState)
            })
    }

    function deleteContract(index) {
        const nextState = [...contracts];
        return api.delete("/contract/" + nextState[index].id)
            .then(() => {
                nextState.splice(index, 1)
                setContracts(nextState)
            })
    }

    function showContractState(index) {
        const nextState = [...contracts];
        const contractState = nextState[index].signatureState;

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
                return '';
        }
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer
            documents={contracts ? contracts.map(c => c.file ? c.file : "") : []}
            title={"Contrats"}>
            {(i, setCurrent) =>
                <div key={i}>
                    <div className={classes.buttonDiv}>
                        {contracts[i].signatureState !== "WAITING_FOR_STUDENT_SIGNATURE" &&
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
                        <Typography color={"textPrimary"} variant={"body2"}>
                            Nom du gestionnaire de stage : {contracts[i].adminName}
                        </Typography>
                    </button>
                    <div className={classes.buttonDiv} style={{display: "block"}}>
                        {contracts[i].signatureState === "PENDING_FOR_ADMIN_REVIEW" &&
                        <button
                            type={"button"}
                            className={[classes.linkButton].join(' ')}
                            onClick={() => sendDecision(i, "WAITING_FOR_EMPLOYER_SIGNATURE")}
                        >
                            <i className="fa fa-check-square" style={{color: "green"}}/>
                            <Typography display={"inline"}>
                                &ensp;Approuver le contrat
                            </Typography>
                        </button>
                        }
                        {contracts[i].signatureState === "WAITING_FOR_ADMIN_SIGNATURE" &&
                        <Link variant={"body1"}
                              to={{
                                  pathname: "/dashboard/signFormAdmin",
                                  state: {...contracts[i]}
                              }}
                              style={{display: "block"}}
                        >
                            Signer le contrat
                        </Link>
                        }
                        {showContractState(i)}
                    </div>
                    <hr className={classes.hrStyle}/>
                </div>}
        </PdfSelectionViewer>
    </div>
}