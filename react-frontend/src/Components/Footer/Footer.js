import React from 'react'
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    footer: {
        position: "relative",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        paddingBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    }
}));

export default function Footer() {
    const classes = useStyles();

    return (
        <div className={classes.footer}>
            <i className="fa fa-copyright"/>{new Date().getFullYear()} Cégep André-Laurendeau
        </div>
    )
}