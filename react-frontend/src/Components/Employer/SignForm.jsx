import Button from "@material-ui/core/Button";
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import {Field, Form, Formik} from "formik";
import {SimpleFileUpload, TextField} from "formik-material-ui";
import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from 'react-router-dom';
import * as yup from "yup";
import AuthenticationService from "../../Services/AuthenticationService";
import {useApi} from "../Utils/Hooks";
import useStyles from "../Utils/useStyles";

const tooShortError = value => "Doit avoir au moins " + value.min + " caractères";
const tooLongError = value => "Doit avoir moins que " + value.max + " caractères";
export default function SignForm() {
    const classes = useStyles();
    const api = useApi();
    const location = useLocation();
    const history = useHistory();
    const [contract, setContract] = useState({});

    useEffect(() => {
        setContract(location.state);
    }, [location.state])

    function sendDecision(isApprouved, values) {
        let dto = {};
        if (isApprouved) {
            return readFileAsync(values.file).then(file => {
                dto.contractId = contract.id;
                dto.isApproved = isApprouved;
                dto.imageSignature = file;
                dto.reasonForRejection = "";
                dto.nomSignataire = values.nomSignataire;
                dto.signatureTimestamp = new Date();
                return api.put("/contractGeneration/sign", dto)
                    .then(() => redirection())
            })
        } else {
            dto.contractId = contract.id;
            dto.isApproved = isApprouved;
            dto.reasonForRejection = values.message;
            return api.put("/contractGeneration/sign", dto)
                .then(() => redirection())
        }
    }

    function redirection() {
        if (AuthenticationService.getCurrentUserRole() === "admin")
            return history.push("/dashboard/contractList")
        else if (AuthenticationService.getCurrentUserRole() === "employer")
            return history.push("/dashboard/signContract")
        else
            return history.push("/dashboard/signContractStudent")
    }

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result)
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        })
    }

    return <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{minHeight: '100vh'}}
    >
        <Grid item xs={12} sm={7} lg={5}>
            <Container component="main" maxWidth="sm" className={classes.container}>
                <Formik
                    onSubmit={async values => sendDecision(true, values)}
                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validate={values => {
                        const errors = {};
                        if (values.file.type !== "image/png" && values.file.type !== "image/jpeg") {
                            errors.file = "L'image doit être de type PNG ou JPG"
                        }
                        return errors;
                    }}
                    validationSchema={yup.object()
                        .shape({
                            nomSignataire: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required("Ce champs est requis")
                        })
                    }
                    initialValues={{
                        nomSignataire: "",
                        file: ""
                    }}>
                    {({submitForm, isSubmitting}) =>
                        <Form>
                            <Grid container>
                                <Typography variant="h1" className={classes.formTitle} style={{display: "block"}}>
                                    Veuillez signer le contrat
                                </Typography>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="nomSignataire"
                                        id="nomSignataire"
                                        variant="outlined"
                                        label="Nom du signataire"
                                        required
                                        fullWidth
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={SimpleFileUpload}
                                        type={"file"}
                                        name="file"
                                        id="file"
                                        variant="outlined"
                                        label="Une image de signature en PNG ou JPG"
                                        fullwidth
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <br/>
                            {isSubmitting && <LinearProgress/>}
                            <Button
                                id="buttonSubmit"
                                type={"submit"}
                                variant="contained"
                                fullWidth
                                size={"large"}
                                color="primary"
                                disabled={isSubmitting}
                                onClick={submitForm}
                            >
                                SIGNER
                            </Button>
                        </Form>}
                </Formik>
            </Container>
        </Grid>
    </Grid>
}