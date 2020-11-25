import Typography from "@material-ui/core/Typography";
import * as PropTypes from "prop-types";
import React from "react";
import {useDateParser} from "../../Services/Hooks";

export default function OfferDetails(props) {
    const parseDate = useDateParser()

    return <div>
        <Typography color={"textSecondary"}
                    variant={"body1"}
                    display={"block"}>
            {`Date de création de l'offre :  ${parseDate(props.offer.details.creationDate)}`}
        </Typography>
        <Typography color={"textSecondary"}
                    variant={"body1"}
                    display={"block"}>
            {`Date limite d'application : ${parseDate(props.offer.details.limitDateToApply)} `}
        </Typography>
        <Typography color={"textSecondary"}
                    variant={"body1"}
                    display={"block"}>
            {`Début du stage : ${parseDate(props.offer.details.internshipStartDate)} `}
        </Typography>
        <Typography color={"textSecondary"}
                    variant={"body1"}
                    display={"block"}>
            {`Fin du stage : ${parseDate(props.offer.details.internshipEndDate)}`}
        </Typography>
        <Typography color={"textSecondary"}
                    variant={"body1"}
                    display={"block"}>
            {"Salaire horaire : $ " + props.offer.details.salary}
        </Typography>
        <Typography color={"textSecondary"}
                    variant={"body1"}
                    display={"block"}>
            {"Nombre de places disponibles :  " + props.offer.details.nbStudentToHire}
        </Typography>
        <Typography color={"textSecondary"}
                    variant={"body1"}
                    display={"block"}>
            {"Description de l'offre : " + props.offer.details.description}
        </Typography>
        <Typography color={"textSecondary"}
                    variant={"body1"}
                    display={"block"}>
            {"Heure de début : " + props.offer.details.startTime + ":00"}
        </Typography>
        <Typography color={"textSecondary"}
                    variant={"body1"}
                    display={"block"}>
            {"Heure de fin : " + props.offer.details.endTime + ":00"}
        </Typography>
    </div>
}

OfferDetails.propTypes = {
    offer: PropTypes.any.isRequired,
}