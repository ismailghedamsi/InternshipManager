import {Button, List, ListSubheader, Toolbar, Typography} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {makeStyles} from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import axios from "axios";
import React, {useContext, useEffect, useState} from 'react'
import {useHistory, useLocation} from "react-router-dom";
import {SemesterContext} from "../../App";
import AuthenticationService from "../../Services/AuthenticationService";

const Links = {
    admin: [
        {
            title: 'Approbation des CV',
            url: '/dashboard/approbation/cv',
        },
        {
            title: 'Approbation des offres',
            url: '/dashboard/approbation/offres',
        },
        {
            title: <Divider/>
        },
        {
            title: 'Assignation des offres',
            url: '/dashboard/assignement/offer',
        },
        {
            title: <Divider/>
        },
        {
            title: 'Étudiants ',
            url: "/dashboard/status",
        },
        {
            title: 'Employeurs',
            url: "/dashboard/employersStatus",
        },
        {
            title: <Divider/>
        },
        {
            title: 'Offres',
            url: '/dashboard/offerList',
        },
        {
            title: 'Contrats',
            url: '/dashboard/contractList',
        },
        {
            title: <Divider/>
        },
        {
            title: 'Rapports',
            url: '/dashboard/reports',
        }
    ],
    student: [
        {
            title: 'Téléverser un CV',
            url: '/dashboard/upload'
        },
        {
            title: 'Mes CV',
            url: '/dashboard/listcv'
        },
        {
            title: 'Offre de stages',
            url: '/dashboard/stagelist'
        },
        {
            title: 'List de contrats',
            url: '/dashboard/signContractStudent'
        }
    ],
    employer: [
        {
            title: 'Créer une offre',
            url: '/dashboard/createstage'
        },
        {
            title: 'Liste des offres',
            url: '/dashboard/listoffer'
        },
        {
            title: 'Liste des entrevues',
            url: '/dashboard/listInterview'
        },
        {
            title: 'Liste de contrats',
            url: '/dashboard/signContract'
        }
    ]
}

const useStyles = makeStyles(theme => ({
    linkButton: {
        color: "inherit",
        fontWeight: "normal",
        "&:hover": {
            backgroundColor: "#FFFFFF33"
        }
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    spacer: {
        flexGrow: 1
    }
}));

export default function Navbar() {
    const classes = useStyles()
    const history = useHistory();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false)
    const [current, setCurrent] = useState(0)
    const {semester, setSemester} = useContext(SemesterContext)

    function getLinks() {
        if (AuthenticationService.getCurrentUserRole() === "student")
            return Links.student
        else if (AuthenticationService.getCurrentUserRole() === "employer")
            return Links.employer
        else
            return Links.admin
    }

    useEffect(() => {
        const index = getLinks().findIndex(route => route.url === location.pathname)
        if (index !== -1)
            setCurrent(index)
    }, [location])

    return <AppBar position="static">
        <Toolbar>
            <Button edge="start" className={[classes.menuButton, classes.linkButton].join(' ')}
                    onClick={() => setMenuOpen(true)} color="inherit">
                <MenuIcon/>
                &ensp;
                <Typography>{getLinks()[current].title}</Typography>
            </Button>
            <div className={classes.spacer}/>
            {AuthenticationService.getCurrentUserRole() === "admin" &&
            <Button className={classes.linkButton}
                    onClick={() => history.push("/dashboard/setSemester")}
            >
                <i className="fa fa-calendar"/>&ensp;{semester}
            </Button>
            }
            <Button className={classes.linkButton}
                    onClick={() => {
                        AuthenticationService.logout()
                        axios.get("http://localhost:8080/api/semesters/present")
                            .then(r => setSemester(r ? r.data : ''));
                        history.push("/")
                    }}
            >
                <i className="fa fa-sign-out"/>&ensp;Déconnexion
            </Button>
        </Toolbar>
        <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)} style={{width: 250}}>
            <List style={{width: 250}} onClick={() => setMenuOpen(false)}>
                <ListSubheader>Menu</ListSubheader>
                {getLinks().map((item, index) =>
                    <ListItem button
                              key={index}
                              onClick={() => {
                                  setCurrent(index)
                                  history.push(item.url)
                              }}
                    >
                        <ListItemText primary={item.title}/>
                    </ListItem>
                )}
            </List>
        </Drawer>
    </AppBar>
}
