// const getFormattedDuration = require("./src/Utilities/getFormattedDuration");
prev_timers = [
  {
    date: "08/25/23",
    timer: "082523",
  },
  {
    date: "08/26/23",
    timer: "082623",
  },
  {
    date: "08/27/23",
    timer: "082723",
  },
  {
    date: "08/28/23",
    timer: "082823",
  },
];

const date = "08/26/23";
let formatted_time = "";

for (const timer of prev_timers) {
  console.log(timer.date);
  if (timer.date == date) {
    formatted_time = timer.timer;
    break;
  }
}
console.log(formatted_time);
