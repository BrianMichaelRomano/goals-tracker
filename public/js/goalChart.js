const goalName = document.querySelector('#goalName').value;
const chartType = document.querySelector('#chartType').value;
const daysToTrack = document.querySelector('#daysToTrack').value;
const borderColor = document.querySelector('#borderColor').value;
const backgroundColor = document.querySelector('#backgroundColor').value;
const startDate = document.querySelector('#startDate').value;

function createChartLables(numOfDays) {
  const result = [];
  for (let i = 1; i < numOfDays; i++) {
    result.push(i);
  }
  return result;
};

const chartLabels = createChartLables(daysToTrack);
const data = {
  label: goalName,
  data: [],
  backgroundColor: backgroundColor,
  borderColor: borderColor,
  borderWidth: 1
};

const ctx = document.getElementById("myChart");

let myChart = new Chart(ctx, {
  type: chartType,
  data: {
    labels: chartLabels,
    datasets: [data]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    responsive: true
  }
});