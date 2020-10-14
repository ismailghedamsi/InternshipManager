import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import * as yup from "yup";
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function TextboxModal({isOpen, hide, title, onSubmit}) {

    return isOpen ? (
        <Dialog open={isOpen} onClose={hide} fullWidth maxWidth={"md"}>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" component={"div"}>
                    <Formik
                        onSubmit={onSubmit}

                        validationSchema={yup.object()
                            .shape({
                                message: yup.string().trim().max(255).required("Ce champ est requis")
                            })}
                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        initialValues={{message: ""}}>
                        {({isSubmitting}) => (
                            <Form>
                                <Field
                                    component={TextField}
                                    multiline
                                    rows={5}
                                    name="message"
                                    id="message"
                                    variant="outlined"
                                    label="Entrez votre message ici"
                                    required
                                    fullWidth
                                />
                                <br/>
                                {isSubmitting && <LinearProgress/>}
                                <Button
                                    type={"submit"}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size={"large"}
                                    disabled={isSubmitting}
                                >
                                    Envoyer
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={hide} color={"primary"}>
                    Annuler
                </Button>
            </DialogActions>
        </Dialog>
    ) : null;
}