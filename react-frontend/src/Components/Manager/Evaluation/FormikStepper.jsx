import {Button, CircularProgress, Grid, Step, StepLabel, Stepper} from '@material-ui/core';
import {Form, Formik} from 'formik';
import React, {useState} from 'react';
import {useLocation} from "react-router-dom";
import EvaluationModal from '../../Utils/EvaluationModal';
import {useFileReader} from "../../Utils/";

export function FormikStepper({children, evaluationAnswers, globalAppreciations}) {
    const childrenArray = React.Children.toArray(children)
    const location = useLocation()
    const readFile = useFileReader()
    const [step, setStep] = useState(0)
    const currentChild = childrenArray[step]
    const [completed, setCompleted] = useState(false)
    const [data, setData] = useState({})
    const [isOpen, setOpen] = useState(false)

    function isLastStep() {
        return step === childrenArray.length - 1;
    }

    return <>
        <EvaluationModal isOpen={isOpen} data={data}/>
        <Formik
            initialValues={{
                signature: {
                    image: "",
                    date: new Date(),
                    name: "",
                }
            }}
            validationSchema={currentChild.props.validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validate={values => {
                if (!isLastStep())
                    return {};

                const errors = {signature: {}};
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
                    const dto = {...values}
                    dto.signature.image = await readFile(values.signature.image)

                    console.log(dto)
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
                                PAGE PRÉCÉDENTE
                            </Button>
                        </Grid>
                        }

                        {isLastStep() &&
                        <Grid item>
                            <Button
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setData(values);
                                    setOpen(true)
                                }}
                            >
                                Valider évaluation
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
                                {isSubmitting ? 'Submitting' : isLastStep() ? 'TERMINER' : 'PAGE SUIVANTE'}
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            }
        </Formik>
    </>
}
