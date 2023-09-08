const id = "cobpilibcfpjgkcklmhgagemnjmhdlmi";
const key = `${id}_restrict_account`;
let restricted_sites = [];
let user_email = "";
let correct_pin = null;
let otp = null;

// HTML Elements
const create_account_container = document.querySelector(
  ".create_account_container"
);
const restricted_sites_container = document.querySelector(
  ".restricted_sites_container"
);
const check_pin_container = document.querySelector(".check_pin_container");
const email_otp_container = document.querySelector(".email_otp");
const set_new_pin_container = document.querySelector(".set_new_pin");

chrome.runtime.sendMessage(
  { action: "getRestrictData", key: key },
  (response) => {
    response = response[key];
    if (response?.pin) {
      user_email = response.email;
      restricted_sites = response.restricted_sites;
      correct_pin = response.pin;

      create_account_container.style.display = "none";
    } else {
      check_pin_container.style.display = "none";
    }

    restricted_sites_container.style.display = "none";
    email_otp_container.style.display = "none";
    set_new_pin_container.style.display = "none";
  }
);

document.querySelector(".confirm_btn").addEventListener("click", () => {
  let pin = "";
  let email = document.querySelector(".email").value;
  pin =
    document.getElementById("pin1").value +
    document.getElementById("pin2").value +
    document.getElementById("pin3").value +
    document.getElementById("pin4").value;

  if (pin.length == 4 && validateEmail(email)) {
    chrome.storage.local.set({
      [key]: {
        pin: pin,
        email: email,
        restricted_sites: [],
      },
    });

    create_account_container.remove();

    restricted_sites_container.style.display = "block";
    updateRestrictedSites(email);
  }
});

document.querySelector(".check_btn").addEventListener("click", () => {
  let user_pin = "";

  user_pin =
    document.getElementById("pin1c").value +
    document.getElementById("pin2c").value +
    document.getElementById("pin3c").value +
    document.getElementById("pin4c").value;

  if (user_pin === correct_pin) {
    check_pin_container.remove();

    restricted_sites_container.style.display = "block";

    updateRestrictedSites(user_email);
  } else {
    alert("WRONG PIN");
  }
});

document.querySelector(".restrict_btn").addEventListener("click", () => {
  const site_name = document.querySelector(".site_name").value;
  if (site_name != "") {
    chrome.storage.local.get([key], function (result) {
      result = result[key];

      result.restricted_sites.push(site_name);
      restricted_sites.push(site_name);

      chrome.storage.local.set({ [key]: result });
      document.querySelector(".site_name").value = "";
      updateRestrictedSites(result.email);
    });
  }
});

document.querySelector(".forgot_pin").addEventListener("click", () => {
  check_pin_container.remove();
  email_otp_container.style.display = "block";

  const min = 1000;
  const max = 9999;
  otp = Math.floor(Math.random() * (max - min + 1)) + min;

  sendOTP();
});

document.querySelector(".confirm_otp_btn").addEventListener("click", () => {
  let user_otp =
    document.getElementById("pin1o").value +
    document.getElementById("pin2o").value +
    document.getElementById("pin3o").value +
    document.getElementById("pin4o").value;

  console.log(user_otp);

  if (user_otp == otp) {
    email_otp_container.remove();
    set_new_pin_container.style.display = "block";
  } else {
    alert("WRONG OTP");
  }
});

document.querySelector(".set_new_pin_btn").addEventListener("click", () => {
  let new_pin =
    document.getElementById("pin1np").value +
    document.getElementById("pin2np").value +
    document.getElementById("pin3np").value +
    document.getElementById("pin4np").value;

  if (new_pin.length === 4) {
    chrome.storage.local.get([key], function (result) {
      result = result[key];

      result.pin = new_pin;

      chrome.storage.local.set({ [key]: result });
      set_new_pin_container.remove();
      restricted_sites_container.style.display = "block";
      updateRestrictedSites(user_email);
    });
  }
});

let pinElements = document.querySelectorAll(".pin");
pinElements = Array.from(pinElements);
pinElements.forEach((pinElement, index) => {
  pinElement.addEventListener("input", (e) => handlePinInput(e));
});

function updateRestrictedSites(email) {
  document.getElementById(
    "email_address"
  ).innerHTML = `All notifications will be send to <span>${email}</span>`;

  if (restricted_sites.length == 0) {
    document.querySelector(".restricted_sites_table").innerHTML = `
        <table>
            <tr>
              <th class="site_no">#</th>
              <th>SITE NAME</th>
              <th></th>
            </tr>
            <tr>
              <td></td>
              <td class="no_data">No data</td>
              <td></td>
            </tr>
          </table>`;
  } else {
    let rowElements = restricted_sites.map((site, index) => {
      return `
            <tr>
                <td>${index + 1}</td>
                <td>${site}</td>
                <td class="delete_icon">
                <img
                    src="./assets/delete.png"
                    height="45px"
                    width="45px"
                    style="cursor: pointer"
                />
                </td>
           </tr>
           `;
    });

    rowElements = rowElements.join("");
    document.querySelector(".restricted_sites_table").innerHTML = `
        <table>
          <tr>
            <th class="site_no">#</th>
            <th>SITE NAME</th>
            <th></th>
          </tr>
          ${rowElements}
        </table>
    `;
  }

  const delete_icons = document.querySelectorAll(".delete_icon");

  for (const icon of delete_icons) icon.addEventListener("click", deleteSite);
}

function deleteSite(delete_icon) {
  chrome.storage.local.get([key], function (result) {
    result = result[key];
    const row = delete_icon.target.parentNode.parentNode;
    const siteName = row.querySelector("td:nth-child(2)").textContent;

    const index = restricted_sites.indexOf(siteName);
    if (index > -1) {
      restricted_sites.splice(index, 1);
    }

    result.restricted_sites = restricted_sites;

    chrome.storage.local.set({ [key]: result });
    updateRestrictedSites();
  });
}

function handlePinInput(e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");

  if (
    e.target.value.length == 1 &&
    e.target.id != "pin4c" &&
    e.target.id != "pin4" &&
    e.target.id != "pin4np" &&
    e.target.id != "pin4o"
  ) {
    e.target.nextElementSibling.focus();
  }
}

function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function sendOTP() {
  const BACKEND_URL =
    "https://productivity-tracker-backend.onrender.com/send-otp";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      email: user_email,
      otp: otp,
    }),
  };

  fetch(BACKEND_URL, options);
}
