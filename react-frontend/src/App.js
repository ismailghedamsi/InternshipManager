import React from "react";
import Login from './Components/Login';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import RegisteringManager from "./Components/RegisteringManager";
import Welcome from "./Components/Welcome";

function App() {
    return (
        <div className="App">
            <div className="page-container">
                <div className="page-nav">
                    <Router>
                        <Switch>
                            <Route exact path="/" component={Login}/>
                            <Route path="/register" component={RegisteringManager}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/welcome" component={Welcome}/>
                        </Switch>
                    </Router>
                </div>
            </div>
        </div>
    );
}

export default App;
