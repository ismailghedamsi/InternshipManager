import axios from 'axios'
class AuthenticationRegistrationService{
    setupAxiosInterceptors(username,password){

        let basicAuthHeader = 'Basic ' + window.btoa(username + ":" + password)
           axios.interceptors.request.use(
               (config) => {
                   config.headers.authorization = basicAuthHeader
               }
           )
     }
}

export default new AuthenticationRegistrationService()