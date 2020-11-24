import axios from "axios"
import {useContext, useState} from "react"
import {useHistory} from 'react-router-dom';
import {ModalContext, SemesterContext} from "../../App"
import AuthenticationService from "../../Services/AuthenticationService"

export function useModal() {
    const [isOpen, setOpen] = useState(false)

    function open() {
        setOpen(true)
    }

    function close() {
        setOpen(false)
    }

    return [isOpen, open, close];
}

export function useApi() {
    const {open} = useContext(ModalContext);
    const {semester} = useContext(SemesterContext);
    const user = AuthenticationService.getCurrentUser();
    const api = axios.create({
        baseURL: "http://localhost:8080/api/",
        timeout: 15000,
        headers: {
            authorization: "Basic " + btoa(user.username + ":" + user.password)
        }
    });
    api.interceptors.request.use(config => {
        if (semester)
            config.headers = {"X-Semester": semester, ...config.headers};

        return config;
    });
    api.interceptors.response.use(response => response, error => {
        console.warn("Axios error: " + error);
        open();
    });

    return api;
}

export function useStudentEvaluation() {
    const api = useApi()
    const history = useHistory()

    function evaluate(endPoint, dto, redirectionRoute) {
        return api.post(endPoint, dto)
                .then(() => history.push(redirectionRoute))
    }

    return {evaluate}
}
