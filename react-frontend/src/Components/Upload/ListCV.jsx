import React, {Component} from "react";
import './ListCV.css'
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import AuthenticationService from '../../js/AuthenticationService';


const useStyles = (theme) => ({
    container: {
        backgroundColor: "#fff",
        borderRadius: theme.spacing(2)
    }
});

class ListCV extends Component {
    render() {
        const {classes} = this.props;
        return (

            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{minHeight: '100vh'}}
            >
                <Grid item xs={12}>
                    <Container component="main" maxWidth="sm" className={classes.container}>
                        <div id="container">
                            <Typography variant="h5" id="title">Étudiant :
                                {JSON.parse(AuthenticationService.getValueFromSession("authenticatedUser")).firstName}
                                {JSON.parse(AuthenticationService.getValueFromSession("authenticatedUser")).lastName}
                            </Typography>
                            <table id="tab">
                                <thead>
                                <tr>
                                    <th>Version</th>
                                    <th>Titre du CV</th>
                                    <th>Détail</th>
                                    <th>Supprimer</th>
                                </tr>
                                </thead>
                                {/*<tbody>*/}
                                {/*<tr>*/}
                                {/*    <td>1</td>*/}
                                {/*    <td>mon cv</td>*/}
                                {/*    <td>*/}
                                {/*        <button>Click</button>*/}
                                {/*    </td>*/}
                                {/*    <td>*/}
                                {/*        <button>Supprimer</button>*/}
                                {/*    </td>*/}
                                {/*</tr>*/}
                                {/*</tbody>*/}
                            </table>
                            <br/>
                        </div>
                    </Container>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(useStyles)(ListCV)