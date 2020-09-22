import React from 'react'
import {Menu} from "./Menu"
import './Navbar.css'

import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    navbarColor: {
        backgroundColor: theme.palette.primary.main
    }
}));

export default function Navbar() {
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
                {/* <button className="myButton">Sign Up</button> */}
            </ul>
            <div className="menu-icon" onClick={showIcon}>
                <i className="fa fa-bars"/>
            </div>
            </nav>
        )
}