"use strict";

function SwitchButton(_ref) {
  var text = _ref.text;

  return React.createElement(
    "div",
    { className: "col-2" },
    React.createElement(
      "button",
      { className: "btn btn-outline-success my-2 my-sm-0" },
      text
    )
  );
}

function CaseCount(_ref2) {
  var days = _ref2.days,
      count = _ref2.count;

  return React.createElement(
    "div",
    null,
    React.createElement(
      "h4",
      { className: "text-center all-count mt-1" },
      "Last ",
      days,
      " days:",
      count
    )
  );
}

function TableHeading() {
  return React.createElement(
    "div",
    { className: "row headers mb-2" },
    React.createElement(
      "div",
      { className: "col-2" },
      "Rank"
    ),
    React.createElement(
      "div",
      { className: "col-6" },
      "Postcode"
    ),
    React.createElement(
      "div",
      { className: "col-2" },
      "Cases"
    ),
    React.createElement(
      "div",
      { className: "col-2" },
      "Recent"
    )
  );
}

function RowEntry(_ref3) {
  var rank = _ref3.rank,
      postcode = _ref3.postcode,
      suburbs = _ref3.suburbs,
      count = _ref3.count,
      recent = _ref3.recent;

  return React.createElement(
    "div",
    { className: "row rank-entry" },
    React.createElement(
      "div",
      { className: "col-2" },
      React.createElement(
        "div",
        { className: "rank-number" },
        React.createElement(
          "div",
          { className: "h2" },
          rank
        )
      )
    ),
    React.createElement(
      "div",
      { className: "col-6" },
      React.createElement(
        "div",
        { className: "postcode" },
        React.createElement(
          "div",
          { className: "h2" },
          React.createElement(
            "a",
            { href: "#" },
            postcode
          )
        )
      ),
      React.createElement(
        "div",
        { className: "suburbs" },
        suburbs
      )
    ),
    React.createElement(
      "div",
      { className: "col-2" },
      React.createElement(
        "div",
        { className: "today-count mt-3" },
        React.createElement(
          "h3",
          null,
          count
        )
      )
    ),
    React.createElement(
      "div",
      { className: "col-2" },
      React.createElement(
        "div",
        { className: "new-cases mt-3" },
        recent
      )
    )
  );
}

function PageLayout(_ref4) {
  var dayView = _ref4.dayView;

  // make a function the changes the dayView and pass that function to the buttons
  //  also pass a prop to each buttom depneding on the button with the numbers to show
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(SwitchButton, { text: "Active" }),
        React.createElement(SwitchButton, { text: "All" }),
        React.createElement(SwitchButton, { text: "14 Days" }),
        React.createElement(SwitchButton, { text: "7 Days" })
      )
    ),
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(CaseCount, { days: "7", count: "53" }),
      React.createElement(TableHeading, null),
      React.createElement(RowEntry, {
        rank: "1",
        postcode: "2026",
        suburbs: "Ben Buckler, Bondi, Bondi Beach, North Bondi, Tamarama",
        count: "112",
        recent: "0"
      })
    )
  );
}

ReactDOM.render(React.createElement(PageLayout, null), document.querySelector("#root"));