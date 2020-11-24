import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import React from "react";
import useStyles from "./Style/useStyles";

export default function ApprovalButtons({onApprove, onDeny, approveLabel, denyLabel}) {
    const classes = useStyles()
    return <Grid container spacing={1} className={classes.buttonDiv}>
        <Grid item xs={6}>
            <Button
                onClick={onApprove}
                variant={"contained"}
                color={"primary"}
                fullWidth
                style={{backgroundColor: "green"}}
            >
                <i className="fa fa-check-square" style={{color: "white"}}/>&ensp;{approveLabel}
            </Button>
        </Grid>
        <Grid item xs={6}>
            <Button
                onClick={onDeny}
                variant={"contained"}
                color={"primary"}
                fullWidth
                style={{backgroundColor: "red"}}
            >
                <i className="fa fa-ban" style={{color: "white"}}/>&ensp;{denyLabel}
            </Button>
        </Grid>
    </Grid>
}