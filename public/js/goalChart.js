var dataDetails = document.querySelector('#dataDetails');
var goal = {};
goal.goalName = document.querySelector('#goalName').value;
goal.startDate = +document.querySelector('#startDate').value;
goal.chartType = document.querySelector('#chartType').value;
goal.daysToTrack = +document.querySelector('#daysToTrack').value;
goal.dataSet = JSON.parse(document.querySelector('#dataSet').value);
goal.backgroundColor = document.querySelector('#backgroundColor').value;
goal.borderColor = document.querySelector('#borderColor').value;

if (goal.dataSet === "") {
  goal.dataSet = [];
}

function parseDateDayMonth(date) {
  var dateObj = new Date(date);
  var day = dateObj.getDate() + 1;
  var month = dateObj.getMonth() + 1;
  var year = dateObj.getFullYear();
  var dateStr = [
    month,
    day,
    year.toString().substr(2, 2)
  ].join('/');

  return dateStr;
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
  console.log(goal);
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
            labelString: 'Hours'
          },
          ticks: {
            beginAtZero: true,
            max: 24,
            min: 0
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Days'
          }
        }]
      },
      responsive: true
    },
    plugins: [{
      beforeDraw: function (c) {
        var chartHeight = c.chart.height;
        c.scales['y-axis-0'].options.ticks.fontSize = chartHeight * 6 / 100; //fontSize: 6% of canvas height
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