const chartType = 'line';
const chartLabels = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const data = {};

data.goalData1 = {
  label: 'Programming',
  data: [1, 2, 3, 5, 2, 3, 1],
  backgroundColor: [
    'rgba(255, 0, 0, .1)'
  ],
  borderColor: [
    'rgba(255, 0, 0, .5)'
  ],
  borderWidth: 1
};

data.goalData2 = {
  label: 'Excercise',
  data: [5, 2, 3, 5, 5, 5, 0],
  backgroundColor: [
    'rgba(0, 255, 0, .1)'
  ],
  borderColor: [
    'rgba(0, 255, 0, .5)'
  ],
  borderWidth: 1
};

data.goalData3 = {
  label: 'Work',
  data: [2, 3, 1, 5, 2, 1, 1],
  backgroundColor: [
    'rgba(0, 0, 255, .1)'
  ],
  borderColor: [
    'rgba(0, 0, 255, .5)'
  ],
  borderWidth: 1
};

data.goalData4 = {
  label: 'Family',
  data: [3, 1, 0, 1, 3, 4, 0],
  backgroundColor: [
    'rgba(255, 0, 255, .1)'
  ],
  borderColor: [
    'rgba(255, 0, 255, .5)'
  ],
  borderWidth: 1
};

data.goalData5 = {
  label: 'Relaxing',
  data: [3, 4, 5, 5, 1, 4, 0],
  backgroundColor: [
    'rgba(50, 99, 132, 0.1)'
  ],
  borderColor: [
    'rgba(100,99,132,5)'
  ],
  borderWidth: 1
};


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
  let goalData = [data[`goalData${goalClicked}`]];

  if (`goalData${goalClicked}` === 'goalDataAll') {
    goalData = Object.values(data);
  }

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
