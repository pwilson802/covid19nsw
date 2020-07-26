import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React, { useState } from "react";
import { Pie, Line, Bar } from "react-chartjs-2";

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

function makeCasesChartData(dataType) {
  let data = [];
  Object.keys(postcodeData["history"]).forEach((item) => {
    let [year, month, day] = item.split("-");
    month = month - 1;
    let caseDate = new Date(year, month, day);
    data.push({
      t: caseDate,
      y: postcodeData["history"][item][dataType],
    });
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

function CasesLineChart() {
  const data = makeCasesChartData("cases_all");
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

function CasesBarChart() {
  const data = makeCasesChartData("cases_new");
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

function TestsBarChart() {
  const data = makeCasesChartData("tests_new");
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

function CasesChart({ chartType }) {
  if (chartType == "cases_line") {
    return <CasesLineChart />;
  } else if (chartType == "cases_bar") {
    return <CasesBarChart />;
  } else if (chartType == "tests_bar") {
    return <TestsBarChart />;
  }
}

function Charts() {
  const [chart, setChart] = useState({
    type: "cases_line",
    buttonsActive: ChartActiveButton("cases_line"),
  });
  const changeChart = (chartType) => {
    const newChartType = chartType;
    const newButtons = ChartActiveButton(chartType);
    setChart({ type: newChartType, buttonsActive: newButtons });
  };
  return (
    <div className="mt-3 container">
      <div className="row justify-content-center">
        <div className="col-lg-8 charts-wrapper">
          <ChartButtons
            onAction={changeChart}
            buttonState={chart.buttonsActive}
          />

          <CasesChart chartType={chart.type} />
        </div>
      </div>
    </div>
  );
}

export { SourceChart, Charts };
