import {Divider, Grid, Typography} from "@material-ui/core"
import Badge from "@material-ui/core/Badge"
import NotificationImportantOutlinedIcon from "@material-ui/icons/NotificationImportantOutlined"
import React, {useState} from "react"
import ContractList from "./Manager/ContractList"
import OfferApprobation from "./Manager/OfferApprobation"
import ResumeApprobation from "./Manager/ResumeApprobation"
import TabPanel from "./Utils/TabPanel"
import useStyles from "./Utils/useStyles"

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

export default function Dashboard() {
    const classes = useStyles()
    const [currentTab, setCurrentTab] = useState(0)
    const [cvCount, setCvCount] = useState(0)
    const [offerCount, setOfferCount] = useState(0)
    const [contractCount, setContractCount] = useState(0)

    return <Grid container wrap={"nowrap"} spacing={0} className={classes.main}>
        <Grid item xs={2} className={classes.list} style={{padding: 0, backgroundColor: "#DDD"}}>
            <TabButton value={currentTab} index={0} onClick={setCurrentTab}>
                {cvCount !== 0 &&
                <Badge badgeContent={cvCount} color="primary" anchorOrigin={{vertical: "top", horizontal: "left"}}>
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
                <Badge badgeContent={offerCount} color="primary" anchorOrigin={{vertical: "top", horizontal: "left"}}>
                    <NotificationImportantOutlinedIcon/>
                </Badge>}
                Offres en attente
                <Typography variant={"body2"}>
                    {offerCount} documents
                </Typography>
            </TabButton>
            <Divider/>
            <TabButton value={currentTab} index={2} onClick={setCurrentTab}>
                {contractCount !== 0 && <Badge badgeContent={contractCount} color="primary"
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
                <ContractList count={setContractCount}/>
            </TabPanel>
        </Grid>
    </Grid>
}