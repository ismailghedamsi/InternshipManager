import React from 'react';
import Navbar from "./Header/Navbar";
import Footer from "./Footer";
import {makeStyles} from "@material-ui/core/styles";
import {RoleProtectedRoute} from "./Routes";
import ResumeApprobation from "./ResumeApprobation";
import {Route, Switch} from 'react-router-dom';
import UploadCV from "./Upload/UploadCV";

const useStyles = makeStyles((theme) => ({
    pageContainer: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    },
    pageContent: {
        flex: 1,
    }
}));

export default function Dashboard(props) {
    const classes = useStyles();

    return (
        <div className={classes.pageContainer}>
            <div className={classes.pageContent}>
                <Navbar {...props}/>
                <Switch>
                    <RoleProtectedRoute exact={true}
                                        path="/dashboard/approbation/cv"
                                        component={ResumeApprobation}
                                        role={"admin"}/>
                    <Route exact={true} path="/dashboard/upload" component={UploadCV}/>
                </Switch>
            </div>
            <Footer/>
        </div>
    );
}
