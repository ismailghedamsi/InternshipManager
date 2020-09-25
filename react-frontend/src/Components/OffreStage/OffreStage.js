import React from 'react';
import { render } from 'react-dom';
import Navbar from '../Header/Navbar';
import {Link} from "react-router-dom";

function OffreStage() {
    return (<div>
        <Link to={"/CreateStage"}>
            CreateStudent
        </Link>
        <table>
            <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Date</th>
                <th>Pdf</th>
                <th>Etudiant envoyer</th>
                <th>Etudiant accepter</th>
            </tr>
        </table>

    </div>);
}

export default OffreStage;