import {Typography} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import React, {useEffect, useState} from "react"
import {useApi, useModal} from "../Utils/Hooks"
import PdfSelectionViewer from "../Utils/PdfSelectionViewer"
import TextboxModal from "../Utils/TextboxModal"
import useStyles from "../Utils/useStyles"

export default function ResumeApprobation({count}) {
    const classes = useStyles()
    const api = useApi()
    const [resumes, setResumes] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal()

    useEffect(() => {
        api.get("/resumes/pending")
            .then(r => setResumes(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        count(resumes.length)
    })

    function sendDecision(index, reviewState, reason = "") {
        const nextState = [...resumes]
        nextState[index].reviewState = reviewState
        nextState[index].reasonForRejection = reason
        return api.put("/resumes/" + nextState[index].id, nextState[index])
            .then(() => {
                nextState.splice(index, 1)
                setResumes(nextState)

                if (currentIndex >= nextState.length)
                    setCurrentIndex(0)

                closeReasonModal()
            })
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={resumes.map(o => o.file)} title={"CVs en attente"}>
            {(i, setCurrent) => <div key={i}>
                <button
                    type={"button"}
                    className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(" ")}
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
                <Grid container spacing={1} className={classes.buttonDiv}>
                    <Grid item xs={6}>
                        <Button
                            onClick={() => sendDecision(i, "APPROVED")}
                            variant={"contained"}
                            color={"primary"}
                            fullWidth
                            style={{backgroundColor: "green"}}
                        >
                            <i className="fa fa-check-square" style={{color: "white"}}/>&ensp;Approuver
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            onClick={() => {
                                setCurrentIndex(i)
                                openReasonModal()
                            }}
                            variant={"contained"}
                            color={"primary"}
                            fullWidth
                            style={{backgroundColor: "red"}}
                        >
                            <i className="fa fa-ban" style={{color: "white"}}/>&ensp;Refuser
                        </Button>
                    </Grid>
                </Grid>
                <hr/>
            </div>}
        </PdfSelectionViewer>
        <TextboxModal
            isOpen={isReasonModalOpen}
            hide={closeReasonModal}
            title={"Justifiez le refus"}
            onSubmit={async values => sendDecision(currentIndex, "DENIED", values.message)}
        />
    </div>
}
