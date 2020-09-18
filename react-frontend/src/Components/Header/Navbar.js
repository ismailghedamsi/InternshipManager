import React, { Component } from 'react'
import { Menu } from "./Menu"
import './Navbar.css'

import {Link} from "react-router-dom";

class Navbar extends Component {

    showIcon = () => {
        var x = document.getElementById("myNav");
        if (x.className === "nav-menu") {
            x.className += " active";
        } else {
            x.className = "nav-menu";
        }
    }

    render() {
        return (
            <nav className="NavbarItem">
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
                <div className="menu-icon" onClick={this.showIcon}>
                    <i className="fa fa-bars"></i>
                </div>
            </nav>
        )
    }
}

export default Navbar