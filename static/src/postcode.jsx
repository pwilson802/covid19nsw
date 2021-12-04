import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React, { useState } from "react";
import { render } from "react-dom";
import { PageButtons, AllNSWButton, activeButton } from "./Buttons";
import { Charts } from "./Charts";
import { TableHeading, RowEntries, getViewData } from "./Rows";
import { PageFooter } from "./Footer";

daysSet = daysSet == "active" ? "all" : daysSet;
let pageType = postcodeData["postcode"].startsWith("2") ? "postcode" : "allNSW";

function PostCodeHeading() {
  if (pageType == "postcode") {
    return <h1 className="postcode mt-3">{postcodeData["postcode"]}</h1>;
  }
  return <h1 className="postcode mt-3">All NSW</h1>;
}

function SuburbsHeading() {
  if (pageType == "postcode") {
    return (
      <div className="suburbs my-auto ml-3">
        {postcodeData["suburbs"].join(", ")}
      </div>
    );
  }
  return "";
}

function PageHeading() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <PostCodeHeading />
        <SuburbsHeading />
      </div>
    </div>
  );
}

function DisplayNumber({ countType, count }) {
  return (
    <div>
      <h4 className="postcode mt-3 top-count-label top-count text-center">
        {countType}{" "}
      </h4>
      <h4 className="postcode mt-3 top-count-number top-count text-center">
        {count}
      </h4>
    </div>
  );
}

function CountStatDisplay({ view }) {
  const activeCount = postcodeData["cases_active"];
  const recentCount = postcodeData["cases_recent"];
  const casesCount = postcodeData[view]["cases"];
  const testsCount = postcodeData[view]["tests"];
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="top-box">
          <DisplayNumber countType="Cases" count={casesCount} />{" "}
        </div>
        <div className="top-box">
          <DisplayNumber countType="Tests" count={testsCount} />{" "}
        </div>
        <div className="top-box">
          <DisplayNumber countType="Active" count={activeCount} />{" "}
        </div>
        <div className="top-box">
          <DisplayNumber countType="Recent" count={recentCount} />{" "}
        </div>
      </div>
    </div>
  );
}

function ClosePostcodes({ view }) {
  let rowData = getViewData(view, closePostcodeData, false);
  return (
    <div className="container mt-5">
      <h3 className="postcode text-center">Close Suburbs</h3>
      <TableHeading showRank={false} />
      <RowEntries rowData={rowData} showRank={false} />
    </div>
  );
}

function Addclosepostcode({ view }) {
  if (postcodeData.postcode.startsWith("2")) {
    return <ClosePostcodes view={view} />;
  }
  return "";
}

function StatsExplanation() {
  return (
    <div>
      <p className="active-explanation mt-2 mb-0">
        - Active is locally acquired COVID-19 cases with onset in the last four
        weeks.
      </p>
      <p className="active-explanation">
        - Recent is any case in the last 3-4 days.
      </p>
    </div>
  );
}

function getDayView() {
  const daysViewMap = {
    active: "all_days",
    all: "all_days",
    seven: "seven_days",
    fourteen: "fourteen_days"
  };
  let result = daysViewMap[daysSet];
  return result;
}

function PageLayout() {
  const [state, setState] = useState({
    dayView: getDayView(),
    buttonsActive: activeButton(daysSet),
  });
  const setView = (view) => {
    const daysMap = {
      active_cases: "active",
      all_days: "all",
      seven_days: "seven"
    };
    const newValue = view;
    const newButtons = activeButton(daysMap[view]);
    setState({ dayView: newValue, buttonsActive: newButtons });
    daysSet = daysMap[view];
  };
  return (
    <div>
      <PageButtons
        buttonState={state.buttonsActive}
        onAction={setView}
        activeOn={false}
      />
      <PageHeading />
      <div className="container">
        <div className="row">
          {/* <div className="col-12 col-lg-6 my-auto"> */}
            <CountStatDisplay view={state.dayView} />
            <StatsExplanation />
          {/* </div> */}
          {/* <div className="col-12 col-lg-6 mt-2">
            <SourceChart view={state.dayView} />
          </div> */}
        </div>
      </div>
      {/* <Charts /> */}
      <Addclosepostcode view={state.dayView} />
      <PageFooter />
    </div>
  );
}

render(<PageLayout />, document.querySelector("#root"));
