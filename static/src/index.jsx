function SwitchButton({ text }) {
  return (
    <div className="col-2">
      <button className="btn btn-outline-success my-2 my-sm-0">{text}</button>
    </div>
  );
}

function CaseCount({ days, count }) {
  return (
    <div>
      <h4 className="text-center all-count mt-1">
        Last {days} days:{count}
      </h4>
    </div>
  );
}

function TableHeading() {
  return (
    <div className="row headers mb-2">
      <div className="col-2">Rank</div>
      <div className="col-6">Postcode</div>
      <div className="col-2">Cases</div>
      <div className="col-2">Recent</div>
    </div>
  );
}

function RowEntry({ rank, postcode, suburbs, count, recent }) {
  return (
    <div className="row rank-entry">
      <div className="col-2">
        <div className="rank-number">
          <div className="h2">{rank}</div>
        </div>
      </div>

      <div className="col-6">
        <div className="postcode">
          <div className="h2">
            <a href="#">{postcode}</a>
          </div>
        </div>
        <div className="suburbs">{suburbs}</div>
      </div>

      <div className="col-2">
        <div className="today-count mt-3">
          <h3>{count}</h3>
        </div>
      </div>

      <div className="col-2">
        <div className="new-cases mt-3">{recent}</div>
      </div>
    </div>
  );
}

function PageLayout({ dayView }) {
  // make a function the changes the dayView and pass that function to the buttons
  //  also pass a prop to each buttom depneding on the button with the numbers to show
  return (
    <div>
      <div className="container">
        <div className="row">
          <SwitchButton text="Active" />
          <SwitchButton text="All" />
          <SwitchButton text="14 Days" />
          <SwitchButton text="7 Days" />
        </div>
      </div>
      <div className="container">
        <CaseCount days="7" count="53" />
        <TableHeading />
        <RowEntry
          rank="1"
          postcode="2026"
          suburbs="Ben Buckler, Bondi, Bondi Beach, North Bondi, Tamarama"
          count="112"
          recent="0"
        />
      </div>
    </div>
  );
}

ReactDOM.render(<PageLayout />, document.querySelector("#root"));
