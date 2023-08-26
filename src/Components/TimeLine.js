import styles from "../Stylesheets/TimeLine.module.css";
import { getFormattedDate } from "../Utilities/getFormattedDate";
import { getFormattedDuration } from "../Utilities/getFormattedDuration";
import { Context } from "../Context/Context";
import Calendar from "react-calendar";
import BottomNavbar from "./BottomNavbar";
import { useContext, useState } from "react";

const TimeLine = () => {
  const { data } = useContext(Context);
  const { prev_timers, today_date, today_timer } = data;
  const findHrs = (date) => {
    if (date == today_date) return getFormattedDuration(today_timer);

    let formatted_time = "0 min";
    for (const timer of prev_timers) {
      if (timer.date == date) {
        formatted_time = getFormattedDuration(timer.timer);
        break;
      }
    }

    return formatted_time;
  };

  const [activeStartDate, setActiveStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [dateData, setDateData] = useState({
    date: new Date().toLocaleDateString(),
    duration: findHrs(new Date().toLocaleDateString()),
  });

  const dateChange = (value) => {
    setDateData({
      date: value.toLocaleDateString(),
      duration: findHrs(value.toLocaleDateString()),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.calendarContainer}>
        <Calendar
          activeStartDate={activeStartDate}
          showNeighboringMonth={false}
          view="month"
          onChange={(value, event) => {
            dateChange(value);
          }}
        />
        <div className={styles.hrsContainer}>
          <p className={styles.date}>{getFormattedDate(dateData.date)}</p>
          <p>{dateData.duration}</p>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default TimeLine;
