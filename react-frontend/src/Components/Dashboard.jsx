import {Container} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import AuthenticationService from '../Services/AuthenticationService';
import ApplicationList from "./Employer/ApplicationList";
import InterviewConvocation from './Employer/Interview/InterviewConvocation';
import Interviewlist from './Employer/Interview/InterviewList';
import {Rescheduleinterview} from './Employer/Interview/RescheduleInterview';
import OfferCreation from "./Employer/OfferCreation";
import OfferList from "./Employer/OfferList";
import SignContract from './Employer/SignContract'
import ContractForm from "./Manager/ContractForm";
import ContractList from './Manager/ContractList';
import Employerstatus from './Manager/EmployerStatus';
import OfferApprobation from "./Manager/OfferApprobation";
import OfferAssignements from "./Manager/OfferAssignements";
import Reports from "./Manager/Reports";
import ResumeApprobation from "./Manager/ResumeApprobation";
import SemesterSelector from "./Manager/SemesterSelector";
import StudentStatus from "./Manager/StudentStatus";
import SignForm from "./Employer/SignForm";
import OfferApplication from "./Student/OfferApplication";
import ResumeList from "./Student/ResumeList";
import ResumeUpload from "./Student/Upload/ResumeUpload";
import Footer from "./Utils/Footer";
import Navbar from "./Utils/Navbar";
import {RoleProtectedRoute} from "./Utils/Routes";


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

export default function Dashboard() {
    const classes = useStyles();

    return <div className={classes.root}>
        <Navbar/>
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
                                    path="/dashboard/assignement/offer"
                                    component={OfferAssignements}
                                    role={"admin"}/>
                <RoleProtectedRoute exact={true}
                                    path="/dashboard/status"
                                    component={StudentStatus}
                                    role={"admin"}/>
                <RoleProtectedRoute exact={true}
                                    path="/dashboard/OfferList"
                                    component={OfferList}
                                    role={"admin"}/>
                <RoleProtectedRoute exact={true}
                                    path="/dashboard/applicationsAdmin"
                                    component={ApplicationList}
                                    role={"admin"}/>
                <RoleProtectedRoute exact={true}
                                    path="/dashboard/employersStatus"
                                    component={Employerstatus}
                                    role={"admin"}/>
                <RoleProtectedRoute exact={true}
                                    path={"/dashboard/setSemester"}
                                    component={SemesterSelector}
                                    role={"admin"}/>
                <RoleProtectedRoute exact={true}
                                    path="/dashboard/contractList"
                                    component={ContractList}
                                    role={"admin"}/>
                <RoleProtectedRoute exact={true}
                                    path="/dashboard/reports"
                                    component={Reports}
                                    role={"admin"}/>
                <RoleProtectedRoute exact={true}
                                    path="/dashboard/contractForm"
                                    component={ContractForm}
                                    role={"admin"}/>
                <RoleProtectedRoute exact={true}
                                    path="/dashboard/signFormAdmin"
                                    component={SignForm}
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
                <RoleProtectedRoute exact={true}
                                    path="/dashboard/interviewConvocation"
                                        component={InterviewConvocation}
                                        role={"employer"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/listInterview"
                                        component={Interviewlist}
                                        role={"employer"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/rescheduleInterview"
                                        component={Rescheduleinterview}
                                        role={"employer"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/signContract"
                                        component={SignContract}
                                        role={"employer"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/signFormEmployer"
                                        component={SignForm}
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
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/signContractStudent"
                                        component={SignContract}
                                        role={"student"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/signFormStudent"
                                        component={SignForm}
                                        role={"student"}/>
                </Switch>
            </Container>
            <Footer/>
        </div>
}
