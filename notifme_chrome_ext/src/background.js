chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateEditMode") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "updateEditMode", editMode: request.editMode});
    });
  }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "openNewTab") {
    chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "openNewTab", link: request.link});
    });
  }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getEnabled") {
    chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getEnabled" });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "enabled") {
    // Forward the data to the Vue frontend using chrome.tabs.sendMessage
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      chrome.tabs.sendMessage(activeTab.id, {
        action: "enabled",
        data: data,
      });
    });
  }
});