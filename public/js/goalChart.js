const pathArray = window.location.pathname.split('/');
const goalId = pathArray[pathArray.length - 1];
let goal;

fetch(`http://localhost:5000/goals/goal/${goalId}`)
  .then(goal => {
    return goal.json();
  })
  .then(goalData => {
    renderChart(goalData);
  })
  .catch(err => console.log(err));


function createChartLables(numOfDays) {
  const result = [];
  for (let i = 1; i <= numOfDays; i++) {
    result.push(i);
  }
  return result;
};

function renderChart(goal) {
  const chartLabels = createChartLables(goal.daysToTrack);
  const data = {
    label: goal.goalName,
    data: [3, 4, 6, 2, 6, 7, 8, 6],
    backgroundColor: goal.backgroundColor,
    borderColor: goal.borderColor,
    borderWidth: 1
  };

  const ctx = document.getElementById("myChart");

  let myChart = new Chart(ctx, {
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
            beginAtZero: true
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
    }
  });
};