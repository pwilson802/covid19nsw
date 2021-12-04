import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";

function SwitchButton({ text, onAction, buttonActive, view }) {
  let activeClass = buttonActive ? "active" : "";
  return (
    <div className="switch-button">
      <button
        className={`btn btn-outline-success my-2 my-sm-0 ${activeClass}`}
        onClick={() => onAction(view)}
      >
        {text}
      </button>
    </div>
  );
}

function AllNSWButton() {
  return (
    <div className="ml-3">
      <img src="/static/img/all_nsw.png" alt="all NSW link" />
    </div>
  );
}

function PageButtons({ buttonState, onAction, activeOn = true }) {
  let activeButton = (
    <SwitchButton
      text="Active"
      buttonActive={buttonState.active}
      onAction={onAction}
      view="active_cases"
    />
  );
  return (
    <div className="button-row">
      <SwitchButton
        text="All"
        buttonActive={buttonState.all}
        onAction={onAction}
        view="all_days"
      />
      <SwitchButton
        text="7 Days"
        buttonActive={buttonState.seven}
        onAction={onAction}
        view="seven_days"
      />
      <SwitchButton
        buttonActive={buttonState.one}
        text="1 Day"
        onAction={onAction}
        view="one_day"
      />
      {activeOn ? activeButton : ""}
    </div>
  );
}

function activeButton(button) {
  let result = {
    active: false,
    all: false,
    seven: false,
    one: false,
  };
  result[button] = true;
  return result;
}

export { SwitchButton, PageButtons, activeButton, AllNSWButton };
