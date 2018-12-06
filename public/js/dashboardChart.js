const chartType = 'line';
const chartLabels = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const data = {};

data.goalData1 = [{
  label: '# of Votes',
  data: [1, 2, 3, 5, 2, 3, 1],
  backgroundColor: [
    '#446505'
  ],
  borderColor: [
    '#A0E422'
  ],
  borderWidth: 1
}];

data.goalData2 = [{
  label: '# of Votes',
  data: [5, 2, 3, 5, 5, 5, 0],
  backgroundColor: [
    '#F34823'
  ],
  borderColor: [
    '#651605'
  ],
  borderWidth: 1
}];

data.goalData3 = [{
  label: '# of Votes',
  data: [2, 3, 1, 5, 2, 1, 1],
  backgroundColor: [
    '#16A4DA'
  ],
  borderColor: [
    '#075A79'
  ],
  borderWidth: 1
}];

data.goalData4 = [{
  label: '# of Votes',
  data: [3, 1, 0, 1, 3, 4, 0],
  backgroundColor: [
    '#9374ED'
  ],
  borderColor: [
    '#2E0B94'
  ],
  borderWidth: 1
}];

data.goalData5 = [{
  label: '# of Votes',
  data: [3, 4, 5, 5, 1, 4, 0],
  backgroundColor: [
    'rgba(50, 99, 132, 0.2)'
  ],
  borderColor: [
    'rgba(100,99,132,1)'
  ],
  borderWidth: 1
}];

const ctx = document.getElementById("myChart");

let myChart = new Chart(ctx, {
  type: chartType,
  data: {
    labels: chartLabels,
    datasets: []
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

document.querySelector('.goalList').addEventListener('click', (e) => {
  const goalClicked = e.target.id;
  const goalData = data[`goalData${goalClicked}`];

  myChart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: chartLabels,
      datasets: goalData
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
});
