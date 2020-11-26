import {Container} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import React from "react"
import {Route, Switch} from "react-router-dom"
import Dashboard from "./Dashboard"
import StudentEvaluationForm from "./Employer/Evaluations/StudentEvaluationForm";
import StudentEvaluationsList from "./Employer/Evaluations/StudentEvaluationsList"
import HiredStudentList from "./Employer/HiredStudentList";
import InterviewConvocation from "./Employer/Interview/InterviewConvocation"
import Interviewlist from "./Employer/Interview/InterviewList"
import {Rescheduleinterview} from "./Employer/Interview/RescheduleInterview"
import OfferCreation from "./Employer/OfferCreation"
import BusinessEvaluationForm from "./Manager/BusinessEvaluations/BusinessEvaluationForm"
import BusinessEvaluationList from "./Manager/BusinessEvaluations/BusinessEvaluationList"
import ContractForm from "./Manager/ContractForm"
import ContractList from "./Manager/ContractList"
import Employerstatus from "./Manager/EmployerStatus"
import Managers from "./Manager/Managers"
import OfferAssignements from "./Manager/OfferAssignements"
import Reports from "./Manager/Reports"
import SemesterSelector from "./Manager/SemesterSelector"
import StudentStatus from "./Manager/StudentStatus"
import ResumeUpload from "./Student/Upload/ResumeUpload"
import ApplicationList from "./Utils/ApplicationList"
import Footer from "./Utils/Navb-Foot/Footer"
import Navbar from "./Utils/Navb-Foot/Navbar"
import OfferList from "./Utils/OfferList"
import {RoleProtectedRoute} from "./Utils/Services/Routes"
import SignForm from "./Utils/SignForm"

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
    },
    container: {
        flex: 1,
        height: "89vh",
        padding: 0,
        overflow: "hidden"
    }
}))

export default function RouteSelector() {
    const classes = useStyles()

    return <div className={classes.root}>
        <Navbar/>
        <Container maxWidth={"xl"} className={classes.container}>
            <Switch>
                <Route
                    exact={true}
                    path={"/dashboard"}
                    component={Dashboard}
                />
                {/* Admin */}
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/assignement/offer"
                    component={OfferAssignements}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/status"
                    component={StudentStatus}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/OfferList"
                    component={OfferList}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/applicationsAdmin"
                    component={ApplicationList}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/employersStatus"
                    component={Employerstatus}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path={"/dashboard/setSemester"}
                    component={SemesterSelector}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/reports"
                    component={Reports}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/contractForm"
                    component={ContractForm}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/signFormAdmin"
                    component={SignForm}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/businessEvaluation"
                    component={BusinessEvaluationForm}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/businessEvaluationList"
                    component={BusinessEvaluationList}
                    role={"admin"}
                />
                <RoleProtectedRoute
                        exact={true}
                        path="/dashboard/studentEvaluationListAdmin"
                        component={StudentEvaluationsList}
                        role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/managers"
                    component={Managers}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/contractList"
                    component={ContractList}
                    role={"admin"}
                />
                {/* Employeur */}
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/createstage"
                    component={OfferCreation}
                    role={"employer"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/applications"
                    component={ApplicationList}
                    role={"employer"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/interviewConvocation"
                    component={InterviewConvocation}
                    role={"employer"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/listInterview"
                    component={Interviewlist}
                    role={"employer"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/rescheduleInterview"
                    component={Rescheduleinterview}
                    role={"employer"}
                />
                <RoleProtectedRoute
                        exact={true}
                        path="/dashboard/evaluateStudent"
                        component={StudentEvaluationForm}
                        role={"employer"}
                />
                <RoleProtectedRoute
                        exact={true}
                        path="/dashboard/signFormEmployer"
                        component={SignForm}
                        role={"employer"}
                />
                <RoleProtectedRoute
                        exact={true}
                        path="/dashboard/studentEvaluationList"
                        component={StudentEvaluationsList}
                        role={"employer"}
                />
                <RoleProtectedRoute
                        exact={true}
                        path="/dashboard/hiredStudentList"
                        component={HiredStudentList}
                        role={"employer"}
                />
                {/* Etudiant */}
                <RoleProtectedRoute
                        exact={true}
                        path="/dashboard/upload"
                        component={ResumeUpload}
                        role={"student"}
                />
                <RoleProtectedRoute
                        exact={true}
                        path="/dashboard/signFormStudent"
                        component={SignForm}
                        role={"student"}
                />
            </Switch>
        </Container>
        <Footer/>
    </div>
}