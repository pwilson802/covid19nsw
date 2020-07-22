(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function SwitchButton(_ref) {
  var text = _ref.text,
      onAction = _ref.onAction,
      buttonActive = _ref.buttonActive,
      view = _ref.view;

  var activeClass = buttonActive ? "active" : "";
  return React.createElement(
    "div",
    { className: "col-2" },
    React.createElement(
      "button",
      {
        className: "btn btn-outline-success my-2 my-sm-0 " + activeClass,
        onClick: function onClick() {
          return onAction(view);
        }
      },
      text
    )
  );
}

function AllNSWButton() {
  return React.createElement(
    "a",
    { className: "ml-3", href: "/allnsw?days=" + daysSet },
    React.createElement("img", { src: "/static/img/all_nsw.png", alt: "all NSW link" })
  );
}

function PageButtons(_ref2) {
  var buttonState = _ref2.buttonState,
      onAction = _ref2.onAction,
      _ref2$activeOn = _ref2.activeOn,
      activeOn = _ref2$activeOn === undefined ? true : _ref2$activeOn;

  var activeButton = React.createElement(SwitchButton, {
    text: "Active",
    buttonActive: buttonState.active,
    onAction: onAction,
    view: "active_cases"
  });
  return React.createElement(
    "div",
    { className: "container" },
    React.createElement(
      "div",
      { className: "row" },
      React.createElement(SwitchButton, {
        text: "All",
        buttonActive: buttonState.all,
        onAction: onAction,
        view: "all_days"
      }),
      React.createElement(SwitchButton, {
        buttonActive: buttonState.fourteen,
        text: "14 Days",
        onAction: onAction,
        view: "fourteen_days"
      }),
      React.createElement(SwitchButton, {
        text: "7 Days",
        buttonActive: buttonState.seven,
        onAction: onAction,
        view: "seven_days"
      }),
      activeOn ? activeButton : ""
    )
  );
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

exports.SwitchButton = SwitchButton;
exports.PageButtons = PageButtons;
exports.activeButton = activeButton;
exports.AllNSWButton = AllNSWButton;
},{}],2:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Buttons = require("./Buttons");

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

// function activeButton(button) {
//   let result = {
//     active: false,
//     all: false,
//     seven: false,
//     fourteen: false,
//   };
//   result[button] = true;
//   return result;
// }

function CaseCount(_ref) {
  var caseCount = _ref.caseCount;

  return React.createElement(
    "div",
    null,
    React.createElement(
      "a",
      { href: "/allnsw?days=" + daysSet },
      React.createElement(
        "h4",
        { className: "postcode mt-3 text-center" },
        "Cases: ",
        caseCount
      )
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

function RowEntry(_ref2) {
  var rank = _ref2.rank,
      postcode = _ref2.postcode,
      suburbs = _ref2.suburbs,
      cases = _ref2.cases,
      recent = _ref2.recent;

  var rowClass = recent > 0 ? "row hot-entry" : "row rank-entry";
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
            { href: "/postcode?location=" + postcode + "&days=" + daysSet },
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

function RowEntries(_ref3) {
  var rowData = _ref3.rowData;

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
    buttonsActive: (0, _Buttons.activeButton)(daysSet)
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      state = _React$useState2[0],
      setState = _React$useState2[1];

  var setView = function setView(view) {
    var daysMap = {
      active_cases: "active",
      all_days: "all",
      seven_days: "seven",
      fourteen_days: "fourteen"
    };
    var newValue = view;
    var newButtons = (0, _Buttons.activeButton)(daysMap[view]);
    setState({ dayView: newValue, buttonsActive: newButtons });
    daysSet = daysMap[view];
  };
  var rowData = getViewData(state.dayView);
  var caseCount = countCases(rowData);
  return React.createElement(
    "div",
    null,
    React.createElement(_Buttons.PageButtons, { buttonState: state.buttonsActive, onAction: setView }),
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "container" },
        React.createElement(
          "div",
          { className: "row justify-content-center mt-3" },
          React.createElement(CaseCount, { caseCount: caseCount }),
          React.createElement(_Buttons.AllNSWButton, null)
        )
      ),
      React.createElement(TableHeading, null),
      React.createElement(RowEntries, { rowData: rowData })
    )
  );
}

function makeCasesArray(days) {}

ReactDOM.render(React.createElement(PageLayout, null), document.querySelector("#root"));
},{"./Buttons":1}]},{},[2]);
