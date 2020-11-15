import {Button, CircularProgress, Grid, Step, StepLabel, Stepper} from '@material-ui/core';
import {Form, Formik} from 'formik';
import React, {useState} from 'react';
import {useHistory} from "react-router-dom";
import AuthenticationService from '../../../Services/AuthenticationService';
import {useApi, useFileReader, useModal} from "../../Utils/Hooks";
import EvaluationModal from './EvaluationModal';

const sleep = time => new Promise(acc => setTimeout(acc, time))

export function FormikStepper({application, initialValues, children}) {
    const history = useHistory()
    const childrenArray = React.Children.toArray(children)
    const readFile = useFileReader()
    const [step, setStep] = useState(0)
    const currentChild = childrenArray[step]
    const [completed, setCompleted] = useState(false)
    const [data, setData] = useState({})
    const [isEvaluationModalOpen, openEvalationModal, closeEvaluationModal] = useModal()
    const [validationButtonClick, setValidationButtonClick] = useState(false)
    const api = useApi()

    function isLastStep() {
        return step === childrenArray.length - 1;
    }

    function pageRedirection() {
        if (AuthenticationService.getCurrentUserRole() === "admin")
            return "/dashboard/offerList"
        else
            return "/dashboard/evaluationList"
    }

    console.log(currentChild.props.validationSchema)

    return <>
        {validationButtonClick ?
                <EvaluationModal isOpen={isEvaluationModalOpen} data={data} hide={closeEvaluationModal}/> : ""}
        <Formik
                initialValues={initialValues}
                validationSchema={currentChild.props.validationSchema}
                validateOnBlur={false}
                validateOnChange={false}
                validate={values => {
                    if (!isLastStep())
                        return {};

                    const errors = {};
                    if (values.signature.image.type !== "image/png" && values.signature.image.type !== "image/jpeg") {
                        errors.signature.image = "Le fichier doit être de type PNG ou JPEG"
                    }
                    if (values.signature.image.length === 0) {
                        errors.signature.image = "Aucun fichier selectionné ou le fichier est vide"
                    }
                    return errors;
                }}
                onSubmit={async values => {
                    if (isLastStep()) {
                        var dto = {...values}
                        dto.contract = application.contract
                        dto.signature.image = await readFile(values.signature.image)
                        api.post("/internEvaluation", dto)
                                .then(() => history.push(pageRedirection()))
                        setCompleted(true);
                    } else {
                    setStep(s => s + 1);
                }
            }}
        >
            {({isSubmitting, values}) =>
                <Form autoComplete="off">
                    <Stepper alternativeLabel activeStep={step}>
                        {childrenArray.map((child, index) =>
                            <Step key={child.props.label} completed={step > index || completed}>
                                <StepLabel>{child.props.label}</StepLabel>
                            </Step>
                        )}
                    </Stepper>

                    {currentChild}

                    <Grid container spacing={2}>
                        {step > 0 &&
                        <Grid item>
                            <Button
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                                onClick={() => setStep(s => s - 1)}
                            >
                                Back
                            </Button>
                        </Grid>
                        }

                        {isLastStep() &&
                        <Grid item>
                            <Button
                                    disabled={isSubmitting}
                                    variant="contained"
                                    color="primary"
                                    onClick={async () => {
                                        var dto = {...values}
                                        dto.application = application
                                        setData(dto);
                                        setValidationButtonClick(true)
                                        openEvalationModal()
                                    }}
                            >
                                Valider evaluation
                            </Button>
                        </Grid>
                        }
                        <Grid item>
                            <Button
                                startIcon={isSubmitting ? <CircularProgress size="1rem"/> : null}
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                {isSubmitting ? 'Submitting' : isLastStep() ? 'Submit' : 'Next'}
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            }
        </Formik>
    </>
}