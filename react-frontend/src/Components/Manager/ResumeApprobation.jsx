import React, {useEffect, useState} from 'react';
import {Typography} from "@material-ui/core";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import {useApi, useModal} from "../Utils/Hooks";
import useStyles from "../Utils/useStyles";
import TextboxModal from "../Utils/TextboxModal";

export default function ResumeApprobation() {
    const classes = useStyles();
    const api = useApi();
    const [resumes, setResumes] = useState([{name: '', file: '', owner: {}}]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal();

    useEffect(() => {
        api.get("/resumes/pending")
            .then(r => setResumes(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function sendDecision(index, reviewState, reason = "") {
        const nextState = [...resumes];
        nextState[index].reviewState = reviewState;
        nextState[index].reasonForRejection = reason;
        return api.put("/resumes/" + nextState[index].id, nextState[index])
            .then(() => {
                nextState.splice(index, 1)
                setResumes(nextState)

                if (currentIndex >= nextState.length)
                    setCurrentIndex(0)

                closeReasonModal()
            })
    }

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={resumes.map(o => o.file)} title={"Approbation des CVs"}>
                {(i, setCurrent) => (
                    <div key={i}>
                        <div className={classes.buttonDiv}>
                            <button
                                type={"button"}
                                className={[classes.linkButton].join(' ')}
                                onClick={() => sendDecision(i, "APPROVED")}
                                style={{marginRight: 5}}
                            ><i className="fa fa-check-square" style={{color: "green"}}/></button>
                            <button
                                type={"button"}
                                className={[classes.linkButton].join(' ')}
                                onClick={() => {
                                    setCurrentIndex(i)
                                    openReasonModal()
                                }}
                            ><i className="fa fa-ban" style={{color: "red"}}/></button>
                        </div>
                        <button
                            type={"button"}
                            className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                            autoFocus={i === 0}
                            onClick={() => {
                                setCurrentIndex(i)
                                setCurrent(i)
                            }}
                        >
                            <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                                {" " + resumes[i].name + " "}
                            </Typography>
                            <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                                {resumes[i].owner.firstName} {resumes[i].owner.lastName}
                            </Typography>
                        </button>
                        <hr/>
                    </div>
                )}
            </PdfSelectionViewer>
            <TextboxModal
                isOpen={isReasonModalOpen}
                hide={closeReasonModal}
                title={"Justifiez le refus"}
                onSubmit={async (values) => sendDecision(currentIndex, "DENIED", values.message)}
            />
        </div>
    )
}
