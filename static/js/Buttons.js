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