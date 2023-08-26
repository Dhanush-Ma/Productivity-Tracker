import styles from "../Stylesheets/Info.module.css";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { MdTimeline } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import { ImBlocked } from "react-icons/im";

const BottomNavbar = () => {
  const goToRestrictPage = () => {
    /* eslint-disable no-undef */
    chrome.runtime.sendMessage({ action: "getRestrictPageUrl" }, (response) => {
      if (response) {
        const { restrictPageUrl } = response;
        window.open(restrictPageUrl, "_blank");
      }
    });
  };

  return (
    <div className={styles.navabarContainer}>
      <NavLink to="/">
        <div className={styles.link}>
          <BsInfoCircle />
          <p>Info</p>
        </div>
      </NavLink>
      <NavLink to="/timeline">
        <div className={styles.link}>
          <MdTimeline />
          <p>Time Line</p>
        </div>
      </NavLink>
      <div style={{cursor: "pointer"}} onClick={() => goToRestrictPage()} className={styles.link}>
        <ImBlocked />
        <p>Restrict</p>
      </div>
    </div>
  );
};

export default BottomNavbar;
