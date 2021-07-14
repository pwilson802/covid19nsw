import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";

function getViewData(view, dataSource, filterZero = true) {
  const locations = Object.keys(dataSource);
  let postcodes = locations.filter((item) => item.startsWith("2"));
  if (filterZero) {
    postcodes = postcodes.filter((item) => dataSource[item][view] > 0);
  }
  return postcodes
    .map(function mapPostcodeData(item) {
      return {
        postcode: item,
        suburbs: dataSource[item]["suburbs"].join(", "),
        cases: dataSource[item][view],
        recent: dataSource[item]["cases_recent"],
      };
    })
    .sort((a, b) => (b.cases > a.cases ? 1 : -1))
    .map(function addRanking(item, index) {
      item["rank"] = index + 1;
      return item;
    });
}

function TableHeading({ showRank = true }) {
  return (
    <div className="row headers mb-2">
      {showRank ? <div className="col-2">Rank</div> : ""}
      <div className="col-6">Postcode</div>
      <div className="col-2">Cases</div>
      <div className="col-2">Recent</div>
    </div>
  );
}

function RowEntry({ rank, postcode, suburbs, cases, recent, showRank = true }) {
  let rowClass = recent > 0 ? "row hot-entry" : "row rank-entry";
  return (
    <div className={rowClass}>
      {showRank ? (
        <div className="col-2">
          <div className="rank-number">
            <div className="h2">{rank}</div>
          </div>
        </div>
      ) : (
        ""
      )}

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

function RowEntries({ rowData, showRank }) {
  const items = [];
  let keyNum = 0;
  rowData.forEach(function insertRowData(item) {
    keyNum++;
    items.push(
      <RowEntry
        rank={item.rank}
        postcode={item.postcode}
        suburbs={item.suburbs}
        cases={item.cases}
        recent={item.recent}
        showRank={showRank}
        key={keyNum}
      />
    );
  });
  return <div>{items}</div>;
}

export { TableHeading, RowEntries, getViewData };
