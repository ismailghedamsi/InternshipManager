import DateFnsUtils from "@date-io/date-fns";
import CssBaseline from "@material-ui/core/CssBaseline";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {pdfjs} from "react-pdf";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import PasswordChange from "./Components/PasswordChange";
import RegisteringManager from "./Components/RegisteringManager";
import ErrorModal from "./Components/Utils/Modal/ErrorModal";
import {useModal} from "./Services/Hooks";
import {BasicProtectedRoute} from "./Services/Routes";

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
