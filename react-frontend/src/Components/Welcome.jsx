import React, {Component} from 'react';
import AuthenticationRegistrationService from '../js/AuthenticationRegistrationService';
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";

class Welcome extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <h1>Welcome, {JSON.parse(AuthenticationRegistrationService.getValueFromSession("authenticatedUser")).username}!</h1>
                <Footer/>
            </div>
        );
    }
}

export default Welcome