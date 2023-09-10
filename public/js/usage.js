chrome.storage.local.get(null, function (result) {
  let keys = Object.keys(result).filter((key) => {
    return result[key].url;
  });

  const data = keys.map((key) => {
    const res = result[key];
    const prev_timer = res.prev_timers.reduce(
      (acc, curr) => acc + curr.timer,
      0
    );

    return {
      url: res.url,
      duration: res.today_timer + prev_timer,
    };
  });

  const total_websites_duration = data.reduce(
    (acc, curr) => acc + curr.duration,
    0
  );

  const percentData = data.map((item) => ({
    url: item.url,
    percentage: ((item.duration / total_websites_duration) * 100).toFixed(2),
  }));

  const urls = percentData.map((item) => item.url);
  const percentages = percentData.map((item) => parseFloat(item.percentage));

  document.getElementById("title").innerText = "Websites Usage Breakdown";
  const ctx = document.getElementById("myPieChart").getContext("2d");

  const footer = (tooltipItems) => {
    tooltipItems = tooltipItems[0];
    const index = tooltipItems.dataIndex;
    const numericValue = data[index].duration;
    const hours = Math.floor(numericValue / 3600000);
    const minutes = Math.floor((numericValue % 3600000) / 60000);
    const seconds = Math.floor((numericValue % 60000) / 1000);

    let timeString = "";

    if (hours > 0) {
      timeString += `${hours} hr `;
    } else if (minutes > 0 || (hours === 0 && minutes === 0)) {
      timeString += `${minutes} min `;
    } else if (seconds > 0 || (hours === 0 && minutes === 0 && seconds === 0)) {
      timeString += `${seconds} sec`;
    }

    return `${timeString}`;
  };

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: urls,
      datasets: [
        {
          data: percentages,
          backgroundColor: [
            "#FF5733",
            "#337DFF",
            "#33FF48",
            "#FFA833",
            "#A833FF",
            "#FF33A5",
            "#33EFFF",
            "#FFFF33",
            "#33FFFF",
            "#FF33E7",
            "#33FF91",
            "#336BFF",
            "#8B4513",
            "#808080",
            "#800000",
            "#000080",
            "#808000",
            "#FF00FF",
            "#00FFFF",
            "#C0C0C0",
            "#32CD32",
            "#FF6F61",
            "#EE82EE",
            "#FFD700",
            "#9400D3",
            "#FFD700",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    },

    options: {
      plugins: {
        tooltip: {
          callbacks: {
            footer: footer,
          },
        },
        legend: {
          labels: {
            color: "white",
            font: {
              size: 12,
            },
          },
        },
      },
    },
  });
});
