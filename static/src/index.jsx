import { PageButtons } from "./Buttons";

const locations = Object.keys(allData);
const postcodes = locations.filter((item) => item.startsWith("2"));

function getViewData(data) {
  return postcodes
    .filter((item) => allData[item][data] > 0)
    .map(function mapPostcodeData(item) {
      return {
        postcode: item,
        suburbs: allData[item]["suburbs"].join(", "),
        cases: allData[item][data],
        recent: allData[item]["cases_recent"],
      };
    })
    .sort((a, b) => (b.cases > a.cases ? 1 : -1))
    .map(function addRanking(item, index) {
      item["rank"] = index + 1;
      return item;
    });
}

function countCases(rows) {
  let count = 0;
  rows.forEach((obj) => (count = count + obj.cases));
  return count;
}

function activeButton(button) {
  let result = {
    active: false,
    all: false,
    seven: false,
    fourteen: false,
  };
  result[button] = true;
  return result;
}

function CaseCount({ caseCount }) {
  return (
    <div>
      <h4 className="postcode mt-3 text-center">Cases: {caseCount}</h4>
    </div>
  );
}

function TableHeading() {
  return (
    <div className="row headers mb-2">
      <div className="col-2">Rank</div>
      <div className="col-6">Postcode</div>
      <div className="col-2">Cases</div>
      <div className="col-2">Recent</div>
    </div>
  );
}

function RowEntry({ rank, postcode, suburbs, cases, recent }) {
  let rowClass = recent > 0 ? "row hot-entry" : "row rank-entry";
  return (
    <div className={rowClass}>
      <div className="col-2">
        <div className="rank-number">
          <div className="h2">{rank}</div>
        </div>
      </div>

      <div className="col-6">
        <div className="postcode">
          <div className="h2">
            <a href={`/postcode?location=${postcode}&days=${daysSet}`}>
              {postcode}
            </a>
          </div>
        </div>
        <div className="suburbs">{suburbs}</div>
      </div>

      <div className="col-2">
        <div className="today-count mt-3">
          <h3>{cases}</h3>
        </div>
      </div>

      <div className="col-2">
        <div className="new-cases mt-3">{recent}</div>
      </div>
    </div>
  );
}

function RowEntries({ rowData }) {
  const items = [];
  rowData.forEach(function insertRowData(item) {
    items.push(
      <RowEntry
        rank={item.rank}
        postcode={item.postcode}
        suburbs={item.suburbs}
        cases={item.cases}
        recent={item.recent}
      />
    );
  });
  return <div>{items}</div>;
}

function PageLayout() {
  // make a function the changes the dayView and pass that function to the buttons
  //  also pass a prop to each buttom depneding on the button with the numbers to show
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
  let rowData = getViewData(state.dayView);
  let caseCount = countCases(rowData);
  return (
    <div>
      <PageButtons buttonState={state.buttonsActive} onAction={setView} />
      <div className="container">
        <CaseCount caseCount={caseCount} />
        <TableHeading />
        <RowEntries rowData={rowData} />
      </div>
    </div>
  );
}

function makeCasesArray(days) {}

ReactDOM.render(<PageLayout />, document.querySelector("#root"));
