"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Charts = exports.SourceChart = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require("react-chartjs-2");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeSourceData(view) {
  var overseas = postcodeData[view]["source"]["overseas"];
  var interstate = postcodeData[view]["source"]["interstate"];
  var locally_known = postcodeData[view]["source"]["locallyacquiredcontactofaconfirmedcaseandorinaknowncluster"];
  var locally_unknown = postcodeData[view]["source"]["locallyacquiredsourcenotidentified"];
  var under_investigation = postcodeData[view]["cases"] - (overseas + interstate + locally_known + locally_unknown);
  return {
    labels: ["Overseas", "Interstate", "Locally (Known Source)", "Locally (Unknown Source)", "Under Investigation"],
    datasets: [{
      data: [overseas, interstate, locally_known, locally_unknown, under_investigation],
      backgroundColor: ["#EB9D50", "#167E9E", "#52A874", "#9E6021", "#50C6EB"],
      hoverBackgroundColor: ["#EB9D50", "#167E9E", "#52A874", "#9E6021", "#50C6EB"]
    }]
  };
}

function SourceChart(_ref) {
  var view = _ref.view;

  var chartData = makeSourceData(view);
  return _react2.default.createElement(
    "div",
    { className: "infection-box" },
    _react2.default.createElement(
      "h4",
      { className: "text-center postcode infection-heading" },
      "Infection Source"
    ),
    _react2.default.createElement(_reactChartjs.Pie, { data: chartData })
  );
}

function makeCasesChartData(dataType) {
  var data = [];
  Object.keys(postcodeData["history"]).forEach(function (item) {
    var _item$split = item.split("-"),
        _item$split2 = _slicedToArray(_item$split, 3),
        year = _item$split2[0],
        month = _item$split2[1],
        day = _item$split2[2];

    month = month - 1;
    var caseDate = new Date(year, month, day);
    data.push({
      t: caseDate,
      y: postcodeData["history"][item][dataType]
    });
  });
  data.sort(function (a, b) {
    return a.t - b.t;
  });
  return {
    datasets: [{
      label: "All Cases",
      backgroundColor: "rgba(187, 50, 0, 0.2)",
      borderColor: "rgba(187, 50, 0, 1)",
      data: data
    }]
  };
}

function CasesLineChart() {
  var data = makeCasesChartData("cases_all");
  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(_reactChartjs.Line, {
      data: data,
      options: {
        scales: {
          xAxes: [{
            type: "time",
            time: {
              unit: "day",
              tooltipFormat: "MMM D"
            }
          }]
        }
      }
    })
  );
}

function CasesBarChart() {
  var data = makeCasesChartData("cases_new");
  data["datasets"][0]["label"] = "Cases";
  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(_reactChartjs.Bar, {
      data: data,
      options: {
        scales: {
          xAxes: [{
            type: "time",
            time: {
              unit: "day",
              tooltipFormat: "MMM D"
            }
          }]
        }
      }
    })
  );
}

function TestsBarChart() {
  var data = makeCasesChartData("tests_new");
  data["datasets"][0]["label"] = "Tests Completed";
  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(_reactChartjs.Bar, {
      data: data,
      options: {
        scales: {
          xAxes: [{
            type: "time",
            time: {
              unit: "day",
              tooltipFormat: "MMM D"
            }
          }]
        }
      }
    })
  );
}

function ChartActiveButton(button) {
  var result = {
    cases_line: false,
    cases_bar: false,
    tests_bar: false,
    race_bar: false
  };
  result[button] = true;
  return result;
}

function ChartButton(_ref2) {
  var onAction = _ref2.onAction,
      text = _ref2.text,
      chartType = _ref2.chartType,
      buttonActive = _ref2.buttonActive;

  var activeClass = buttonActive ? "chart-active-button" : "";
  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(
      "button",
      {
        className: "charts-button btn my-2 my-sm-0 " + activeClass,
        onClick: function onClick() {
          return onAction(chartType);
        }
      },
      text
    )
  );
}

function ChartButtons(_ref3) {
  var buttonState = _ref3.buttonState,
      onAction = _ref3.onAction;

  return _react2.default.createElement(
    "div",
    { className: "container" },
    _react2.default.createElement(
      "div",
      { className: "row justify-content-center" },
      _react2.default.createElement(ChartButton, {
        onAction: onAction,
        text: "Cases Growth",
        chartType: "cases_line",
        buttonActive: buttonState.cases_line
      }),
      _react2.default.createElement(ChartButton, {
        onAction: onAction,
        text: "Cases by Day",
        chartType: "cases_bar",
        buttonActive: buttonState.cases_bar
      }),
      _react2.default.createElement(ChartButton, {
        onAction: onAction,
        text: "Testing",
        chartType: "tests_bar",
        buttonActive: buttonState.tests_bar
      })
    )
  );
}

function CasesChart(_ref4) {
  var chartType = _ref4.chartType;

  if (chartType == "cases_line") {
    return _react2.default.createElement(CasesLineChart, null);
  } else if (chartType == "cases_bar") {
    return _react2.default.createElement(CasesBarChart, null);
  } else if (chartType == "tests_bar") {
    return _react2.default.createElement(TestsBarChart, null);
  }
}

function Charts() {
  var _useState = (0, _react.useState)({
    type: "cases_line",
    buttonsActive: ChartActiveButton("cases_line")
  }),
      _useState2 = _slicedToArray(_useState, 2),
      chart = _useState2[0],
      setChart = _useState2[1];

  var changeChart = function changeChart(chartType) {
    var newChartType = chartType;
    var newButtons = ChartActiveButton(chartType);
    setChart({ type: newChartType, buttonsActive: newButtons });
  };
  return _react2.default.createElement(
    "div",
    { className: "mt-3 container" },
    _react2.default.createElement(
      "div",
      { className: "row justify-content-center" },
      _react2.default.createElement(
        "div",
        { className: "col-lg-8 charts-wrapper" },
        _react2.default.createElement(ChartButtons, {
          onAction: changeChart,
          buttonState: chart.buttonsActive
        }),
        _react2.default.createElement(CasesChart, { chartType: chart.type })
      )
    )
  );
}

exports.SourceChart = SourceChart;
exports.Charts = Charts;