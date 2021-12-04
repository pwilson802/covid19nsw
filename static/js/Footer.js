"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageFooter = PageFooter;

require("react-app-polyfill/ie11");

require("react-app-polyfill/stable");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PageFooter() {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "contact-message mt-5"
  }, /*#__PURE__*/_react.default.createElement("p", null, "The information on this website is updated as soon as new data is published by NSW Health which is usually once a day. The last update was at ", lastUpdate, ". For feedback on the website or to suggest a feature please contact", " ", /*#__PURE__*/_react.default.createElement("a", {
    href: "mailto:covid19nsw.stat@gmail.com"
  }, "covid19nsw.stat@gmail.com")));
}