import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe } from "vitest";
import { store } from "../../../../state/store.js";
import steps from "../../../../steps.js";
import StepperFlow from "../StepperFlow.jsx";

vi.mock("../../../../hooks/useFlow", { spy: true });

describe("StepperFlow tests", () => {
  // create a react-redux wrapper
  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  it("should render Desktop stepper with clickable step", async () => {
    const { getByText, findByText } = render(<StepperFlow steps={steps} />, {
      wrapper,
    });
    act(() => {
      getByText("Intake").click();
    });
    await findByText("Intake");
  });

  it("should have a finish button that completes step if last step", async () => {
    const oneStep = [
      {
        id: 0,
        name: "intake",
        label: "Intake",
        prev: undefined,
        next: undefined,
      },
    ];
    const { getByText, findByText } = render(<StepperFlow steps={oneStep} />, {
      wrapper,
    });
    act(() => {
      getByText("Finish").click();
    });
    await findByText("All steps completed - you're finished");
  });

  it("should have a complete button that completes step if not last step", async () => {
    const { getByText } = render(<StepperFlow steps={steps} />, {
      wrapper,
    });
    act(() => {
      getByText("Complete Step").click();
    });
  });
});
