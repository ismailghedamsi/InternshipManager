import React from 'react';
import AuthenticationRegistrationService from '../js/AuthenticationRegistrationService';
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
import {makeStyles} from "@material-ui/core/styles";

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

export default function Welcome() {
    const classes = useStyles();

    return (
        <div className={classes.pageContainer}>
            <div className={classes.pageContent}>
                <Navbar/>
                <h1>Welcome, {JSON.parse(AuthenticationRegistrationService.getValueFromSession("authenticatedUser")).username}!</h1>
            </div>
            <Footer/>
        </div>
    );
}