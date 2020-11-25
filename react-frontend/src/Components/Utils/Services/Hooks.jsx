import axios from "axios";
import {useContext, useState} from "react";
import {ModalContext, SemesterContext} from "../../../App";
import AuthenticationService from "../../../Services/AuthenticationService";

export function useModal() {
    const [isOpen, setOpen] = useState(false)

    function open() {
        setOpen(true)
    }

    function close() {
        setOpen(false)
    }

    return [isOpen, open, close]
}

export function useApi() {
    const {open} = useContext(ModalContext)
    const {semester} = useContext(SemesterContext)
    const user = AuthenticationService.getCurrentUser()
    const api = axios.create({
        baseURL: "http://localhost:8080/api/",
        timeout: 15000,
        headers: {
            authorization: "Basic " + btoa(user.email + ":" + user.password)
        }
    })
    api.interceptors.request.use(config => {
        if (semester)
            config.headers = {"X-Semester": semester, ...config.headers}

        return config
    })
    api.interceptors.response.use(response => response, error => {
        console.warn("Axios error: " + error)
        open()
    })

    return api
}

export function useDateParser() {
    return date => {
        const m = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
        const d = new Date(date)
        return d.getDate() + " " + m[d.getMonth()] + " " + d.getFullYear()
    }
}

export function useTimeParserFromDate() {
    return date => {
        return new Date(date).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
    }
}

export function useTimeFormatter() {
    return time => time.split(":")[0] + ":" + time.split(":")[1]
}

export function useFileReader() {
    return file => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }
}