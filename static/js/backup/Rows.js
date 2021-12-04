"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableHeading = TableHeading;
exports.RowEntries = RowEntries;
exports.getViewData = getViewData;

require("react-app-polyfill/ie11");

require("react-app-polyfill/stable");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getViewData(view, dataSource) {
  var filterZero = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var locations = Object.keys(dataSource);
  var postcodes = locations.filter(function (item) {
    return item.startsWith("2");
  });

  if (filterZero) {
    postcodes = postcodes.filter(function (item) {
      return dataSource[item][view] > 0;
    });
  }

  return postcodes.map(function mapPostcodeData(item) {
    return {
      postcode: item,
      suburbs: dataSource[item]["suburbs"].join(", "),
      cases: dataSource[item][view],
      recent: dataSource[item]["cases_recent"]
    };
  }).sort(function (a, b) {
    return b.cases > a.cases ? 1 : -1;
  }).map(function addRanking(item, index) {
    item["rank"] = index + 1;
    return item;
  });
}

function TableHeading(_ref) {
  var _ref$showRank = _ref.showRank,
      showRank = _ref$showRank === void 0 ? true : _ref$showRank;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "row headers mb-2"
  }, showRank ? /*#__PURE__*/_react.default.createElement("div", {
    className: "col-2"
  }, "Rank") : "", /*#__PURE__*/_react.default.createElement("div", {
    className: "col-6"
  }, "Postcode"), /*#__PURE__*/_react.default.createElement("div", {
    className: "col-2"
  }, "Cases"), /*#__PURE__*/_react.default.createElement("div", {
    className: "col-2"
  }, "Recent"));
}

function RowEntry(_ref2) {
  var rank = _ref2.rank,
      postcode = _ref2.postcode,
      suburbs = _ref2.suburbs,
      cases = _ref2.cases,
      recent = _ref2.recent,
      _ref2$showRank = _ref2.showRank,
      showRank = _ref2$showRank === void 0 ? true : _ref2$showRank;
  var rowClass = recent > 0 ? "row hot-entry" : "row rank-entry";
  return /*#__PURE__*/_react.default.createElement("div", {
    className: rowClass
  }, showRank ? /*#__PURE__*/_react.default.createElement("div", {
    className: "col-2"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "rank-number"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "h2"
  }, rank))) : "", /*#__PURE__*/_react.default.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "postcode"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "h2"
  }, /*#__PURE__*/_react.default.createElement("a", {
    href: "/postcode?location=".concat(postcode, "&days=").concat(daysSet)
  }, postcode))), /*#__PURE__*/_react.default.createElement("div", {
    className: "suburbs"
  }, suburbs)), /*#__PURE__*/_react.default.createElement("div", {
    className: "col-2"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "today-count mt-3"
  }, /*#__PURE__*/_react.default.createElement("h3", null, cases))), /*#__PURE__*/_react.default.createElement("div", {
    className: "col-2"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "new-cases mt-3"
  }, recent)));
}

function RowEntries(_ref3) {
  var rowData = _ref3.rowData,
      showRank = _ref3.showRank;
  var items = [];
  var keyNum = 0;
  rowData.forEach(function insertRowData(item) {
    keyNum++;
    items.push( /*#__PURE__*/_react.default.createElement(RowEntry, {
      rank: item.rank,
      postcode: item.postcode,
      suburbs: item.suburbs,
      cases: item.cases,
      recent: item.recent,
      showRank: showRank,
      key: keyNum
    }));
  });
  return /*#__PURE__*/_react.default.createElement("div", null, items);
}