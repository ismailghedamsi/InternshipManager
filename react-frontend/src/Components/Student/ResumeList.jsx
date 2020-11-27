import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import AuthenticationService from "../../Services/AuthenticationService";
import {useApi} from "../../Services/Hooks";
import PdfSelectionViewer from "../Utils/PDF/PdfSelectionViewer";
import {Button} from "@material-ui/core";

export default function ResumeList({count, deniedCount}) {
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
                <Button
                    variant={i === currentIndex ? "contained" : "outlined"}
                    color={"primary"}
                    style={{marginBottom: 10}}
                    onClick={() => {
                        setCurrentIndex(i)
                        setCurrent(i)
                    }}>
                    <Typography variant={"body1"}
                                style={{padding: "0 2em 0 2em"}}
                                display={"block"}>
                        {resumes[i].name + " "}
                    </Typography>
                </Button>
                <Typography
                    variant={"body2"}>
                    État : {getResumeState(resumes[i])}
                    &emsp;
                    {i === currentIndex &&
                    <Button
                        variant={"contained"}
                        color={"secondary"}
                        size={"small"}
                        onClick={() => deleteResume(i)}
                        disabled={resumes[i].applications.length !== 0}
                        title={resumes[i].applications.length === 0 ? '' : 'Impossible de supprimer un CV déja utilisé pour appliquer sur une offre'}>
                        <i className="fa fa-trash"/>&ensp;Supprimer
                    </Button>}
                </Typography>
                <hr/>
            </div>}
        </PdfSelectionViewer>
    </div>
}
