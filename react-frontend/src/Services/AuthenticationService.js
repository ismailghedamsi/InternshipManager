import axios from 'axios'

class AuthenticationService {
    interceptorId = 0;
    baseUrl = "http://localhost:8080/api";

    constructor() {
        if (this.isUserLoggedIn()) {
            const user = this.getCurrentUser().username;
            const pass = this.getCurrentUser().password;
            this.setupAxiosInterceptors(user, pass);
        }
    }


    async authenticate(values) {
        this.logout()
        return axios({
            method: "GET",
            url: this.baseUrl + "/auth/user",
            headers: {
                authorization: "Basic " + btoa(values.username + ":" + values.password)
            }
        }).then((response) => {
            let user = response.data
            user.password = values.password
            this.setupAxiosInterceptors(values.username, values.password)
            this.saveValueToSession("authenticatedUser", JSON.stringify(user))
        })
    }

    async registerUser(endpoint, values, setFieldError, setModalOpen, history) {
        let dto = {...values};
        delete dto.passwordConfirm;
        return axios.post(this.baseUrl + endpoint, dto)
            .then(() => {
                history.push("/")
            })
            .catch((error) => {
                console.error(error)
                if (error.response) {
                    if (error.response.status === 409) {
                        setFieldError("username", "Le nom d'utilisateur n'est pas disponible")
                    } else
                        setModalOpen(true)
                } else {
                    setModalOpen(true)
                }
            })
    }

    setupAxiosInterceptors(username, password) {

        let basicAuthHeader = 'Basic ' + btoa(username + ":" + password)
        this.interceptorId = axios.interceptors.request.use(
            (config) => {
                config.headers.authorization = basicAuthHeader
                return config
            }
        )
    }

    isUserLoggedIn() {
        return sessionStorage.getItem("authenticatedUser") != null
    }

    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem("authenticatedUser"));
    }


    getCurrentUserRole() {
        return this.getCurrentUser().role;
    }

    getValueFromSession(key) {
        return sessionStorage.getItem(key)
    }

    logout() {
        sessionStorage.removeItem("authenticatedUser")
        axios.interceptors.request.eject(this.interceptorId)
    }

    saveValueToSession(key, value) {
        sessionStorage.setItem(key, value)
    }


}

export default new AuthenticationService()