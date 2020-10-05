import React from 'react';
import Navbar from "./Header/Navbar";
import Footer from "./Footer";
import {makeStyles} from "@material-ui/core/styles";
import {RoleProtectedRoute} from "./Routes";
import {Route, Switch} from 'react-router-dom';
import UploadCV from "./Upload/UploadCV";
import ListCV from "./ListCV";
import CreateStage from "./OffreStage/CreateStage";
import ListOffer from "./OffreStage/ListOffer";
import ResumeApprobation from "./Manager/ResumeApprobation";
import OfferAssignements from "./Manager/OfferAssignements";
import ApplyStage from "./ApplyStage";

const useStyles = makeStyles((theme) => ({
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
                        <h1>Welcome</h1>
                    </Route>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/approbation/cv"
                                        component={ResumeApprobation}
                                        role={"admin"}/>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/assignement/cv"
                                        component={OfferAssignements}
                                        role={"admin"}/>
                    <Route exact={true} path="/dashboard/upload" component={UploadCV}/>
                    <Route exact={true} path="/dashboard/listcv" component={ListCV}/>
                    <Route exact={true} path="/dashboard/createstage" component={CreateStage}/>
                    <Route exact={true} path="/dashboard/listoffer" component={ListOffer}/>
                    <Route exact={true} path="/dashboard/stagelist" component={ApplyStage}/>
                </Switch>
            </div>
            <Footer/>
        </div>
    );
}
