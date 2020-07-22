function SwitchButton({ text, onAction, buttonActive, view }) {
  let activeClass = buttonActive ? "active" : "";
  return (
    <div className="col-2">
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
    <a className="ml-3" href={`/allnsw?days=${daysSet}`}>
      <img src="/static/img/all_nsw.png" alt="all NSW link" />
    </a>
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
    <div className="container">
      <div className="row">
        <SwitchButton
          text="All"
          buttonActive={buttonState.all}
          onAction={onAction}
          view="all_days"
        />
        <SwitchButton
          buttonActive={buttonState.fourteen}
          text="14 Days"
          onAction={onAction}
          view="fourteen_days"
        />
        <SwitchButton
          text="7 Days"
          buttonActive={buttonState.seven}
          onAction={onAction}
          view="seven_days"
        />
        {activeOn ? activeButton : ""}
      </div>
    </div>
  );
}

function activeButton(button) {
  let result = {
    active: false,
    all: false,
    seven: false,
    fourteen: false,
  };
  result[button] = true;
  return result;
}

export { SwitchButton, PageButtons, activeButton, AllNSWButton };
