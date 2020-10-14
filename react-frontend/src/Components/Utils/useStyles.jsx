import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    main: {
        backgroundColor: "#fff",
        alignItems: "stretch",
        height: "100%"
    },
    list: {
        height: "inherit",
        overflow: "auto",
        padding: theme.spacing(0, 0, 0, 5)
    },
    viewbox: {
        height: "inherit",
        overflow: "auto",
        backgroundColor: "#888",
    },
    page: {
        margin: theme.spacing(1, 0)
    },
    linkButton: {
        fontSize: "1.5rem",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        margin: 0,
        padding: 5,
        borderRadius: 0,
        '&:hover': {
            backgroundColor: "#00000055",
        },
        '&:focus': {
            outline: "none",
        }
    },
    fileButton: {
        outline: "none",
        backgroundColor: theme.palette.primary.light,
        display: "inline"

    },
    buttonDiv: {
        display: "inline"
    },
    offerState: {
        color: "black",
        display: "block",
        padding: theme.spacing(0.5, 2, 2),
        textAlign: "justify"
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(1, 0, 1),
    }, container: {
        backgroundColor: "#fff",
        borderRadius: theme.spacing(2),
    },
    appliedMark: {
        fontSize: "1.5rem",
        backgroundColor: "transparent",
        border: "none",
        margin: 0,
        padding: 5,
        borderRadius: 0,
        textAlign: "left",
    },
}));