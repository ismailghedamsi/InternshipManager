import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import React, {useContext} from 'react'
import {Link, useHistory} from "react-router-dom";
import {SemesterContext} from "../../../App";
import AuthenticationService from "../../../Services/AuthenticationService";
import {Menu} from "./Menu"
import './Navbar.css'

const useStyles = makeStyles(theme => ({
    navbarColor: {
        backgroundColor: theme.palette.primary.main
    },
    linkButton: {
        fontSize: 20,
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        margin: 0,
        lineHeight: 1.43,
        '&:hover': {
            color: "#000"
        },
        '&:focus': {
            outline: "none",
        }
    }
}));

export default function Navbar() {
    const classes = useStyles();
    const {semester, setSemester} = useContext(SemesterContext)
    const history = useHistory();
    const showIcon = () => {
        const x = document.getElementById("myNav");
        if (x.className === "nav-menu") {
            x.className += " active";
        } else {
            x.className = "nav-menu";
        }
    }

    return <nav className={["NavbarItem", classes.navbarColor].join(' ')}>
        <h1 className="Navbar-logo">Logo</h1>
        <ul className="nav-menu" id="myNav">
            {Menu.filter(item => item.role === AuthenticationService.getCurrentUserRole() || item.role === undefined)
                .map((item, i) => <li key={i}>
                    <Link className={"nav-links"} to={item.url}>
                        {item.title}
                    </Link>
                </li>)
            }
            {AuthenticationService.getCurrentUserRole() === "admin" &&
            <li>
                <button
                    type={"button"}
                    className={["nav-links", classes.linkButton].join(' ')}
                    onClick={() => {
                        history.push("/dashboard/setSemester")
                    }}>
                    Année <br/>
                    {semester}
                </button>
            </li>
            }
            <li>
                <button
                    type={"button"}
                    className={["nav-links", classes.linkButton].join(' ')}
                    onClick={() => {
                        AuthenticationService.logout()
                        axios.get("http://localhost:8080/api/semesters/present")
                            .then(r => setSemester(r ? r.data : ''));
                        history.push("/")
                    }}>
                    Déconnexion
                </button>
            </li>
        </ul>
        <div className="menu-icon" onClick={showIcon}>
            <i className="fa fa-bars"/>
        </div>
    </nav>
}
