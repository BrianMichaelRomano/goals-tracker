var dataDetails = document.querySelector('#dataDetails');

var goal = {};
goal.goalName = document.querySelector('#goalName').value;
goal.startDate = document.querySelector('#startDate').value;
goal.goalTarget = +document.querySelector('#goalTarget').value;
goal.goalType = document.querySelector('#goalType').value;
goal.chartType = document.querySelector('#chartType').value;
goal.daysToTrack = +document.querySelector('#daysToTrack').value;
goal.dataSet = JSON.parse(document.querySelector('#dataSet').value);
goal.backgroundColor = document.querySelector('#backgroundColor').value;
goal.borderColor = document.querySelector('#borderColor').value;

var controls = {};
controls.dataPointsToggle = document.querySelector('#dataPointToggle');
controls.yAxisRange = document.querySelector('#yAxisRange');

var filter = {};
filter.beginDate = document.querySelector('#beginDate');
filter.endDate = document.querySelector('#endDate');

function dateToInputValue(date) {
  var dateArray = date.split('/');
  return [dateArray[2], dateArray[0], dateArray[1]].join('-');
};

function createChartLabels(startDate) {
  return result = goal.dataSet.map(dataPoint => {
    return dataPoint.setDate;
  });
};

function getDataValueArray(dataSet) {
  return result = dataSet.map(dataPoint => {
    return dataPoint.value;
  });
};

function setDefaultFilterDates(startDate, daysToTrack) {
  var beginMoment = moment(startDate, 'DD-MM-YYYY');
  var endDate = beginMoment.add((daysToTrack - 1), 'day').format('MM[/]DD[/]YYYY');

  filter.beginDate.value = dateToInputValue(startDate);
  filter.beginDate.min = dateToInputValue(startDate);
  filter.beginDate.max = dateToInputValue(endDate);
  filter.endDate.value = dateToInputValue(endDate);
  filter.endDate.min = dateToInputValue(startDate);
  filter.endDate.max = dateToInputValue(endDate);
};

function renderChart(goal) {
  var chartLabels = createChartLabels(goal.startDate);
  var data = {
    label: goal.goalName,
    data: getDataValueArray(goal.dataSet),
    backgroundColor: goal.backgroundColor,
    borderColor: goal.borderColor,
    borderWidth: 1,
    pointRadius: 3,
    pointHitRadius: 10
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
            labelString: goal.goalType
          },
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 24
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
    }
  });

  controls.dataPointsToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      myChart.chart.data.datasets[0].pointRadius = 3;
      myChart.update();
    } else {
      myChart.chart.data.datasets[0].pointRadius = 0;
      myChart.update();
    }
  });

  controls.yAxisRange.addEventListener('input', (e) => {
    var yAxis = e.target.value;
    myChart.options.scales.yAxes[0].ticks.max = +yAxis;
    myChart.update();
  });

  document.getElementById("myChart").addEventListener('click', (e) => {
    var activePoints = myChart.getElementsAtEvent(e);
    if (activePoints[0] !== undefined) {
      dataDetails.innerHTML = `
        <h3>Details</h3>
        <p>Day: ${activePoints[0]._index + 1}</p>
        <p>Hours: ${goal.dataSet[activePoints[0]._index].value}</p>
      `;
    }
  });

  document.getElementById('applyFilterBtn').addEventListener('click', () => {
    // var dayLength = 24 * 60 * 60 * 1000;
    // var begin = filter.beginDate.value;
    // var end = filter.endDate.value;
    // var beginMs = new Date(begin).getTime();
    // var endMs = new Date(end).getTime();
    // var numDaysBetweenDates = ((endMs - beginMs) / dayLength) + 1;
    // console.log(beginMs)
    // console.log(numDaysBetweenDates);
    // console.log(myChart.data.datasets[0].data)
    console.log(goal.dataSet)
  });
};

renderChart(goal);
setDefaultFilterDates(goal.startDate, goal.daysToTrack);