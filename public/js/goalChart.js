window['moment-range'].extendMoment(moment);

var goalId = location.pathname.split('/')[3];
fetch(`http://localhost:5000/goals/goal/${goalId}`)
  .then(goal => {
    return goal.json();
  })
  .then(goalData => {
    console.log(goalData);
  })
  .catch(err => console.log(err));

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

var submitForm = {};
submitForm.setDate = document.querySelector('#setDate');

function dateToInputValue(date) {
  var dateArray = date.split('/');
  return [dateArray[2], dateArray[0], dateArray[1]].join('-');
};

function createChartLabels() {
  return result = goal.dataSet.map(dataPoint => {
    return dataPoint.setDate;
  });
};

function getDataValueArray(dataSet) {
  return result = dataSet.map(dataPoint => {
    return dataPoint.value;
  });
};

function setDefaultDates(startDate, daysToTrack) {
  var endDate = moment(startDate, 'MM-DD-YYYY').add((daysToTrack - 1), 'day').format('MM[/]DD[/]YYYY');
  var today = moment().startOf('day').format('MM[/]DD[/]YYYY');

  filter.beginDate.value = dateToInputValue(startDate);
  filter.beginDate.min = dateToInputValue(startDate);
  filter.beginDate.max = dateToInputValue(endDate);
  filter.endDate.value = dateToInputValue(endDate);
  filter.endDate.min = dateToInputValue(startDate);
  filter.endDate.max = dateToInputValue(endDate);

  submitForm.setDate.value = dateToInputValue(today);
  submitForm.setDate.min = dateToInputValue(startDate);
  submitForm.setDate.max = dateToInputValue(endDate);
};

function renderChart(goal) {
  var chartLabels = createChartLabels();
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
  return myChart;
};

var myChart = renderChart(goal);
setDefaultDates(goal.startDate, goal.daysToTrack);

document.getElementById('applyFilterBtn').addEventListener('click', () => {
  var start = moment(filter.beginDate.value, 'YYYY-MM-DD');
  var end = moment(filter.endDate.value, 'YYYY-MM-DD');

  if (end.isBefore(start)) {
    var holderStart = start.clone();
    var holderEnd = end.clone();
    start = holderEnd;
    end = holderStart;
  }

  var range = moment.range(start, end);
  var filteredDataSet = goal.dataSet.filter(dataPoint => {
    var tempMoment = moment(dataPoint.setDate, 'MM-DD-YYYY');
    return range.contains(tempMoment);
  });

  var newLabels = filteredDataSet.map(dataPoint => {
    return dataPoint.setDate;
  });

  var newData = filteredDataSet.map(dataPoint => {
    return dataPoint.value;
  });

  myChart.data.datasets[0].data = newData;
  myChart.data.labels = newLabels;
  myChart.update();
});