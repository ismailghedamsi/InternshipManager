import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Typography} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

const useStyles = (theme) => ({
    container: {
        backgroundColor: "#fff",
        borderRadius: theme.spacing(2),
    }
});

class UploadCV extends Component {
    state = {
        selectedFile: null
    }

    onChange = event => {
        this.setState({
            selectedFile: event.target.files[0], loaded: 0,
        })
    }

    /*
        onClick = () => {
            const data = FormData()
            data.append('file', this.state.selectedFile)
            axios.post("", data, {}).then(res => {
                console.log(res.statusTest)
            })
        }
    */

    render() {
        const {classes} = this.props;
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{minHeight: '80vh'}}
            >
                <Grid item xs={4}>
                    <Typography>CV des étudiants</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Container component="main" maxWidth="sm" className={classes.container}>
                        <Typography variant={"h2"}>Approbations des CV</Typography>
                        <input type="file" onChange={this.onChange}/>
                        <button type="button" onClick={this.onClick}>Upload</button>
                    </Container>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(useStyles)(UploadCV)