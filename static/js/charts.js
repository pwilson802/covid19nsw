"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SourceChart = SourceChart;
exports.Charts = Charts;

require("react-app-polyfill/ie11");

require("react-app-polyfill/stable");

var _react = _interopRequireWildcard(require("react"));

var _reactChartjs = require("react-chartjs-2");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "infection-box"
  }, /*#__PURE__*/_react.default.createElement("h4", {
    className: "text-center postcode infection-heading"
  }, "Infection Source"), /*#__PURE__*/_react.default.createElement(_reactChartjs.Pie, {
    data: chartData,
    options: {
      tooltips: {
        titleFontSize: 32
      }
    }
  }));
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
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_reactChartjs.Line, {
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
  }));
}

function CasesBarChart() {
  var data = makeCasesChartData("cases_new");
  data["datasets"][0]["label"] = "Cases";
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_reactChartjs.Bar, {
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
  }));
}

function TestsBarChart() {
  var data = makeCasesChartData("tests_new");
  data["datasets"][0]["label"] = "Tests Completed";
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_reactChartjs.Bar, {
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
  }));
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
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("button", {
    className: "charts-button btn my-2 my-sm-0 ".concat(activeClass),
    onClick: function onClick() {
      return onAction(chartType);
    }
  }, text));
}

function ChartButtons(_ref3) {
  var buttonState = _ref3.buttonState,
      onAction = _ref3.onAction;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/_react.default.createElement(ChartButton, {
    onAction: onAction,
    text: "Cases Growth",
    chartType: "cases_line",
    buttonActive: buttonState.cases_line
  }), /*#__PURE__*/_react.default.createElement(ChartButton, {
    onAction: onAction,
    text: "Cases by Day",
    chartType: "cases_bar",
    buttonActive: buttonState.cases_bar
  }), /*#__PURE__*/_react.default.createElement(ChartButton, {
    onAction: onAction,
    text: "Testing",
    chartType: "tests_bar",
    buttonActive: buttonState.tests_bar
  })));
}

function CasesChart(_ref4) {
  var chartType = _ref4.chartType;

  if (chartType == "cases_line") {
    return /*#__PURE__*/_react.default.createElement(CasesLineChart, null);
  } else if (chartType == "cases_bar") {
    return /*#__PURE__*/_react.default.createElement(CasesBarChart, null);
  } else if (chartType == "tests_bar") {
    return /*#__PURE__*/_react.default.createElement(TestsBarChart, null);
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
    setChart({
      type: newChartType,
      buttonsActive: newButtons
    });
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "mt-3 container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "col-lg-8 charts-wrapper"
  }, /*#__PURE__*/_react.default.createElement(ChartButtons, {
    onAction: changeChart,
    buttonState: chart.buttonsActive
  }), /*#__PURE__*/_react.default.createElement(CasesChart, {
    chartType: chart.type
  }))));
}