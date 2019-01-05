var dataDetails = document.querySelector('#dataDetails');
var goal = {};
goal.goalName = document.querySelector('#goalName').value;
goal.startDate = +document.querySelector('#startDate').value;
goal.goalTarget = +document.querySelector('#goalTarget').value;
goal.goalDataType = document.querySelector('#goalDataType').value;
goal.chartType = document.querySelector('#chartType').value;
goal.daysToTrack = +document.querySelector('#daysToTrack').value;
goal.dataSet = JSON.parse(document.querySelector('#dataSet').value);
goal.backgroundColor = document.querySelector('#backgroundColor').value;
goal.borderColor = document.querySelector('#borderColor').value;

if (goal.dataSet === "") {
  goal.dataSet = [];
}

function parseDateDayMonth(date) {
  var momentDate = moment(date);
  return momentDate.format('MM[/]DD[/]YY');
};

function createChartLables(startDate, daysToTrack) {
  var dayLength = 24 * 60 * 60 * 1000;

  var result = [];
  for (var i = 0; i < daysToTrack; i++) {
    var dateHolder;
    if (i === 0) {
      dateHolder = startDate;
    } else {
      dateHolder = startDate + (dayLength * i);
    }
    result.push(parseDateDayMonth(dateHolder));
  }
  return result;
};

function renderChart(goal) {
  var chartLabels = createChartLables(goal.startDate, goal.daysToTrack);
  var data = {
    label: goal.goalName,
    data: goal.dataSet,
    backgroundColor: goal.backgroundColor,
    borderColor: goal.borderColor,
    borderWidth: 1
  };

  var ctx = document.getElementById("myChart");

  var myChart = new Chart(ctx, {
    type: goal.chartType,
    data: {
      labels: chartLabels,
      datasets: [data]
    },
    options: {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: goal.goalDataType
          },
          ticks: {
            beginAtZero: true,
            min: 0,
            suggestedMax: goal.goalTarget - 1
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }]
      },
      responsive: true
    },
    plugins: [{
      beforeDraw: function (c) {
        var chartHeight = c.chart.height;
        c.scales['y-axis-0'].options.ticks.fontSize = chartHeight * 6 / 100;
      }
    }]
  });

  document.getElementById("myChart").addEventListener('click', (e) => {
    var activePoints = myChart.getElementsAtEvent(e);
    if (activePoints[0] !== undefined) {
      dataDetails.innerHTML = `
              <h3>Details</h3>
              <p>Day: ${activePoints[0]._index + 1}</p>
              <p>Hours: ${goal.dataSet[activePoints[0]._index]}</p>
            `;
      console.log(activePoints[0]);
      console.log('Hours', goal.dataSet[activePoints[0]._index]);
      console.log('Day', activePoints[0]._index + 1);
    }
  });
};

renderChart(goal);