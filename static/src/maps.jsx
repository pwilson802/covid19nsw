import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";

import { PageButtons, activeButton } from "./Buttons";

function PageLayout() {
  // use state for the map to display
  const [state, setState] = React.useState({
    dayView: "active_cases",
    buttonsActive: activeButton(daysSet),
  });
  const setView = (view) => {
    const daysMap = {
      active_cases: "active",
      all_days: "all",
      seven_days: "seven",
      fourteen_days: "fourteen",
    };
    const newValue = view;
    const newButtons = activeButton(daysMap[view]);
    setState({ dayView: newValue, buttonsActive: newButtons });
    daysSet = daysMap[view];
  };
  return (
    <div>
      <PageButtons buttonState={state.buttonsActive} onAction={setView} />
      <div dangerouslySetInnerHTML={template} />
    </div>
  );
}

ReactDOM.render(<PageLayout />, document.querySelector("#root"));
