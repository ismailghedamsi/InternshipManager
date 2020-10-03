import axios from 'axios'
import AuthenticationService from './AuthenticationService';

class IntershipOfferService {
    interceptorId = 0;
    baseUrl = "http://localhost:8080";

    constructor() {
    }

    async sendOfferToBackEnd(values) {

        return this.readFileAsync(values.file).then(function (base64file) {

            let dto = {...values};

            dto.joinedFile = base64file;
            dto.employer = AuthenticationService.getCurrentUser();

            return axios.post("http://localhost:8080/offers", dto)
        })
    }


    async readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = reject;

            reader.readAsDataURL(file);
        })


    }

}

export default new IntershipOfferService()