import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React, { useState } from "react";
import { Pie, Line, Bar } from "react-chartjs-2";
import Nouislider from "nouislider-react";

function makeSourceData(view) {
  let overseas = postcodeData[view]["source"]["overseas"];
  let interstate = postcodeData[view]["source"]["interstate"];
  let locally_known =
    postcodeData[view]["source"][
      "locallyacquiredcontactofaconfirmedcaseandorinaknowncluster"
    ];
  let locally_unknown =
    postcodeData[view]["source"]["locallyacquiredsourcenotidentified"];
  let under_investigation =
    postcodeData[view]["cases"] -
    (overseas + interstate + locally_known + locally_unknown);
  return {
    labels: [
      "Overseas",
      "Interstate",
      "Locally (Known Source)",
      "Locally (Unknown Source)",
      "Under Investigation",
    ],
    datasets: [
      {
        data: [
          overseas,
          interstate,
          locally_known,
          locally_unknown,
          under_investigation,
        ],
        backgroundColor: [
          "#EB9D50",
          "#167E9E",
          "#52A874",
          "#9E6021",
          "#50C6EB",
        ],
        hoverBackgroundColor: [
          "#EB9D50",
          "#167E9E",
          "#52A874",
          "#9E6021",
          "#50C6EB",
        ],
      },
    ],
  };
}

function SourceChart({ view }) {
  let chartData = makeSourceData(view);
  return (
    <div className="infection-box">
      <h4 className="text-center postcode infection-heading">
        Infection Source
      </h4>
      <Pie
        data={chartData}
        options={{
          tooltips: {
            titleFontSize: 32,
          },
        }}
      />
    </div>
  );
}

function makeCasesChartData(dataType, dates) {
  let firstDate = new Date(Number(dates.start));
  let lastDate = new Date(Number(dates.end));
  let data = [];
  Object.keys(postcodeData["history"]).forEach((item) => {
    let [year, month, day] = item.split("-");
    month = month - 1;
    let caseDate = new Date(year, month, day);
    if (caseDate > firstDate && caseDate < lastDate) {
      data.push({
        t: caseDate,
        y: postcodeData["history"][item][dataType],
      });
    }
  });
  data.sort((a, b) => a.t - b.t);
  return {
    datasets: [
      {
        label: "All Cases",
        backgroundColor: "rgba(187, 50, 0, 0.2)",
        borderColor: "rgba(187, 50, 0, 1)",
        data: data,
      },
    ],
  };
}

function CasesLineChart({ dates }) {
  const data = makeCasesChartData("cases_all", dates);
  return (
    <div>
      <Line
        data={data}
        options={{
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  unit: "day",
                  tooltipFormat: "MMM D",
                },
              },
            ],
          },
        }}
      />
    </div>
  );
}

function CasesBarChart({ dates }) {
  const data = makeCasesChartData("cases_new", dates);
  data["datasets"][0]["label"] = "Cases";
  return (
    <div>
      <Bar
        data={data}
        options={{
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  unit: "day",
                  tooltipFormat: "MMM D",
                },
              },
            ],
          },
        }}
      />
    </div>
  );
}

function TestsBarChart({ dates }) {
  const data = makeCasesChartData("tests_new", dates);
  data["datasets"][0]["label"] = "Tests Completed";
  return (
    <div>
      <Bar
        data={data}
        options={{
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  unit: "day",
                  tooltipFormat: "MMM D",
                },
              },
            ],
          },
        }}
      />
    </div>
  );
}

function ChartActiveButton(button) {
  let result = {
    cases_line: false,
    cases_bar: false,
    tests_bar: false,
    race_bar: false,
  };
  result[button] = true;
  return result;
}

function ChartButton({ onAction, text, chartType, buttonActive }) {
  let activeClass = buttonActive ? "chart-active-button" : "";
  return (
    <div>
      <button
        className={`charts-button btn my-2 my-sm-0 ${activeClass}`}
        onClick={() => onAction(chartType)}
      >
        {text}
      </button>
    </div>
  );
}

function ChartButtons({ buttonState, onAction }) {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <ChartButton
          onAction={onAction}
          text="Cases Growth"
          chartType="cases_line"
          buttonActive={buttonState.cases_line}
        />
        <ChartButton
          onAction={onAction}
          text="Cases by Day"
          chartType="cases_bar"
          buttonActive={buttonState.cases_bar}
        />
        <ChartButton
          onAction={onAction}
          text="Testing"
          chartType="tests_bar"
          buttonActive={buttonState.tests_bar}
        />
      </div>
    </div>
  );
}

function CasesChart({ chartType, dates }) {
  if (chartType == "cases_line") {
    return <CasesLineChart dates={dates} />;
  } else if (chartType == "cases_bar") {
    return <CasesBarChart dates={dates} />;
  } else if (chartType == "tests_bar") {
    return <TestsBarChart dates={dates} />;
  }
}

function getInitialDates() {
  let allDates = Object.keys(postcodeData["history"]).map((item) => {
    let [year, month, day] = item.split("-");
    month = month - 1;
    return new Date(year, month, day);
  });
  allDates.sort((a, b) => a - b);
  return {
    firstDate: allDates[0].getTime(),
    lastDate: allDates[allDates.length - 1].getTime(),
  };
}

function Slider({ min, max, changeDates }) {
  const [dateRange, setDateRange] = useState([Number(min), Number(max)]);
  const changeDateRange = (value, index) => {
    const newValue = value.map((item) => Number(item));
    setDateRange(newValue);
    changeDates(value);
  };
  return (
    <div className="range-slider">
      <div className="range-slider-dates">
        <div>{formatDate(Number(dateRange[0]))}</div>
        <div>{formatDate(Number(dateRange[1]))}</div>
      </div>
      <Nouislider
        range={{ min: Number(min), max: Number(max + 24 * 60 * 60 * 1000) }}
        start={[Number(min), Number(max)]}
        step={24 * 60 * 60 * 1000}
        onUpdate={changeDateRange}
        connect
      />
    </div>
  );
}

function Charts() {
  const { firstDate, lastDate } = getInitialDates();
  const [chart, setChart] = useState({
    type: "cases_line",
    buttonsActive: ChartActiveButton("cases_line"),
  });
  const [chartDate, setChartDate] = useState({
    start: firstDate,
    end: lastDate,
  });
  const changeChart = (chartType) => {
    const newChartType = chartType;
    const newButtons = ChartActiveButton(chartType);
    setChart({ type: newChartType, buttonsActive: newButtons });
  };
  const changeChartDates = (newDates) => {
    const newValue = {
      start: newDates[0],
      end: newDates[1],
    };
    setChartDate(newValue);
  };
  return (
    <div className="mt-3 container">
      <div className="row justify-content-center">
        <div className="col-lg-8 charts-wrapper">
          <ChartButtons
            onAction={changeChart}
            buttonState={chart.buttonsActive}
          />

          <CasesChart chartType={chart.type} dates={chartDate} />
          <Slider
            min={firstDate}
            max={lastDate}
            changeDates={changeChartDates}
          />
        </div>
      </div>
    </div>
  );
}

var weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Append a suffix to dates.
// Example: 23 => 23rd, 1 => 1st.
function nth(d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// Create a string representation of the date.
function formatDate(dateNum) {
  let date = new Date(dateNum);
  return (
    date.getDate() +
    nth(date.getDate()) +
    " " +
    months[date.getMonth()] +
    " " +
    date.getFullYear()
  );
}

export { SourceChart, Charts };
