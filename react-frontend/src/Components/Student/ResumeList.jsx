import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import AuthenticationService from "../../Services/AuthenticationService";
import {useApi} from "../../Services/Hooks";
import PdfSelectionViewer from "../Utils/PDF/PdfSelectionViewer";
import useStyles from "../Utils/Style/useStyles";

export default function ResumeList({count, deniedCount}) {
    const classes = useStyles()
    const api = useApi()
    const [resumes, setResumes] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        api.get("/resumes/student/" + AuthenticationService.getCurrentUser().id)
            .then(r => setResumes(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        count(resumes.length)
        deniedCount(resumes.filter(r => r.reviewState === "DENIED").length)
    })

    function deleteResume(index) {
        const nextState = [...resumes]
        return api.delete("/resumes/" + nextState[index].id)
            .then(() => {
                nextState.splice(index, 1)

                if (currentIndex >= nextState.length)
                    setCurrentIndex(0)

                setResumes(nextState)
            })
    }

    function getResumeState(resume) {
        if (resume.reviewState === "PENDING")
            return <span style={{color: "blue"}}>En attente</span>
        else if (resume.reviewState === "DENIED")
            return <span style={{color: "red"}}>Rejeté<span
                style={{color: "black"}}> : {resume.reasonForRejection} </span></span>
        else
            return <span style={{color: "green"}}>Approuvé</span>
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={resumes.map(o => o.file)} title={"Liste des CVs"}>
            {(i, setCurrent) => <div key={i}>
                <div className={classes.buttonDiv}>
                    <button
                        type={"button"}
                        className={classes.linkButton}
                        onClick={() => deleteResume(i)}
                        style={{width: "auto"}}
                        disabled={resumes[i].applications.length !== 0}
                        title={resumes[i].applications.length === 0 ? '' : 'Impossible de supprimer un CV déja soumis dans une offre'}>
                        <i className="fa fa-trash"
                           style={resumes[i].applications.length === 0 ? {color: "red"} : {
                               color: "grey",
                               cursor: "not-allowed"
                           }}/>
                    </button>
                </div>
                <button
                    type={"button"}
                    className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                    autoFocus={i === 0}
                    onClick={() => {
                        setCurrentIndex(i)
                        setCurrent(i)
                    }}>
                    <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                        {resumes[i].name + " "}
                    </Typography>
                </button>
                <Typography
                    variant={"body2"}>
                    État : {getResumeState(resumes[i])}
                </Typography>
                <hr/>
            </div>}
        </PdfSelectionViewer>
    </div>
}
