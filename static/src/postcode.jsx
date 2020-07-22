import { PageButtons, AllNSWButton, activeButton } from "./Buttons";
import { Pie } from "react-chartjs-2";

daysSet = daysSet == "active" ? "all" : daysSet;

const data = {
  labels: [
    "Overseas",
    "Interstate",
    "Locally (Known Source)",
    "Locally (Unknown Source)",
    "Under Investigation",
  ],
  datasets: [
    {
      data: [27, 6, 66, 13, 0],
      backgroundColor: ["#EB9D50", "#167E9E", "#BCBF56", "#9E6021", "#50C6EB"],
      hoverBackgroundColor: [
        "#EB9D50",
        "#167E9E",
        "#BCBF56",
        "#9E6021",
        "#50C6EB",
      ],
    },
  ],
};

function makeSourceData(view) {
  let overseas = postcodeData[view]["source"]["overseas"];
  let interstate = postcodeData[view]["source"]["interstate"];
  let locally_known =
    postcodeData[view]["source"][
      "locallyacquiredcontactofaconfirmedcaseandorinaknowncluster"
    ];
  let locally_unknown =
    postcodeData[view]["source"]["locallyacquiredsourcenotidentified"];
  let under_investigation =
    postcodeData[view]["cases"] -
    (overseas + interstate + locally_known + locally_unknown);
  return {
    labels: [
      "Overseas",
      "Interstate",
      "Locally (Known Source)",
      "Locally (Unknown Source)",
      "Under Investigation",
    ],
    datasets: [
      {
        data: [
          overseas,
          interstate,
          locally_known,
          locally_unknown,
          under_investigation,
        ],
        backgroundColor: [
          "#EB9D50",
          "#167E9E",
          "#FFB870",
          "#9E6021",
          "#50C6EB",
        ],
        hoverBackgroundColor: [
          "#EB9D50",
          "#167E9E",
          "#FFB870",
          "#9E6021",
          "#50C6EB",
        ],
      },
    ],
  };
}

function SourceChart({ view }) {
  let chartData = makeSourceData(view);
  return (
    <div className="infection-box">
      <h4 className="text-center postcode infection-heading">
        Infection Source
      </h4>
      <Pie data={chartData} />
    </div>
  );
}

function PostCodeHeading() {
  return <h1 className="postcode mt-3">{postcodeData["postcode"]}</h1>;
}

function SuburbsHeading() {
  return (
    <div className="suburbs my-auto ml-3">
      {postcodeData["suburbs"].join(", ")}
    </div>
  );
}

function PageHeading() {
  return (
    <div className="container">
      <div className="row">
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
  const recoveredCount = postcodeData["cases_recovered"];
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

function PageLayout() {
  // make a function the changes the dayView and pass that function to the buttons
  //  also pass a prop to each buttom depneding on the button with the numbers to show
  const [state, setState] = React.useState({
    dayView: "all_days",
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
  console.log(state);
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
          <div className="col-12 col-lg-6 my-auto">
            <CountStatDisplay view={state.dayView} />
          </div>
          <div className="col-12 col-lg-6 mt-2">
            <SourceChart view={state.dayView} />
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<PageLayout />, document.querySelector("#root"));
