const ctx = document.getElementById("myChart");

var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange", "Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
      label: '# of Votes',
      data: [1, 2, 3, 5, 2, 3, 1, 2, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(50, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgba(100,99,132,1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    responsive: false
  }
});