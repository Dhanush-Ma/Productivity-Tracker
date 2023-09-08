import { Context } from "../Context/Context";
import styles from "../Stylesheets/Info.module.css";
import BottomNavbar from "./BottomNavbar";
import Alert from "./Alert";
import { getFormattedTime } from "../Utilities/getFormattedTime";

const Info = () => {
  const { data, id } = React.useContext(Context);

  const { url, today_timer, alert } = data;
  const timer = getFormattedTime(today_timer);
  const key = `${url}${id}`;

  const setAlert = (duration) => {
    /* eslint-disable no-undef */
    chrome.storage.local.get([key], function (result) {
      let prevResult = result[key];
      prevResult.alert = {
        isActive: true,
        duration: duration,
        offset: prevResult.today_timer,
      };
      chrome.storage.local.set({ [key]: prevResult });
    });
  };

  return (
    <>
      {data && (
        <div className={styles.container}>
          <div className={styles.infoContainer}>
            <div className={styles.currentTabContainer}>
              <h1>
                Currently you are at{" "}
                <span className={styles.currentTab}>{url}</span>
              </h1>
            </div>
            <div className={styles.timerContainer}>
              <p className={styles.timerTitle}>Today</p>
              <div className={styles.timer}>
                <div className={styles.timerUnit}>
                  <p className={styles.timerUnitNumber}>{timer[0]}</p>
                  <p className={styles.timerUnitText}>HRS</p>
                </div>
                <div className={styles.timerUnit}>
                  <p className={styles.timerUnitNumber}>{timer[1]}</p>
                  <p className={styles.timerUnitText}>MIN</p>
                </div>
                <div className={styles.timerUnit}>
                  <p className={styles.timerUnitNumber}>{timer[2]}</p>
                  <p className={styles.timerUnitText}>SEC</p>
                </div>
              </div>
            </div>
          </div>
          <Alert alert={alert} setAlert={setAlert} storageKey={key} />
          <BottomNavbar />
        </div>
      )}
    </>
  );
};

export default Info;
