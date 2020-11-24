import Box from "@material-ui/core/Box";
import * as PropTypes from "prop-types";
import React from "react";

export default function TabPanel(props) {
    const {children, value, index, ...other} = props

    return <div hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
        {value === index &&
        <Box p={0}>
            {children}
        </Box>
        }
    </div>
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
}