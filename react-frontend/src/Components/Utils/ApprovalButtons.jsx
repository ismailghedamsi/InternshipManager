import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { getActiveElement } from "formik";
import React, { useState } from "react";
import useStyles from "./Style/useStyles";

export default function ApprovalButtons({onApprove, onDeny, approveLabel, denyLabel}) {
    const classes = useStyles()
    const [disabled, setDisabled] = useState()

    return <Grid container spacing={1} className={classes.buttonDiv}>
        <Grid item xs={6}>
            <Button
                onClick={(e) => {
                    setDisabled(true)
                    getActiveElement().children[0].children[0].className = "fa fa-cog fa-spin"
                    console.log(getActiveElement().children[0].children)
                    // onApprove()
                }}
                variant={"contained"}
                color={"primary"}
                fullWidth
                disabled={disabled}
                style={disabled ? {backgroundColor: "gray"} : {backgroundColor: "green"}}
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
                style={disabled ? {backgroundColor: "gray"} : {backgroundColor: "red"}}
                disabled={disabled}
            >
                <i className="fa fa-ban" style={{color: "white"}}/>&ensp;{denyLabel}
            </Button>
        </Grid>
    </Grid>
}