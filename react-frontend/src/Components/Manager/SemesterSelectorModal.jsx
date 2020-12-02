import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import { Field, Form, Formik } from "formik";
import { Select } from "formik-material-ui";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import { SemesterContext } from "../../App";
import { useApi } from "../../Services/Hooks";

export default function SemesterSelectorModal({isOpen, hide, title}) {
    const api = useApi()
    const history = useHistory()
    const {setSemester} = useContext(SemesterContext)
    const [semesters, setSemesters] = useState([])

    useEffect(() => {
        api.get("/semesters")
            .then(r => setSemesters(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function generateMenuItems() {
        if (semesters.length !== 0) {
            const options = semesters.map((item, i) => <MenuItem key={i} value={i}>{item}</MenuItem>)
            options.push(<MenuItem key={semesters.length} value={-1} disabled>Veuillez choisir une année</MenuItem>)
            return options
        } else
            return <MenuItem value={-1} disabled>Aucune année</MenuItem>
    }

    return isOpen ? <Dialog open={isOpen} onClose={hide} fullWidth maxWidth={"md"}>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description" component={"div"}>
                <Formik
                    onSubmit={async values => {
                        setSemester(semesters[values.semester])
                        history.push("/")
                    }}

                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={yup.object()
                        .shape({
                            semester: yup.number().notOneOf([-1], "Impossible de choisir une année invalide").required("Ce champ est requis")
                        })}
                    initialValues={{semester: -1}}>
                    {({submitForm, isSubmitting}) => <Form>
                        <Grid container
                              justify="center"
                              spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={Select}
                                    id="semester"
                                    name="semester"
                                    fullWidth
                                    style={{marginBottom: "10px"}}
                                >
                                    {generateMenuItems()}
                                </Field>
                            </Grid>
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
                                Changer d'année
                            </Button>
                        </Grid>
                    </Form>}
                </Formik>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={hide} color={"primary"}>
                Annuler
            </Button>
        </DialogActions>
    </Dialog> : null
}