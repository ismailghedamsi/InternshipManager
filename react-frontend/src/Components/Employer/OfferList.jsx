import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import AuthenticationService from '../../Services/AuthenticationService';
import Link from "@material-ui/core/Link";
import {useHistory} from "react-router-dom";
import {useStyles} from "../Utils/useStyles";
import {useApi} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import OfferDetails from "../Utils/OfferDetails";

export default function OfferList() {
    const classes = useStyles();
    const api = useApi();
    const history = useHistory();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        api.get("/offers/employer/" + AuthenticationService.getCurrentUser().username)
            .then(r => {
                console.log(r.data)
                setOffers(r ? r.data : [])
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function deleteOffer(index) {
        const nextState = [...offers];
        return api.delete("/offers/" + nextState[index].id)
            .then(() => {
                nextState.splice(index, 1)

                if (currentIndex >= nextState.length)
                    setCurrentIndex(0)

                setOffers(nextState)
            })
    }

    return (
        <div style={{height: "100%"}}>
            <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Mes offres"}>
                {(i, setCurrent) => (
                    <div key={i}>
                        <div className={classes.buttonDiv}>
                            <button
                                type={"button"}
                                className={classes.linkButton}
                                onClick={() => deleteOffer(i)}>
                                <i className="fa fa-trash" style={{color: "red"}}/>
                            </button>
                        </div>
                        <button
                            type={"button"}
                            className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                            autoFocus={i === 0}
                            onClick={() => {
                                setCurrentIndex(i)
                                setCurrent(i)
                            }}
                        >
                            <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
                                {" " + offers[i].title + " "}
                            </Typography>
                            <Typography color={"textSecondary"} variant={"body2"} display={"inline"}>
                                {offers[i].employer.companyName} {offers[i].employer.contactName}
                            </Typography>
                        </button>
                        {currentIndex === i && <OfferDetails offer={offers[i]}/>}
                        {offers[i].applications.length !== 0 &&
                        <Link variant={"body1"}
                              onClick={() => history.push("/dashboard/applications", {offerId: offers[i].id})}
                        >
                            Voir les applications
                        </Link>
                        }
                        <hr/>
                    </div>
                )}
            </PdfSelectionViewer>
        </div>
    );
}