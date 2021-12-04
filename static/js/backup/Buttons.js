"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwitchButton = SwitchButton;
exports.PageButtons = PageButtons;
exports.activeButton = activeButton;
exports.AllNSWButton = AllNSWButton;

require("react-app-polyfill/ie11");

require("react-app-polyfill/stable");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SwitchButton(_ref) {
  var text = _ref.text,
      onAction = _ref.onAction,
      buttonActive = _ref.buttonActive,
      view = _ref.view;
  var activeClass = buttonActive ? "active" : "";
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "switch-button"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "btn btn-outline-success my-2 my-sm-0 ".concat(activeClass),
    onClick: function onClick() {
      return onAction(view);
    }
  }, text));
}

function AllNSWButton() {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "ml-3"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: "/static/img/all_nsw.png",
    alt: "all NSW link"
  }));
}

function PageButtons(_ref2) {
  var buttonState = _ref2.buttonState,
      onAction = _ref2.onAction,
      _ref2$activeOn = _ref2.activeOn,
      activeOn = _ref2$activeOn === void 0 ? true : _ref2$activeOn;

  var activeButton = /*#__PURE__*/_react.default.createElement(SwitchButton, {
    text: "Active",
    buttonActive: buttonState.active,
    onAction: onAction,
    view: "active_cases"
  });

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "button-row"
  }, /*#__PURE__*/_react.default.createElement(SwitchButton, {
    text: "All",
    buttonActive: buttonState.all,
    onAction: onAction,
    view: "all_days"
  }), /*#__PURE__*/_react.default.createElement(SwitchButton, {
    buttonActive: buttonState.fourteen,
    text: "14 Days",
    onAction: onAction,
    view: "fourteen_days"
  }), /*#__PURE__*/_react.default.createElement(SwitchButton, {
    text: "7 Days",
    buttonActive: buttonState.seven,
    onAction: onAction,
    view: "seven_days"
  }), activeOn ? activeButton : "");
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