import {Redirect} from "react-router-dom";
import AuthenticationService from "../../js/AuthenticationService";
import React from "react";

export function ConditionalRoute(props) {
    if (props.condition)
        return <props.component/>
    else
        return <Redirect to={"/"}/>
}

export function BasicProtectedRoute(props) {
    return <ConditionalRoute component={props.component} condition={AuthenticationService.isUserLoggedIn()}/>
}

export function RoleProtectedRoute(props) {
    return <ConditionalRoute
        component={props.component}
        condition={AuthenticationService.getCurrentUserRole() === props.role}
    />
}