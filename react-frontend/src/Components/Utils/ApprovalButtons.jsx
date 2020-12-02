import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import React, {useState} from "react";
import useStyles from "./Style/useStyles";

export default function ApprovalButtons({onApprove, onDeny, approveLabel, denyLabel}) {
    const classes = useStyles()
    const [disabled, setDisabled] = useState(false)
    const [disabledButton, setDisabledButton] = useState(-1)

    return <Grid container spacing={1} className={classes.buttonDiv}>
        <Grid item xs={6}>
            <Button
                onClick={() => {
                    setDisabled(true)
                    setDisabledButton(0)
                    onApprove().then(() => setDisabled(false))
                }}
                variant={"contained"}
                color={"primary"}
                fullWidth
                disabled={disabled}
                style={disabled ? {} : {backgroundColor: "green"}}
            >
                <span style={{fontSize: "0.8em"}}>
                    <i className="fa fa-check-square" style={{color: "white"}}/>&ensp;{approveLabel}
                    &ensp;{disabled && disabledButton === 0 && <CircularProgress size={18}/>}
                </span>
            </Button>
        </Grid>
        <Grid item xs={6}>
            <Button
                onClick={() => {
                    const result = onDeny()
                    if (result && typeof result.then === "function") {
                        setDisabled(true)
                        setDisabledButton(1)
                        result.then(setDisabled(false))
                    }
                }}
                variant={"contained"}
                color={"primary"}
                fullWidth
                style={disabled ? {} : {backgroundColor: "red"}}
                disabled={disabled}
            >
                <span style={{fontSize: "0.8em"}}>
                <i className="fa fa-ban" style={{color: "white"}}/>&ensp;{denyLabel}
                    &ensp;{disabled && disabledButton === 1 && <CircularProgress size={18}/>}
                </span>
            </Button>
        </Grid>
    </Grid>
}