import {useHistory} from 'react-router-dom';
import {useApi} from "./Services/Hooks";

export function useStudentEvaluation() {
    const api = useApi()
    const history = useHistory()

    function evaluate(endPoint, dto, redirectionRoute) {
        return api.post(endPoint, dto)
                .then(() => history.push(redirectionRoute))
    }

    return {evaluate}
}
