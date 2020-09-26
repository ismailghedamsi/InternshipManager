import React from "react";
import Login from './Components/Login';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import RegisteringManager from "./Components/RegisteringManager";
import Welcome from "./Components/Welcome";
import OffreStage from "./Components/OffreStage/OffreStage";
import CreateStage from "./Components/OffreStage/CreateStage";

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/register" component={RegisteringManager}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/welcome" component={Welcome}/>
                    <Route path="/OffreStage" component={OffreStage}/>
                    <Route path="/CreateStage" component={CreateStage}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
