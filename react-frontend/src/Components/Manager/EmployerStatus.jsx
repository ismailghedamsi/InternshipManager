import {Grid, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {useApi} from "../Utils/Hooks";
import OfferDetails from "../Utils/OfferDetails";
import {useStyles} from "../Utils/useStyles";


export default function StudentStatus() {
    const classes = useStyles();
    const api = useApi();
    const [employers, setEmployers] = useState([{}]);
    const [currentEmployer, setCurrentEmployer] = useState({});
    const [currentEmployerOffers, setCurrentEmployerOffers] = useState([{}]);
    const [currentOffer, setCurrentOffer] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        api.get("employers").then(resp => {
            setEmployers(resp ? resp.data : [])
            setCurrentEmployer(employers[0])
        })
    }, [currentEmployer]);

    useEffect(() => {
        api.get("/offers/employer/" + currentEmployer.username)
            .then(r => {
                setCurrentEmployerOffers(r.data);
                console.log("Current Employer updated ")
            })
    }, [currentEmployer]);


    return (
        <Grid
            container
            spacing={2}
            className={classes.main}
        >
            <Grid item xs={5} className={classes.list}>
                <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                    Employés
                </Typography>
                {employers.map((item, i) =>
                    <div key={i}>
                        <button type={"button"}
                                className={[classes.linkButton, i === currentIndex ? classes.fileButton : null].join(' ')}
                                onClick={() => {
                                    setCurrentIndex(i);
                                    setCurrentEmployer(employers[i]);
                                }}
                        >
                            <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
                                {employers[i].companyName}
                            </Typography>
                        </button>

                    </div>
                )}
            </Grid>
            <Grid item xs={7} align="center" style={{overflow: "auto", height: "100%"}}>
                <h1>Detaille des l'offres</h1>
                {/* {currentEmployerOffers && currentEmployerOffers[0]  ?  <OfferDetails offer={currentEmployerOffers[0]}/>  : ""} */}

                {
                    currentEmployerOffers ? currentEmployerOffers.map((o, k) => {
                            console.log(o.salary);
                            return <OfferDetails key={k} offer={o}/>
                        })
                        : "L'employeur n'a aucune offre"
                }
            </Grid>
        </Grid>
    );


}