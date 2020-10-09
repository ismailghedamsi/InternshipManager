import React from 'react';
import Navbar from "./Header/Navbar";
import Footer from "./Footer";
import {makeStyles} from "@material-ui/core/styles";
import {RoleProtectedRoute} from "./Routes";
import OfferApprobation from "./Manager/OfferApprobation";
import {Redirect, Route, Switch} from 'react-router-dom';
import UploadCV from "./Upload/UploadCV";
import ListCV from "./ListCV";
import CreateStage from "./OffreStage/CreateStage";
import ListOffer from "./OffreStage/ListOffer";
import ResumeApprobation from "./Manager/ResumeApprobation";
import OfferAssignements from "./Manager/OfferAssignements";
import ApplyStage from "./ApplyStage";
import ApplicationList from "./ApplicationList";
import AuthenticationService from '../js/AuthenticationService';
import Interview from "./Interview";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    },
    container: {
        flex: 1
    }
}));

export default function Dashboard(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Navbar {...props}/>
            <div className={classes.container}>
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
                                        component={CreateStage}
                                        role={"employer"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/listoffer"
                                        component={ListOffer}
                                        role={"employer"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/applications"
                                        component={ApplicationList}
                                        role={"employer"}/>
                    {/* Etudiant */}
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/upload"
                                        component={UploadCV}
                                        role={"student"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/listcv"
                                        component={ListCV}
                                        role={"student"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/stagelist"
                                        component={ApplyStage}
                                        role={"student"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/entrevue"
                                        component={Interview}
                                        role={"student"}/>
                </Switch>
            </div>
            <Footer/>
        </div>
    );
}
