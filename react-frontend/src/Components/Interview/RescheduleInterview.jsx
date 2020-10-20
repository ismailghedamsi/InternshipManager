import React, {useEffect} from 'react'
import InterviewForm from './InterviewForm'
import {useLocation} from 'react-router-dom'

export function Rescheduleinterview(props) {
    const location = useLocation();
    useEffect(() => {
        console.log(location.state)
        //api.get("/applications").then((r) => setApplications(r.data))
    }, [])

    function updateInterview() {

    }

    return (
        <>
            <InterviewForm onSubmitInterviewUpdate={updateInterview}/>
        </>
    )
}
