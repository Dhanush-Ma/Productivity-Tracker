const id = "cobpilibcfpjgkcklmhgagemnjmhdlmi";
const key = `${id}_restrict`;
let restricted_sites = [];

chrome.runtime.sendMessage(
  { action: "getRestrictData", key: key },
  (response) => {
    response = response[key];
    console.log(response);
    if (response && response.pin) {
      console.log("here it")
      document.querySelector(".create_account_container").style.display =
        "none";
      document.querySelector(".restricted_sites_container").style.display =
        "none";
    } else {
      document.querySelector(".restricted_sites_container").style.display =
        "none";
      document.querySelector(".check_pin_container").style.display = "none";
    }
  }
);

document.querySelector(".confirm_btn").addEventListener("click", () => {
  let pin = "";
  pin =
    document.getElementById("pin1").value +
    document.getElementById("pin2").value +
    document.getElementById("pin3").value +
    document.getElementById("pin4").value;

  if (pin.length == 4) {
    chrome.storage.local.set({
      [key]: {
        pin: pin,
        restricted_sites: [],
      },
    });

    document.querySelector(".create_account_container").remove();

    document.querySelector(".restricted_sites_container").style.display =
      "block";
    updateRestrictedSites();
  }
});

document.querySelector(".check_btn").addEventListener("click", () => {
  let correct_pin = "";
  let user_pin = "";

  chrome.storage.local.get([key], function (result) {
    result = result[key];
    correct_pin = result.pin;
    restricted_sites = result.restricted_sites;

    user_pin =
      document.getElementById("pin1c").value +
      document.getElementById("pin2c").value +
      document.getElementById("pin3c").value +
      document.getElementById("pin4c").value;

    if (user_pin == correct_pin) {
      document.querySelector(".check_pin_container").remove();

      document.querySelector(".restricted_sites_container").style.display =
        "block";

      updateRestrictedSites();
    } else {
      alert("WRONG PIN");
    }
  });
});

document.querySelector(".restrict_btn").addEventListener("click", () => {
  chrome.storage.local.get([key], function (result) {
    result = result[key];

    const site_name = document.querySelector(".site_name").value;

    result.restricted_sites.push(site_name);
    restricted_sites.push(site_name);

    chrome.storage.local.set({ [key]: result });
    document.querySelector(".site_name").value = "";
    updateRestrictedSites();
  });
});

function updateRestrictedSites() {
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
