import {Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";
import {useApi, useModal} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import TextboxModal from "../Utils/TextboxModal";
import useStyles from "../Utils/useStyles";

export default function SignContract() {
    const classes = useStyles();
    const api = useApi();
    const [contracts, setContracts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal();

    useEffect(() => {
        if (AuthenticationService.getCurrentUserRole() === "employer") {
            api.get("/contract/employer/" + AuthenticationService.getCurrentUser().id)
                .then(r => setContracts(r ? r.data : []))
        } else if (AuthenticationService.getCurrentUserRole() === "student") {
            api.get("/contract/student/" + AuthenticationService.getCurrentUser().id)
                .then(r => setContracts(r ? r.data : []))
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function sendDecision(index, isApprouved, values) {
        const nextState = [...contracts];
        let dto = {};
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
            case "WAITING_FOR_ADMIN_SIGNATURE":
                if (AuthenticationService.getCurrentUserRole() !== "admin") {
                    return <Typography variant={"body1"} style={{color: "blue"}}>
                        En attente de la signature du gestionnaire de stage
                    </Typography>
                }
                break;
            case "SIGNED":
                return <Typography variant={"body1"} style={{color: "green"}}>
                    Contrat signée
                </Typography>
            default:
                return '';
        }
    }

    function ownerCondition(i) {
        if ((contracts[i].signatureState === "WAITING_FOR_EMPLOYER_SIGNATURE" && AuthenticationService.getCurrentUserRole() === "employer")
            || (contracts[i].signatureState === "WAITING_FOR_STUDENT_SIGNATURE" && AuthenticationService.getCurrentUserRole() === "student"))
            return true;
        else return false;
    }

    function directionLink() {
        if (AuthenticationService.getCurrentUserRole() === "employer")
            return "/dashboard/signFormEmployer"
        else
            return "/dashboard/signFormStudent"
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
                        <Link variant={"body1"}
                              to={{
                                  pathname: directionLink(),
                                  state: {...contracts[i]}
                              }}
                              style={{display: "block"}}
                        >
                            Signer le contrat
                        </Link>
                        {AuthenticationService.getCurrentUserRole() !== "student" &&
                        <button
                            type={"button"}
                            className={classes.linkButton}
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
        <TextboxModal
            isOpen={isReasonModalOpen}
            hide={closeReasonModal}
            title={"Justifiez le refus"}
            onSubmit={async values => sendDecision(currentIndex, false, values)}
        />
    </div>
}