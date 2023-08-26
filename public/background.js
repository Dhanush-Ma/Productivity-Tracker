let id = "_cobpilibcfpjgkcklmhgagemnjmhdlmi";

async function updateStorageValue() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length == 0) return;

    let url = new URL(tabs[0].url);
    let domain = url.hostname;
    domain = domain.replace(/^www\./i, "");

    const key = `${domain}${id}`;
    const today_date = new Date().toLocaleDateString();

    chrome.storage.local.get([key], function (result) {
      let prevResult = result[key];

      if (prevResult && checkAlertTimer(prevResult)) {
        let tabId = tabs[0].id;
        let message = {
          action: "Alert Notification",
          data: { alertInfo: prevResult.alert },
        };
        chrome.tabs.sendMessage(tabId, message, function (response) {});
        prevResult.alert.offset = prevResult.today_timer;
      }

      if (prevResult && checkTodayTimer(prevResult, today_date)) {
        prevResult.prev_timers.push({
          date: prevResult.today_date,
          timer: prevResult.today_timer,
        });
        prevResult.today_date = today_date;
        prevResult.today_timer = 1000;
      }

      prevResult =
        prevResult && prevResult.url
          ? prevResult
          : {
              url: domain,
              today_timer: 0,
              today_date: new Date().toLocaleDateString(),
              prev_timers: [],
              alert: null,
            };
      prevResult.today_timer = prevResult.today_timer + 1000;

      //console.log(prevResult);
      chrome.storage.local.set({ [key]: prevResult });
    });
  });
}

setInterval(updateStorageValue, 1000);

function checkAlertTimer(prevResult) {
  if (prevResult.alert && prevResult.alert.isActive) {
    let x = prevResult.alert.duration + prevResult.alert.offset;
    if (
      prevResult.today_timer ==
      prevResult.alert.duration + prevResult.alert.offset
    )
      return true;
    else return false;
  }
  return false;
}

function checkTodayTimer(prevResult, today_date) {
  if (prevResult.today_date != today_date) {
    return true;
  }
  return false;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
    return;
  }

  if (message.action === "getRestrictPageUrl") {
    const restrictPageUrl = chrome.runtime.getURL("restrict.html");
    sendResponse({ restrictPageUrl });
  }

  if (message.action === "getRestrictData") {
    chrome.storage.local.get([message.key], function (result) {
      sendResponse(result);
    });
  }

  if (message.action === "getActiveTabInfo") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ response: tabs[0] });
    });
  }

  return true;
});
