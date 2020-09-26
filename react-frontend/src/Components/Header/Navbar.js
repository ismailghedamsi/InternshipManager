import React from 'react'
import {Menu} from "./Menu"
import './Navbar.css'

import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import AuthenticationService from "../../js/AuthenticationService";

const useStyles = makeStyles((theme) => ({
    navbarColor: {
        backgroundColor: theme.palette.primary.main
    },
    linkButton: {
        fontSize: 20,
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        margin: 0,
    }
}));

export default function Navbar(props) {
    const classes = useStyles();
    const showIcon = () => {
        const x = document.getElementById("myNav");
        if (x.className === "nav-menu") {
            x.className += " active";
        } else {
            x.className = "nav-menu";
        }
    }

    return (
        <div>
            <nav className={["NavbarItem", classes.navbarColor].join(' ')}>
                <h1 className="Navbar-logo">Logo</h1>
                <ul className="nav-menu" id="myNav">
                    {Menu.map((item, i) => {
                        return (
                            <li key={i}>
                                <Link className={item.cn} to={item.url}>
                                    {item.title}
                                </Link>
                            </li>
                        )
                    })}
                    <li>
                        <button
                            type={"button"}
                            className={["nav-links", classes.linkButton].join(' ')}
                            onClick={() => {
                                AuthenticationService.logout()
                                props.history.push("/")
                            }}>
                            Logout
                        </button>
                    </li>
                </ul>
                <div className="menu-icon" onClick={showIcon}>
                    <i className="fa fa-bars"/>
                </div>
            </nav>
        </div>
    )
}