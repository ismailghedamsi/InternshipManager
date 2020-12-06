import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import * as yup from "yup";
import {useApi} from "../../Services/Hooks";
import useStyles from "../Utils/Style/useStyles";

const tooShortError = value => "Doit avoir au moins " + value.min + " caractères"
const tooLargeError = value => "Doit être au plus " + value.max
const requiredFieldMsg = "Ce champ est requis"
export default function ContractForm() {
    const classes = useStyles()
    const api = useApi()
    const location = useLocation()
    const history = useHistory()
    const [applicationContract, setApplicationContract] = useState({})

    useEffect(() => {
        setApplicationContract(location.state)
    }, [location.state])

    return <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{minHeight: "100%"}}
    >
        <Grid item xs={12} sm={7} lg={5}>
            <Container component="main" maxWidth="sm" className={classes.container}>
                <Formik
                    onSubmit={async values => {
                        let dto = {...values}
                        dto.studentApplicationId = applicationContract.id
                        return api.post("/contractGeneration", dto)
                            .then(() => history.push("/dashboard/contractList"))
                    }}
                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={yup.object()
                        .shape({
                            engagementCollege: yup.string().trim().min(20, tooShortError).required(requiredFieldMsg),
                            engagementCompany: yup.string().trim().min(20, tooShortError).required(requiredFieldMsg),
                            engagementStudent: yup.string().trim().min(20, tooShortError).required(requiredFieldMsg),
                            totalHoursPerWeek: yup.number().min(1).max(40, tooLargeError).required(requiredFieldMsg)
                        })}
                    initialValues={{
                        engagementCollege: "",
                        engagementCompany: "",
                        engagementStudent: "",
                        totalHoursPerWeek: 1
                    }}
                >
                    {({isSubmitting}) =>
                        <Form className={classes.form}>
                            <Grid container spacing={2} justify={"center"}>
                                <Typography variant={"h4"} display={"block"} style={{marginTop: 10}}>
                                    Générer un contrat
                                </Typography>
                                <Grid item xs={12}>
                                    {applicationContract.student && applicationContract.offer &&
                                        <>
                                            <Typography>
                                                Étudiant : 
                                                &ensp;{applicationContract.student.firstName} {applicationContract.student.lastName}
                                            </Typography>
                                            <Typography>
                                                Offre : 
                                                &ensp;{applicationContract.offer.title}
                                            </Typography>
                                            <Typography>
                                                Compagnie : 
                                                &ensp;{applicationContract.offer.employer.companyName}
                                            </Typography>
                                        </>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="totalHoursPerWeek"
                                        id="totalHoursPerWeek"
                                        variant="outlined"
                                        label="Nombre d'heures travaillées par semaine"
                                        required
                                        fullWidth
                                        type={"number"}
                                        InputProps={{
                                            inputProps: {
                                                min: 1,
                                                step: "any"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="engagementCollege"
                                        id="engagementCollege"
                                        variant="outlined"
                                        label="Engagements du collège"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="engagementCompany"
                                        id="engagementCompany"
                                        variant="outlined"
                                        label="Engagements de l'entreprise"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        name="engagementStudent"
                                        id="engagementStudent"
                                        variant="outlined"
                                        label="Engagements de l'étudiant"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <br/>
                            {isSubmitting && <LinearProgress/>}
                            <Button
                                type={"submit"}
                                fullWidth
                                variant="contained"
                                color="primary"
                                size={"large"}
                                className={classes.submit}
                                disabled={isSubmitting}
                            >
                                Générer
                            </Button>
                        </Form>}
                </Formik>
            </Container>
        </Grid>
    </Grid>
}
