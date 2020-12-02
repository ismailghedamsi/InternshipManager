import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import * as PropTypes from "prop-types";
import React from "react";
import {useDateParser, useTimeFormatter} from "../../Services/Hooks";

export default function OfferDetails(props) {
    const parseDate = useDateParser()
    const parseTime = useTimeFormatter()

    return <div>
        <Typography variant={"body1"}>
            {"Description : " + props.offer.details.description}
        </Typography>
        <Divider style={{maxWidth: "30%"}}/>
        <Typography variant={"body1"}
                    display={"block"}>
            {"Nombre de stagiaires : " + props.offer.details.nbStudentToHire}
        </Typography>
        <Typography variant={"body1"}
                    display={"block"}>
            {`Date limite d'application : ${parseDate(props.offer.details.limitDateToApply)}`}
        </Typography>
        <Typography variant={"body1"}
                    display={"block"}>
            {`Du ${parseDate(props.offer.details.internshipStartDate)} au ${parseDate(props.offer.details.internshipEndDate)}`}
        </Typography>
        <Typography variant={"body1"}
                    display={"block"}>
            {"Horaire : " + parseTime(props.offer.details.startTime) + " à " + parseTime(props.offer.details.endTime)}
        </Typography>
        <Typography variant={"body1"}
                    display={"block"}>
            {"Taux horaire : $ " + props.offer.details.salary}
        </Typography>
        <Divider style={{maxWidth: "30%"}}/>
        <Typography variant={"body2"}
                    color={"textSecondary"}
                    display={"block"}>
            {`Créée le : ${parseDate(props.offer.details.creationDate)}`}
        </Typography>
    </div>
}

OfferDetails.propTypes = {
    offer: PropTypes.any.isRequired,
}