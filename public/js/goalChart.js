const pathArray = window.location.pathname.split('/');
const goalId = pathArray[pathArray.length - 1];
const dataDetails = document.querySelector('#dataDetails');
let goal;

// Needs to be replaced by deployed app url
fetch(`https://sheltered-thicket-56176.herokuapp.com/goals/goal/${goalId}`)
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
    data: goal.dataSet,
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
    }
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
