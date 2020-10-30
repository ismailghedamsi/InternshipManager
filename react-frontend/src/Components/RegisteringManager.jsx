import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import * as PropTypes from "prop-types";
import RegisterStudent from "./RegisterStudent";
import RegisterEmployer from "./RegisterEmployer";
import Grid from "@material-ui/core/Grid";
import {Link as RouterLink, useHistory} from "react-router-dom";
import Link from "@material-ui/core/Link";
import useStyles from "./Utils/useStyles";

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
    const history = useHistory();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '100vh'}}
        >
            <Grid item xs={12} md={6} xl={3}>
                <Container component="main" maxWidth="sm" className={classes.container}>
                    <div className={classes.paper}>
                        <Typography variant="h1" className={classes.logo}>
                            TUIMSPFCAUPPBJ
                        </Typography>
                        <Typography variant="h2" className={classes.subtitle}>
                            The Ultimate Internship Manager Software Platform For College And University Plus Powered By
                            Java
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
                    <TabPanel value={value} index={0}>
                        <RegisterStudent classes={classes} history={history}/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <RegisterEmployer classes={classes} history={history}/>
                    </TabPanel>
                    <Grid container justify="flex-end" className={classes.link}>
                        <Grid item>
                            <Link component={RouterLink} to={'/'} variant="body2">
                                Vous avez déja un compte? Se connecter
                            </Link>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </Grid>
    );
}