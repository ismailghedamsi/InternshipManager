import {Divider, Grid, Typography} from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import {makeStyles} from "@material-ui/core/styles";
import NotificationImportantOutlinedIcon from "@material-ui/icons/NotificationImportantOutlined";
import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import AuthenticationService from "../Services/AuthenticationService";
import Interviewlist from "./Employer/Interview/InterviewList"
import OfferApprobation from "./Manager/OfferApprobation";
import PendingContracts from "./Manager/PendingContracts";
import ResumeApprobation from "./Manager/ResumeApprobation";
import OfferApplication from "./Student/OfferApplication";
import ResumeList from "./Student/ResumeList";
import OfferList from "./Utils/OfferList";
import SignContract from "./Utils/SignContract";
import useStyles from "./Utils/Style/useStyles";
import TabPanel from "./Utils/TabPanel";

function useSpecificStyles() {
    return makeStyles(theme => ({
        dashboardList: {
            backgroundColor: theme.palette.background.paper,
            padding: 0
        }
    }))()
}

function TabButton({value, index, onClick, children}) {
    const classes = useStyles()
    const activeClasses = [classes.dashboardTab, index === value && classes.selectedDashboardTab].join(" ")
    return <Typography
        variant={"h6"}
        onClick={() => onClick(index)}
        className={activeClasses}
    >
        {children}
    </Typography>
}

function AdminDashboard() {
    const classes = useStyles()
    const specificClasses = useSpecificStyles()
    const [currentTab, setCurrentTab] = useState(0)
    const [cvCount, setCvCount] = useState(0)
    const [offerCount, setOfferCount] = useState(0)
    const [contractCount, setContractCount] = useState(0)

    return <>
        <Grid item xs={2} className={[classes.list, specificClasses.dashboardList].join(" ")}>
            <TabButton value={currentTab} index={0} onClick={setCurrentTab}>
                {cvCount !== 0 &&
                <Badge badgeContent={cvCount} color="secondary" anchorOrigin={{vertical: "top", horizontal: "left"}}>
                    <NotificationImportantOutlinedIcon/>
                </Badge>}
                CVs en attente
                <Typography variant={"body2"}>
                    {cvCount} documents
                </Typography>
            </TabButton>
            <Divider/>
            <TabButton value={currentTab} index={1} onClick={setCurrentTab}>
                {offerCount !== 0 &&
                <Badge badgeContent={offerCount} color="secondary" anchorOrigin={{vertical: "top", horizontal: "left"}}>
                    <NotificationImportantOutlinedIcon/>
                </Badge>}
                Offres en attente
                <Typography variant={"body2"}>
                    {offerCount} documents
                </Typography>
            </TabButton>
            <Divider/>
            <TabButton value={currentTab} index={2} onClick={setCurrentTab}>
                {contractCount !== 0 && <Badge badgeContent={contractCount} color="secondary"
                                               anchorOrigin={{vertical: "top", horizontal: "left"}}>
                    <NotificationImportantOutlinedIcon/>
                </Badge>}
                Contrats en attente
                <Typography variant={"body2"}>
                    {contractCount} documents
                </Typography>
            </TabButton>
            <Divider/>
        </Grid>
        <Divider orientation={"vertical"} flexItem/>
        <Grid item xs={10}>
            <TabPanel value={currentTab} index={0}>
                <ResumeApprobation count={setCvCount}/>
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <OfferApprobation count={setOfferCount}/>
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
                <PendingContracts count={setContractCount}/>
            </TabPanel>
        </Grid>
    </>
}

function StudentDashboard() {
    const classes = useStyles()
    const specificClasses = useSpecificStyles()
    const [currentTab, setCurrentTab] = useState(0)
    const [cvCount, setCvCount] = useState(0)
    const [deniedCvCount, setDeniedCvCount] = useState(0)
    const [offerCount, setOfferCount] = useState(0)
    const [offerPendingCount, setOfferPendingCount] = useState(0)
    const [contractCount, setContractCount] = useState(0)
    const [contractWaitingCount, setContractWaitingCount] = useState(0)
    return <>
        <Grid item xs={2} className={[classes.list, specificClasses.dashboardList].join(" ")}>
            <TabButton value={currentTab} index={0} onClick={setCurrentTab}>
                {offerCount + offerPendingCount !== 0 &&
                <Badge badgeContent={offerCount + offerPendingCount} color="secondary"
                       anchorOrigin={{vertical: "top", horizontal: "left"}}>
                    <NotificationImportantOutlinedIcon/>
                </Badge>}
                Offres de stage
                <Typography variant={"body2"}>
                    {offerCount} offres sur lesquelles vous n'avez&nbsp;pas appliqué
                </Typography>
                <Typography variant={"body2"}>
                    {offerPendingCount} offres en attente de&nbsp;votre réponse
                </Typography>
            </TabButton>
            <Divider/>
            <TabButton value={currentTab} index={1} onClick={setCurrentTab}>
                {deniedCvCount !== 0 &&
                <Badge badgeContent={deniedCvCount} color="secondary"
                       anchorOrigin={{vertical: "top", horizontal: "left"}}>
                    <NotificationImportantOutlinedIcon/>
                </Badge>}
                Mes CVs
                <Typography variant={"body2"}>
                    {cvCount} documents
                </Typography>
                <Typography variant={"body2"}>
                    {deniedCvCount} documents nécessitant votre attention
                </Typography>
            </TabButton>
            <Divider/>
            <TabButton value={currentTab} index={2} onClick={setCurrentTab}>
                {contractWaitingCount !== 0 &&
                <Badge badgeContent={contractWaitingCount} color="secondary"
                       anchorOrigin={{vertical: "top", horizontal: "left"}}>
                    <NotificationImportantOutlinedIcon/>
                </Badge>}
                Mes contrats
                <Typography variant={"body2"}>
                    {contractCount} documents
                </Typography>
                <Typography variant={"body2"}>
                    {contractWaitingCount} documents nécessitant votre attention
                </Typography>
            </TabButton>
            <Divider/>
        </Grid>
        <Divider orientation={"vertical"} flexItem/>
        <Grid item xs={10}>
            <TabPanel value={currentTab} index={0}>
                <OfferApplication count={setOfferCount} pendingCount={setOfferPendingCount}/>
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <ResumeList count={setCvCount} deniedCount={setDeniedCvCount}/>
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
                <SignContract count={setContractCount} waitingCount={setContractWaitingCount}/>
            </TabPanel>
        </Grid>
    </>
}

function EmployerDashboard() {
    const classes = useStyles()
    const specificClasses = useSpecificStyles()
    const location = useLocation()
    const [currentTab, setCurrentTab] = useState(location.state ? (location.state.tab ? location.state.tab : 0) : 0)
    const [offerCount, setOfferCount] = useState(0)
    const [contractCount, setContractCount] = useState(0)
    const [contractWaitingCount, setContractWaitingCount] = useState(0)
    const [interviewCount, setInterviewCount] = useState(0)
    const [interviewWaitingCount, setInterviewWaitingCount] = useState(0)

    return <>
        <Grid item xs={2} className={[classes.list, specificClasses.dashboardList].join(" ")}>
            <TabButton value={currentTab} index={0} onClick={setCurrentTab}>
                Mes offres de stage
                <Typography variant={"body2"}>
                    {offerCount} document{offerCount !== 1 && "s"}
                </Typography>
            </TabButton>
            <Divider/>
            <TabButton value={currentTab} index={1} onClick={setCurrentTab}>
                {interviewWaitingCount !== 0 &&
                <Badge badgeContent={interviewWaitingCount} color="secondary"
                       anchorOrigin={{vertical: "top", horizontal: "left"}}>
                    <NotificationImportantOutlinedIcon/>
                </Badge>}
                Mes entrevues
                <Typography variant={"body2"}>
                    {interviewCount} évènement{interviewCount !== 1 && "s"}
                </Typography>
                <Typography variant={"body2"}>
                    {interviewWaitingCount} évènement{interviewWaitingCount !== 1 && "s"} nécessitant votre attention
                </Typography>
            </TabButton>
            <Divider/>
            <TabButton value={currentTab} index={2} onClick={setCurrentTab}>
                {contractWaitingCount !== 0 &&
                <Badge badgeContent={contractWaitingCount} color="secondary"
                       anchorOrigin={{vertical: "top", horizontal: "left"}}>
                    <NotificationImportantOutlinedIcon/>
                </Badge>}
                Mes contrats
                <Typography variant={"body2"}>
                    {contractCount} document{contractCount !== 1 && "s"}
                </Typography>
                <Typography variant={"body2"}>
                    {contractWaitingCount} document{contractCount !== 1 && "s"} nécessitant votre attention
                </Typography>
            </TabButton>
            <Divider/>
        </Grid>
        <Divider orientation={"vertical"} flexItem/>
        <Grid item xs={10}>
            <TabPanel value={currentTab} index={0}>
                <OfferList count={setOfferCount}/>
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <Interviewlist count={setInterviewCount} waitingCount={setInterviewWaitingCount}/>
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
                <SignContract count={setContractCount} waitingCount={setContractWaitingCount}/>
            </TabPanel>
        </Grid>
    </>
}

export default function Dashboard() {
    const classes = useStyles()
    return <Grid container wrap={"nowrap"} spacing={0} className={classes.main}>
        {function () {
            switch (AuthenticationService.getCurrentUserRole()) {
                case "student":
                    return <StudentDashboard/>
                case "employer":
                    return <EmployerDashboard/>
                default:
                    return <AdminDashboard/>
            }
        }()}
    </Grid>
}