import React, { Component } from 'react'
import './Footer.css'

class Footer extends Component {
    render() {
        return (
            <div className="myFooter">
                <i class="fa fa-copyright">{new Date().getFullYear()} Cégep André-Laurendeau</i>
            </div>
        )
    }
}

export default Footer