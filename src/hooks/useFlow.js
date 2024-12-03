import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  jumpToStep,
  setError,
  setSteps,
  stepBackward,
  stepForward,
} from "../state/slices/flowReducer";

function useFlow(initialSteps = []) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialSteps.length > 0) {
      dispatch(setSteps(initialSteps));
    }
  }, [initialSteps]);

  const currentStep = useSelector((s) => s.flow.currentStep);
  const conditions = useSelector((s) => s.flow.conditions);
  const error = useSelector((s) => s.flow.error);

  function next() {
    const conditionsMet = conditions[currentStep.name] ?? true;

    if (conditionsMet) {
      console.log("Conditions passed");
      dispatch(stepForward());
    } else {
      dispatch(setError("Please specify a location."));
    }
  }

  function back() {
    dispatch(stepBackward());
  }

  function jumpTo(step) {
    // all previous steps in chain should have conditions met
    let allConditionsMet = true;
    let prevStep = currentStep.prev;
    while (prevStep) {
      allConditionsMet =
        allConditionsMet && (conditions[prevStep.name] ?? true);
      prevStep = prevStep.prev;
    }

    if (allConditionsMet) {
      dispatch(jumpToStep(step));
    } else {
      dispatch(setError("Conditions not met"));
    }
  }

  return { currentStep, next, back, jumpTo, error };
}

export default useFlow;
