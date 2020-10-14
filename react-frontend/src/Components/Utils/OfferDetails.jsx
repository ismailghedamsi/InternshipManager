import React from "react";
import {useDateParser} from "./Hooks";
import Typography from "@material-ui/core/Typography";
import * as PropTypes from "prop-types";

export default function OfferDetails(props) {
    const parseDate = useDateParser();

    return (
        <div>
            <Typography color={"textPrimary"} variant={"body2"}>
                {`Description: ${props.offer.description}`}
            </Typography>
            <Typography color={"textPrimary"} variant={"body2"}>
                {`Nombre de semaine: ${props.offer.nbOfWeeks}`}
            </Typography>
            <Typography color={"textPrimary"} variant={"body2"}>
                {`Salaire: ${props.offer.salary}`}
            </Typography>
            <Typography color={"textPrimary"} variant={"body2"}>
                {`Heure de début: ${props.offer.beginHour}h00`}
            </Typography>
            <Typography color={"textPrimary"} variant={"body2"}>
                {`Heure de fin: ${props.offer.endHour}h00`}
            </Typography>
            <Typography color={"textPrimary"} variant={"body2"}>
                {`Date de création: ${parseDate(props.offer.creationDate)}`}
            </Typography>
            <Typography color={"textPrimary"} variant={"body2"}>
                {`Date limite pour appliquer : ${parseDate(props.offer.limitDateToApply)}`}
            </Typography>
        </div>
    );
}

OfferDetails.propTypes = {
    offer: PropTypes.any.isRequired,
};