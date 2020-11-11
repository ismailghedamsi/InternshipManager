import {Button, CircularProgress, Grid, Step, StepLabel, Stepper} from '@material-ui/core';
import {Form, Formik} from 'formik';
import React, {useState} from 'react';
import EvaluationModal from '../../Utils/EvaluationModal';

export function FormikStepper({children, ...props}) {
    const childrenArray = React.Children.toArray(children);
    const [step, setStep] = useState(0);
    const currentChild = childrenArray[step];
    const [completed, setCompleted] = useState(false);
    const [data, setData] = useState({});
    const [isOpen, setOpen] = useState(false);

    function isLastStep() {
        return step === childrenArray.length - 1;
    }


    return (
            <>
                <EvaluationModal isOpen={isOpen} data={data}/>
                <Formik
                        {...props}
                        validationSchema={currentChild.props.validationSchema}
                        onSubmit={async (values, helpers) => {
                            if (isLastStep()) {
                                await props.onSubmit(values, helpers);
                                setCompleted(true);
                            } else {
                                setStep((s) => s + 1);
                            }
                        }}
                >
                    {({isSubmitting, values}) => (
                            <Form autoComplete="off">
                                <Stepper alternativeLabel activeStep={step}>
                                    {childrenArray.map((child, index) => (
                                            <Step key={child.props.label} completed={step > index || completed}>
                                                <StepLabel>{child.props.label}</StepLabel>
                                            </Step>
                                    ))}
                                </Stepper>

                                {currentChild}

                                <Grid container spacing={2}>
                                    {step > 0 ? (
                                            <Grid item>
                                                <Button
                                                        disabled={isSubmitting}
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => setStep((s) => s - 1)}
                                                >
                                                    Back
                                                </Button>
                                            </Grid>
                                    ) : null}

                                    {
                                        isLastStep() ? (
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
                                                        Valider evaluation
                                                    </Button>
                                                </Grid>
                                        ) : null
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
                    )}
                </Formik>
            </>
    );
}