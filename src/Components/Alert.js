import styles from "../Stylesheets/Info.module.css";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { AiOutlineClockCircle, AiFillDelete } from "react-icons/ai";
import { PiToggleRightFill, PiToggleLeftFill } from "react-icons/pi";
import { useState } from "react";
import { getFormattedTime } from "../Utilities/getFormattedTime";

const Alert = ({ alert, setAlert, storageKey }) => {
  const [showTimerOptions, setTimerOptions] = useState(false);

  return (
    <>
      {alert ? (
        <AlertInfo alert={alert} storageKey={storageKey} />
      ) : showTimerOptions ? (
        <TimerOptions setAlert={setAlert} />
      ) : (
        <TimerInfo setTimerOptions={setTimerOptions} />
      )}
    </>
  );
};

export default Alert;

const AlertInfo = ({ alert, storageKey }) => {
  const { duration, isActive } = alert;
  const alertMins = duration / 60000;

  const disableAlert = () => {
    /* eslint-disable no-undef */
    chrome.storage.local.get([storageKey], function (result) {
      let prevResult = result[storageKey];
      prevResult.alert = {
        isActive: !prevResult.alert.isActive,
        duration: prevResult.alert.duration,
        offset: prevResult.alert.offset,
      };
      chrome.storage.local.set({ [storageKey]: prevResult });
    });
  };

  const enableAlert = () => {
    /* eslint-disable no-undef */
    chrome.storage.local.get([storageKey], function (result) {
      let prevResult = result[storageKey];
      prevResult.alert = {
        isActive: !prevResult.alert.isActive,
        duration: prevResult.alert.duration,
        offset: prevResult.today_timer,
      };
      chrome.storage.local.set({ [storageKey]: prevResult });
    });
  };

  const deleteAlert = () => {
    /* eslint-disable no-undef */
    chrome.storage.local.get([storageKey], function (result) {
      let prevResult = result[storageKey];
      prevResult.alert = null;
      chrome.storage.local.set({ [storageKey]: prevResult });
    });
  };

  return (
    <div className={styles.alertInfoContainer}>
      {isActive ? (
        <p className={styles.alertDesc}>
          Alert notification set for {alertMins} minutes.
        </p>
      ) : (
        <p className={styles.alertDesc}>
          Alert notification is currently disabled ({alertMins} minutes.)
        </p>
      )}
      <div className={styles.btnContainer}>
        <div className={styles.disableBtn}>
          {isActive ? (
            <PiToggleRightFill
              onClick={() => disableAlert()}
              color="white"
              size={28}
            />
          ) : (
            <PiToggleLeftFill
              onClick={() => enableAlert()}
              color="white"
              size={28}
            />
          )}
        </div>
        <div onClick={() => deleteAlert()} className={styles.deleteBtn}>
          <AiFillDelete size={28} color="white" />
        </div>
      </div>
    </div>
  );
};

const TimerInfo = ({ setTimerOptions }) => {
  return (
    <div className={styles.timerInfoContainer}>
      <div
        className={styles.timerBtn}
        style={{ cursor: "pointer" }}
        onClick={() => setTimerOptions(true)}
      >
        <HiOutlineBellAlert size={28} color="white" />
      </div>
      <p className={styles.timerDesc}>
        No alert notifications have been configured on this website.
      </p>
    </div>
  );
};

const TimerOptions = ({ setAlert }) => {
  return (
    <div className={styles.timerInfoContainer}>
      <div className={styles.timerBtn} style={{ cursor: "pointer" }}>
        <AiOutlineClockCircle size={28} color="white" />
      </div>
      <div className={styles.alterTimers}>
        <div onClick={() => setAlert(300000)} className={styles.alterTimer}>
          <p>5 mins</p>
        </div>
        <div onClick={() => setAlert(1800000)} className={styles.alterTimer}>
          <p>30 mins</p>
        </div>
        <div onClick={() => setAlert(3600000)} className={styles.alterTimer}>
          <p>60 mins</p>
        </div>
        <div onClick={() => setAlert(5400000)} className={styles.alterTimer}>
          <p>90 mins</p>
        </div>
        <div onClick={() => setAlert(7200000)} className={styles.alterTimer}>
          <p>120 mins</p>
        </div>
      </div>
    </div>
  );
};

