import {Button, CircularProgress, Grid, Step, StepLabel, Stepper} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Form, Formik} from "formik";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";
import EvaluationModal from "../Employer/Evaluations/EvaluationModal";
import BusinessEvaluationModal from "../Manager/BusinessEvaluations/BusinessEvaluationModal";
import {useApi, useFileReader, useModal} from "./Services/Hooks";

export function FormikStepper({contract, initialValues, children}) {
    const history = useHistory()
    const childrenArray = React.Children.toArray(children)
    const api = useApi()
    const readFile = useFileReader()
    const [step, setStep] = useState(0)
    const currentChild = childrenArray[step]
    const [completed, setCompleted] = useState(false)
    const [data, setData] = useState({})
    const [validationButtonClick, setValidationButtonClick] = useState(false)
    const [isEvaluationModalOpen, openEvalationModal, closeEvaluationModal] = useModal()
    const [isBusinessEvaluationModalOpen, openBusinessEvaluationModal, closeBusinessEvaluationModal] = useModal()

    function isLastStep() {
        return step === childrenArray.length - 1
    }

    function postEndPoint() {
        return AuthenticationService.getCurrentUserRole() === "admin" ? "/businessEvaluation" : "/internEvaluation"
    }

    function pageRedirection() {
        return AuthenticationService.getCurrentUserRole() === "admin" ? "/dashboard/businessEvaluationList" : "/dashboard/evaluationList"
    }

    function directionModal() {
        return AuthenticationService.getCurrentUserRole() === "admin" ?
            <BusinessEvaluationModal isOpen={isBusinessEvaluationModalOpen} data={data}
                                     hide={closeBusinessEvaluationModal} /> :
            <EvaluationModal isOpen={isEvaluationModalOpen} data={data} hide={closeEvaluationModal} />
    }

    function openModal() {
        return AuthenticationService.getCurrentUserRole() === "admin" ? openBusinessEvaluationModal() : openEvalationModal()
    }

    return <>
        {validationButtonClick && directionModal()}
        <Formik
            initialValues={initialValues}
            validationSchema={currentChild.props.validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validate={values => {
                if (!isLastStep()) return {}
                const errors = {}
                if (values.signature.image.type !== "image/png" && values.signature.image.type !== "image/jpeg") {
                    errors.signature = {}
                    errors.signature.image = "Le fichier doit être de type PNG ou JPEG"
                }
                return errors
            }}
            onSubmit={async values => {
                if (isLastStep()) {
                    setValidationButtonClick(false)
                    const dto = {...values}
                    dto.contract = contract
                    delete dto.contract.studentApplication
                    dto.signature.image = await readFile(values.signature.image)
                    setCompleted(true)
                    return api.post(postEndPoint(), dto)
                        .then(() => history.push(pageRedirection()))

                } else setStep(s => s + 1)
            }} >
            {({isSubmitting, values, submitForm}) =>
                <Form autoComplete="off" >
                    <Stepper alternativeLabel activeStep={step} >
                        {childrenArray.map((child, index) =>
                            <Step key={child.props.label} completed={step > index || completed} >
                                <StepLabel >{child.props.label}</StepLabel >
                            </Step >
                        )}
                    </Stepper >
                    {currentChild}
                    <Grid container spacing={2} >
                        {step > 0 &&
                        <Grid item >
                            <Button
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                                onClick={() => setStep(s => s - 1)} >
                                PAGE PRÉCÉDENTE
                            </Button >
                        </Grid >
                        }
                        {isLastStep() &&
                        <Grid item >
                            <Button
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                                onClick={async () => {
                                    setData({...values, submitForm})
                                    setValidationButtonClick(true)
                                    openModal()
                                }} >
                                Valider évaluation
                            </Button >
                        </Grid >
                        }
                        {isSubmitting && <LinearProgress />}
                        {!isLastStep() &&
                        <Grid item >
                            <Button
                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                                type="submit" >
                                PAGE SUIVANTE
                            </Button >
                        </Grid >}
                    </Grid >
                </Form >
            }
        </Formik >
    </>
}