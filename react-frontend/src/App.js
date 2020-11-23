import React, {useEffect, useState} from "react";
import axios from 'axios';
import Login from './Components/Login';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import RegisteringManager from "./Components/RegisteringManager";
import Dashboard from "./Components/Dashboard";
import {BasicProtectedRoute} from "./Components/Utils/Services/Routes";
import CssBaseline from "@material-ui/core/CssBaseline";
import {pdfjs} from "react-pdf";
import PasswordChange from "./Components/PasswordChange";
import ErrorModal from "./Components/Utils/Modal/ErrorModal";
import {useModal} from "./Components/Utils/Services/Hooks";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export const ModalContext = React.createContext(null)
export const SemesterContext = React.createContext(null)

function App() {
    const [isErrorModalOpen, openErrorModal, closeErrorModal] = useModal();
    const [semester, setSemester] = useState(undefined)

    useEffect(() => {
        axios.get("http://localhost:8080/api/semesters/present")
            .then(r => setSemester(r ? r.data : ''));
    }, [])

    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ModalContext.Provider value={{open: openErrorModal}}>
            <SemesterContext.Provider value={{semester, setSemester}}>
                <div className="App">
                    <CssBaseline/>
                    <Router>
                        <Switch>
                            <Route exact path="/" component={Login}/>
                            <Route exact path="/register" component={RegisteringManager}/>
                            <Route exact path="/passwordChange" component={PasswordChange}/>
                            <BasicProtectedRoute exact={false} path="/dashboard" component={Dashboard}/>
                        </Switch>
                    </Router>
                    <ErrorModal isOpen={isErrorModalOpen} hide={closeErrorModal}/>
                </div>
            </SemesterContext.Provider>
        </ModalContext.Provider>
    </MuiPickersUtilsProvider>;
}

export default App;
