import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import * as PropTypes from "prop-types";
import RegisterStudent from "./RegisterStudent";
import RegisterEmployer from "./RegisterEmployer";
import Grid from "@material-ui/core/Grid";
import {Link as RouterLink} from "react-router-dom";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    link: {
        padding: theme.spacing(1, 0, 2)
    },
    logo: {
        margin: theme.spacing(6)
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(1, 0, 1),
    },
}));

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
            {value === index && (
                <Box p={0}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default function RegisteringManager() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h1" className={classes.logo}>
                    Logo
                </Typography>
                <Typography component="h1" variant="h5">
                    S'enregistrer
                </Typography>
            </div>
            <AppBar position={"relative"}>
                <Tabs value={value} onChange={handleChange} centered aria-label="simple tabs example">
                    <Tab label="Étudiant" id={`simple-tab-0`}/>
                    <Tab label="Employeur" id={`simple-tab-1`}/>
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0} className={classes.tabPanel}>
                <RegisterStudent classes={useStyles()}/>
            </TabPanel>
            <TabPanel value={value} index={1} className={classes.tabPanel}>
                <RegisterEmployer classes={useStyles()}/>
            </TabPanel>
            <Grid container justify="flex-end" className={classes.link}>
                <Grid item>
                    <Link component={RouterLink} to={'/login'} variant="body2">
                        Vous avez déja un compte? Se connecter
                    </Link>
                </Grid>
            </Grid>
        </Container>
    );
}