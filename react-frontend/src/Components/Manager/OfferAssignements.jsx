import {Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Field, Form, Formik} from "formik";
import {Checkbox} from "formik-material-ui";
import React, {useEffect, useState} from "react";
import {useApi} from "../Utils/Hooks";
import PdfSelectionViewer from "../Utils/PdfSelectionViewer";
import useStyles from "../Utils/useStyles";

export default function OfferAssignements() {
    const classes = useStyles();
    const api = useApi();
    const [students, setStudents] = useState([])
    const [offers, setOffers] = useState([]);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

    useEffect(() => {
        api.get("/offers/approved")
            .then(r => setOffers(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("/students")
            .then(r => {
                if (r) {
                    r.data.forEach(s => {
                        delete s.resumes;
                        delete s.appliedOffers;
                    })
                    setStudents(r.data)
                } else
                    setStudents([])
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function isStudentAllowedInOffer(offer, student) {
        return offer.allowedStudents.find(s => s.id === student.id) !== undefined && offer.allowedStudents.length !== 0;
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Assignation des offres aux étudiants"}>
            {(i, setCurrent) =>
                <div key={i}>
                    <button
                        type={"button"}
                        className={[classes.linkButton, i === currentOfferIndex ? classes.fileButton : null].join(' ')}
                        onClick={() => {
                            setCurrent(i);
                            setCurrentOfferIndex(i);
                        }}
                    >
                        <Typography color={"textPrimary"} variant={"body1"}>
                                {offers[i].title}
                            </Typography>
                            <Typography color={"textSecondary"} variant={"body2"}>
                                {offers[i].employer.companyName}
                            </Typography>
                        </button>
                        {currentOfferIndex === i &&
                        students.map((student, j) =>
                            <div key={j}>
                                <Formik
                                    initialValues={{
                                        offerId: offers[i].id,
                                        studentId: student.id,
                                        allowed: false
                                    }}
                                    onSubmit={values => {
                                        return api.put("/offers/" + values.offerId + "/addRemoveStudent/" + values.studentId, {})
                                            .then(r => {
                                                const nextState = [...offers];
                                                nextState.splice(i, 1, r.data);
                                                setOffers(nextState);
                                            })
                                    }}>
                                    {({submitForm, isSubmitting}) =>
                                        <Form style={{display: "inline", marginLeft: 16}}>
                                            <Field name={"offerId"} type={"hidden"}/>
                                            <Field name={"studentId"} type={"hidden"}/>
                                            <Field id={"allowed"} name={"allowed"} component={Checkbox}
                                                   type="checkbox" onChange={submitForm} disabled={isSubmitting}
                                                   checked={isStudentAllowedInOffer(offers[i], student)}/>
                                            <label
                                                htmlFor={"allowed"}>{student.firstName} {student.lastName}</label>
                                            {isSubmitting && <CircularProgress size={18}/>}
                                        </Form>}
                                </Formik>
                            </div>
                        )}
                    </div>
            }
            </PdfSelectionViewer>
        </div>
}
