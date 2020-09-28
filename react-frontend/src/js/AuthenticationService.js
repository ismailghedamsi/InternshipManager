import axios from 'axios'

class AuthenticationService {
    interceptorId = 0;
    baseUrl = "http://localhost:8080";

    async authenticate(values) {
        this.logout()
        return axios({
            method: "GET",
            url: this.baseUrl + "/auth/user",
            headers: {
                authorization: "Basic " + window.btoa(values.username + ":" + values.password)
            }
        }).then((response) => {
            let user = response.data
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

        let basicAuthHeader = 'Basic ' + window.btoa(username + ":" + password)
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

    getCurrentUserRole() {
        return JSON.parse(sessionStorage.getItem("authenticatedUser")).role;
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