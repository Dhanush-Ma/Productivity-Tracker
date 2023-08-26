console.log("Content.hhjs");
const id = "cobpilibcfpjgkcklmhgagemnjmhdlmi";
const key = `${id}_restrict`;

chrome.storage.local.get([key], function (result) {
  result = result[key];
  const { restricted_sites } = result;

  chrome.runtime.sendMessage({ action: "getActiveTabInfo" }, (response) => {
    let url = new URL(response.response.url);
    let domain = url.hostname;
    domain = domain.replace(/^www\./i, "");

    if (restricted_sites.includes(domain)) {
      restrictAccessToSite();
      return;
    }
  });
});

const add_custom_style = (css) =>
  (document.head.appendChild(document.createElement("style")).innerHTML = css);

const create_modal_container = (tag, attr_tag, attr_name, value) => {
  const custom_element = document.createElement(tag);
  custom_element.setAttribute(attr_tag, attr_name);
  custom_element.innerHTML = value;
  document.body.append(custom_element);
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "Alert Notification") {
    console.log("Received message from background script:", message);
  }
  openOverlayModal();
});

function openOverlayModal() {
  const imageUrl = chrome.runtime.getURL("assets/alert.gif");
  console.log(imageUrl);

  add_custom_style(`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&display=swap');


.${id}_modal-overlay{
    background-color: rgba(97, 93, 93, 0.4);
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
}

.${id}_modal-content{
    font-size: 1.5rem !important;
    z-index: 9999999999999 !important;
    width: 500px;
    height: 300px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: linear-gradient(222.38deg,#872a95,#35297f 91.75%,#35297f);
    color: white;
    font-family: "Montserrat";
    border-radius: 3px;
    text-align: center;
    padding: 0 20px;
}

.${id}_modal-content img{
    width: 100px;
    height: 100px;
}

.${id}_modal-content p{
    text-align: center;
    font-size: 16px;
    margin: 0 auto;
}

.${id}_modal-content h2{
    color: #ff4fc6;
    font-size: 30px;
    margin-top: 40px;
}

.${id}_close-btn{
    font-size: 1.4rem !important;
    cursor: pointer;
    width: 16px;
    height: 16px;
    padding: 16px;
    background-color: white;
    border-radius: 50%;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: -20px;
    right: -20px;
    border: 2px solid black;
}

.${id}_close-X{
    font-size: 24px !important;
    font-weight: bold;
}
  `);

  create_modal_container(
    "div",
    "class",
    `${id}_modal-overlay`,
    `<div class="${id}_modal-content">
        <h2>Your Alert Breached!</h2>
        <img src="${imageUrl}" alt="alert-gif" />
        <p>
          You have been actively using this website for an extended period. It
          is advisable to take a break to ensure your well-being.
        </p>
        <div class="${id}_close-btn">
          <p class="${id}_close-X">X</p>
        </div>
      </div>`
  );
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains(`${id}_close-btn`)) {
    closeModal();
  }
});

function closeModal() {
  document.querySelector(`.${id}_modal-overlay`).remove();
}

function restrictAccessToSite() {
  document.documentElement.innerHTML = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Blocked</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&display=swap');

        *{
            margin: 0;
            padding: 0;
        }
        body{
            font-size: 1rem;
            
            background: linear-gradient(222.38deg,#872a95,#35297f 81.75%,#35297f);
             --white: #fff;;
             width: 100vw;
             height: 100vh;
             color: #fff;
             font-family: 'Montserrat';
             display: flex;
             justify-content: center;
             align-items: center;
        }
        h1{
            font-size: 52px !important;
        }
        p{
            position: absolute;
            bottom: 32px !important;
            left: 50%;
            transform: translateX(-50%);
            font-weight: bold;
            font-size: 20px !important;
        }
    </style>
</head>
<body>
    <h1>
        This site has been blocked.
    </h1>
    <p>&#9432; Productivity Tracker</p>
</body>
</html>
  `;
}
