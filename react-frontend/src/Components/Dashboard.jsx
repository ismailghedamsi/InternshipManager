import React from 'react';
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
import {makeStyles} from "@material-ui/core/styles";
import {RoleProtectedRoute} from "./Routes";
import ResumeApprobation from "./ResumeApprobation";
import {Switch} from 'react-router-dom';

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
                </Switch>
            </div>
            <Footer/>
        </div>
    );
}
