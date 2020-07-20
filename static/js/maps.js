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

function PageButtons(_ref2) {
  var buttonState = _ref2.buttonState,
      onAction = _ref2.onAction;

  return React.createElement(
    "div",
    { className: "container" },
    React.createElement(
      "div",
      { className: "row" },
      React.createElement(SwitchButton, {
        text: "Active",
        buttonActive: buttonState.active,
        onAction: onAction,
        view: "active_cases"
      }),
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
      })
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
},{}],2:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Buttons = require("./Buttons");

function CasesMap(view) {
  return React.createElement("object", { type: "text/html", data: "map_all.html" });
}

function PageLayout() {
  // use state for the map to display
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
  return React.createElement(
    "div",
    null,
    React.createElement(_Buttons.PageButtons, { buttonState: state.buttonsActive, onAction: setView }),
    React.createElement(CasesMap, { view: state.dayView })
  );
}

ReactDOM.render(React.createElement(PageLayout, null), document.querySelector("#root"));
},{"./Buttons":1}]},{},[2]);
