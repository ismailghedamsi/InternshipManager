import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from "@material-ui/core/Typography";
import React, {useState} from 'react';
import useStyles from "../../Utils/useStyles";
import OfferIdentificationForm from "./OfferIdentificationForm";
import Button from "@material-ui/core/Button";
import EvaluationForm from "./EvaluationForm";
import CommentForm from "./CommentForm";
import SignEvaluationForm from "./SignEvaluationForm";
import GeneralAssessmentForm from "./GeneralAssessmentForm";


export default function BusinessEvaluationStepper() {
    const classes = useStyles();
    const steps = getSteps();
    const [activeStep, setActiveStep] = useState(0);

    function getSteps() {
        return [
            "IDENTIFICATION DE L’ENTREPRISE",
            "IDENTIFICATION DU STAGIAIRE",
            "ÉVALUATION",
            "COMMENTAIRES",
            "OBSERVATIONS GÉNÉRALES",
            "Signature"
        ];
    }

    function getStepContent(step) {
        switch (step) {
            case 0:
                return ""
            case 1:
                return <OfferIdentificationForm/>
            case 2:
                return <EvaluationForm/>;
            case 3:
                return <CommentForm/>;
            case 4:
                return <GeneralAssessmentForm/>;
            case 5:
                return <SignEvaluationForm/>;
            default:
                return "Unknown step";
        }
    }

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return <div className={classes.container} style={{overflow: "auto", height: "100%"}}>
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => <Step key={label}>
                <StepLabel>{label}</StepLabel>
            </Step>)}
        </Stepper>
        <div>
            {activeStep === steps.length ?
                <div>
                    <Typography variant={"h3"}>L'évaluation est terminé</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReset}
                    >
                        TERMINER
                    </Button>
                </div>
                :
                <div>
                    <Typography>{getStepContent(activeStep)}</Typography>
                    <div>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            PAGE PRÉCÉDENTE
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                        >
                            PAGE SUIVANTE
                        </Button>
                    </div>
                </div>}
        </div>
    </div>;
}