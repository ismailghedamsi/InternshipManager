import React from "react";
import Login from './Components/Login';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import RegisteringManager from "./Components/RegisteringManager";
import Dashboard from "./Components/Dashboard";
import {BasicProtectedRoute} from "./Components/Routes";

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/register" component={RegisteringManager}/>
                    <BasicProtectedRoute exact={false} path="/dashboard" component={Dashboard}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
