import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Redirect, Route, Switch} from 'react-router-dom';
import {RoleProtectedRoute} from "./Utils/Routes";
import Navbar from "./Utils/Header/Navbar";
import Footer from "./Utils/Footer";
import AuthenticationService from '../Services/AuthenticationService';
import ResumeApprobation from "./Manager/ResumeApprobation";
import OfferApprobation from "./Manager/OfferApprobation";
import OfferAssignements from "./Manager/OfferAssignements";
import OfferCreation from "./Employer/OfferCreation";
import OfferList from "./Employer/OfferList";
import ApplicationList from "./Employer/ApplicationList";
import ResumeUpload from "./Student/Upload/ResumeUpload";
import ResumeList from "./Student/ResumeList";
import OfferApplication from "./Student/OfferApplication";
import {Container} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    },
    container: {
        flex: 1,
        height: "90vh",
        overflow: "hidden"
    }
}));

export default function Dashboard(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Navbar {...props}/>
            <Container className={classes.container}>
                <Switch>
                    <Route exact={true} path={"/dashboard"}>
                        <Redirect to={function () {
                            if (AuthenticationService.getCurrentUserRole() === "student")
                                return "/dashboard/stagelist"
                            else if (AuthenticationService.getCurrentUserRole() === "employer")
                                return "/dashboard/listoffer"
                            else
                                return "/dashboard/approbation/offres"
                        }()}/>
                    </Route>
                    {/* Admin */}
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/approbation/cv"
                                        component={ResumeApprobation}
                                        role={"admin"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/approbation/offres"
                                        component={OfferApprobation}
                                        role={"admin"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/assignement/cv"
                                        component={OfferAssignements}
                                        role={"admin"}/>
                    {/* Employeur */}
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/createstage"
                                        component={OfferCreation}
                                        role={"employer"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/listoffer"
                                        component={OfferList}
                                        role={"employer"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/applications"
                                        component={ApplicationList}
                                        role={"employer"}/>
                    {/* Etudiant */}
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/upload"
                                        component={ResumeUpload}
                                        role={"student"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/listcv"
                                        component={ResumeList}
                                        role={"student"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/stagelist"
                                        component={OfferApplication}
                                        role={"student"}/>
                </Switch>
            </Container>
            <Footer/>
        </div>
    );
}
