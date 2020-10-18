import React from "react";

export default function Offerstatus(offer) {
    function printOfferStatus(offer) {


        if (offer.reviewState == "PENDING")
            return <span style={{color: "blue"}}>En attente</span>;
        else if (offer.reviewState == "DENIED")
            return (<span style={{color: "red"}}>Rejeté</span>);
        else
            return <span style={{color: "green"}}>Approuvé</span>;
    }

    return (
        <>
            {
                printOfferStatus(offer)
            }
        </>
    )
}
