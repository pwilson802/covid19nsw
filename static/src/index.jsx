import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React, { useState } from "react";
import { render } from "react-dom";
import { PageButtons, AllNSWButton, activeButton } from "./Buttons";
import { TableHeading, RowEntries, getViewData } from "./Rows";

function countCases(rows) {
  let count = 0;
  rows.forEach((obj) => (count = count + obj.cases));
  return count;
}

function CaseCount({ caseCount }) {
  return (
    <div>
      <h4 className="postcode mt-3 text-center">Cases: {caseCount}</h4>
    </div>
  );
}

function PageLayout() {
  // make a function the changes the dayView and pass that function to the buttons
  //  also pass a prop to each buttom depneding on the button with the numbers to show
  const [state, setState] = useState({
    dayView: "active_cases",
    buttonsActive: activeButton(daysSet),
  });
  const setView = (view) => {
    const daysMap = {
      active_cases: "active",
      all_days: "all",
      seven_days: "seven",
      fourteen_days: "fourteen",
      one_day: "one",
    };
    const newValue = view;
    const newButtons = activeButton(daysMap[view]);
    setState({ dayView: newValue, buttonsActive: newButtons });
    daysSet = daysMap[view];
  };
  let rowData = getViewData(state.dayView, allData);
  // let caseCount = countCases(rowData);
  let caseCount = allData["all"][state.dayView];
  return (
    <div>
      <PageButtons buttonState={state.buttonsActive} onAction={setView} />
      <div className="container">
        <div className="container">
          <div className="row justify-content-center mt-3">
            <a className="all-nsw-link" href={`/allnsw?days=${daysSet}`}>
              <div className="container">
                <div className="row">
                  <CaseCount caseCount={caseCount} />
                  <AllNSWButton />
                </div>
              </div>
            </a>
          </div>
        </div>
        <TableHeading />
        <RowEntries rowData={rowData} />
      </div>
    </div>
  );
}

function makeCasesArray(days) {}

render(<PageLayout />, document.querySelector("#root"));
