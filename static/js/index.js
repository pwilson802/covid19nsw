"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var locations = Object.keys(allData);
var postcodes = locations.filter(function (item) {
  return item.startsWith("2");
});

function getViewData(data) {
  return postcodes.filter(function (item) {
    return allData[item][data] > 0;
  }).map(function mapPostcodeData(item) {
    return {
      postcode: item,
      suburbs: allData[item]["suburbs"].join(", "),
      cases: allData[item][data],
      recent: allData[item]["cases_recent"]
    };
  }).sort(function (a, b) {
    return b.cases > a.cases ? 1 : -1;
  }).map(function addRanking(item, index) {
    item["rank"] = index + 1;
    return item;
  });
}

function countCases(rows) {
  var count = 0;
  rows.forEach(function (obj) {
    return count = count + obj.cases;
  });
  return count;
}

function activeButton(button) {
  var result = {
    active: false,
    all: false,
    seven: false,
    fourteen: false
  };
  result[button] = true;
  return result;
}

function SwitchButton(_ref) {
  var text = _ref.text,
      onAction = _ref.onAction,
      buttonActive = _ref.buttonActive;

  var activeClass = buttonActive ? "active" : "";
  return React.createElement(
    "div",
    { className: "col-2" },
    React.createElement(
      "button",
      {
        className: "btn btn-outline-success my-2 my-sm-0 " + activeClass,
        onClick: onAction
      },
      text
    )
  );
}

function CaseCount(_ref2) {
  var caseCount = _ref2.caseCount;

  return React.createElement(
    "div",
    null,
    React.createElement(
      "h4",
      { className: "postcode mt-3 text-center" },
      "Cases: ",
      caseCount
    )
  );
}

function TableHeading() {
  return React.createElement(
    "div",
    { className: "row headers mb-2" },
    React.createElement(
      "div",
      { className: "col-2" },
      "Rank"
    ),
    React.createElement(
      "div",
      { className: "col-6" },
      "Postcode"
    ),
    React.createElement(
      "div",
      { className: "col-2" },
      "Cases"
    ),
    React.createElement(
      "div",
      { className: "col-2" },
      "Recent"
    )
  );
}

function RowEntry(_ref3) {
  var rank = _ref3.rank,
      postcode = _ref3.postcode,
      suburbs = _ref3.suburbs,
      cases = _ref3.cases,
      recent = _ref3.recent;

  var rowClass = recent > 0 ? "row hot-entry" : "row rank-entry";
  // if (recent > 0) {
  //   let rowClass = "row hot-entry";
  // } else {
  //   let rowClass = "row rank-entry";
  // }
  return React.createElement(
    "div",
    { className: rowClass },
    React.createElement(
      "div",
      { className: "col-2" },
      React.createElement(
        "div",
        { className: "rank-number" },
        React.createElement(
          "div",
          { className: "h2" },
          rank
        )
      )
    ),
    React.createElement(
      "div",
      { className: "col-6" },
      React.createElement(
        "div",
        { className: "postcode" },
        React.createElement(
          "div",
          { className: "h2" },
          React.createElement(
            "a",
            { href: "#" },
            postcode
          )
        )
      ),
      React.createElement(
        "div",
        { className: "suburbs" },
        suburbs
      )
    ),
    React.createElement(
      "div",
      { className: "col-2" },
      React.createElement(
        "div",
        { className: "today-count mt-3" },
        React.createElement(
          "h3",
          null,
          cases
        )
      )
    ),
    React.createElement(
      "div",
      { className: "col-2" },
      React.createElement(
        "div",
        { className: "new-cases mt-3" },
        recent
      )
    )
  );
}

function RowEntries(_ref4) {
  var rowData = _ref4.rowData;

  var items = [];
  rowData.forEach(function insertRowData(item) {
    items.push(React.createElement(RowEntry, {
      rank: item.rank,
      postcode: item.postcode,
      suburbs: item.suburbs,
      cases: item.cases,
      recent: item.recent
    }));
  });
  return React.createElement(
    "div",
    null,
    items
  );
}

function PageLayout() {
  // make a function the changes the dayView and pass that function to the buttons
  var _React$useState = React.useState({
    dayView: "active_cases",
    buttonsActive: activeButton(daysSet)
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      state = _React$useState2[0],
      setState = _React$useState2[1];

  var setAll = function setAll() {
    var newValue = "all_days";
    var newButtons = activeButton("all");
    setState({ dayView: newValue, buttonsActive: newButtons });
  };
  var setSeven = function setSeven() {
    var newValue = "seven_days";
    var newButtons = activeButton("seven");
    setState({ dayView: newValue, buttonsActive: newButtons });
  };
  var setFourteen = function setFourteen() {
    var newValue = "fourteen_days";
    var newButtons = activeButton("fourteen");
    setState({ dayView: newValue, buttonsActive: newButtons });
  };
  var setActive = function setActive() {
    var newValue = "active_cases";
    var newButtons = activeButton("active");
    setState({ dayView: newValue, buttonsActive: newButtons });
  };
  var rowData = getViewData(state.dayView);
  var caseCount = countCases(rowData);
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(SwitchButton, {
          text: "Active",
          buttonActive: state.buttonsActive.active,
          onAction: setActive
        }),
        React.createElement(SwitchButton, {
          text: "All",
          buttonActive: state.buttonsActive.all,
          onAction: setAll
        }),
        React.createElement(SwitchButton, {
          buttonActive: state.buttonsActive.fourteen,
          text: "14 Days",
          onAction: setFourteen
        }),
        React.createElement(SwitchButton, {
          text: "7 Days",
          buttonActive: state.buttonsActive.seven,
          onAction: setSeven
        })
      )
    ),
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(CaseCount, { caseCount: caseCount }),
      React.createElement(TableHeading, null),
      React.createElement(RowEntries, { rowData: rowData })
    )
  );
}

function makeCasesArray(days) {}

ReactDOM.render(React.createElement(PageLayout, null), document.querySelector("#root"));