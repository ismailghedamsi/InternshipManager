import {useContext, useState} from "react";
import axios from "axios";
import AuthenticationService from "../../Services/AuthenticationService";
import {ModalContext} from "../../App";

export function useModal() {
    const [isOpen, setOpen] = useState(false);

    function open() {
        setOpen(true);
    }

    function close() {
        setOpen(false);
    }

    return [isOpen, open, close];
}

export function useApi() {
    const {open} = useContext(ModalContext);
    const user = AuthenticationService.getCurrentUser();
    const api = axios.create({
        baseURL: "http://localhost:8080/api/",
        timeout: 1000,
        headers: {
            authorization: "Basic " + btoa(user.username + ":" + user.password)
        }
    });
    api.interceptors.response.use(response => response, error => {
        console.warn("Axios error: " + error);
        open();
    });

    return api;
}