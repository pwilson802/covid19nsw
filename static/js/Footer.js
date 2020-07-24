"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageFooter = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PageFooter() {
  return _react2.default.createElement(
    "div",
    { className: "contact-message mt-5" },
    _react2.default.createElement(
      "p",
      null,
      "The information on this website is updated as soon as new data is published by NSW Health which is usually once a day. The last update was at ",
      lastUpdate,
      ". For feedback on the website or to suggest a feature please contact",
      " ",
      _react2.default.createElement(
        "a",
        { href: "mailto:covid19nsw.stat@gmail.com" },
        "covid19nsw.stat@gmail.com"
      )
    )
  );
}

exports.PageFooter = PageFooter;