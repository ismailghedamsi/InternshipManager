import React from "react";
import Login from './Components/Login';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import RegisteringManager from "./Components/RegisteringManager";
import Dashboard from "./Components/Dashboard";
import AuthenticationService from "./js/AuthenticationService";

function ConditionalRoute(props) {
    if (props.condition)
        return <props.component/>
    else
        return <Redirect to={"/"}/>
}

function BasicProtectedRoute(props) {
    return <ConditionalRoute component={props.component} condition={AuthenticationService.isUserLoggedIn()}/>
}

/*function RoleProtectedRoute(props) {
    return <ConditionalRoute
        component={props.component}
        condition={AuthenticationService.getCurrentUserRole() === props.requiredRole}
    />
}*/

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/register" component={RegisteringManager}/>
                    <BasicProtectedRoute path="/dashboard" component={Dashboard}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
