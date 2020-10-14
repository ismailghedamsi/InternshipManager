import React from "react";
import {useDateParser} from "./Hooks";
import Typography from "@material-ui/core/Typography";
import * as PropTypes from "prop-types";

export default function OfferDetails(props) {
    const parseDate = useDateParser();

    return (
        <div>
            <Typography color={"textSecondary"}
                        variant={"body1"}
                        display={"block"}>
                {`Date de création de l'offre :  ${parseDate(props.offer.creationDate)}`}
            </Typography>
            <Typography color={"textSecondary"}
                        variant={"body1"}
                        display={"block"}>
                {`Date limite d'application : ${parseDate(props.offer.limitDateToApply)} `}
            </Typography>
            <Typography color={"textSecondary"}
                        variant={"body1"}
                        display={"block"}>
                {`Début du stage : ${parseDate(props.offer.internshipStartDate)} `}
            </Typography>
            <Typography color={"textSecondary"}
                        variant={"body1"}
                        display={"block"}>
                {`Fin du stage : ${parseDate(props.offer.internshipEndDate)}`}
            </Typography>
            <Typography color={"textSecondary"}
                        variant={"body1"}
                        display={"block"}>
                {"Salaire horaire : $ " + props.offer.salary}
            </Typography>
            <Typography color={"textSecondary"}
                        variant={"body1"}
                        display={"block"}>
                {"Nombre de places disponibles :  " + props.offer.nbStudentToHire}
            </Typography>
            <Typography color={"textSecondary"}
                        variant={"body1"}
                        display={"block"}>
                {"Description de l'offre : " + props.offer.description}
            </Typography>
        </div>
    );
}

OfferDetails.propTypes = {
    offer: PropTypes.any.isRequired,
};