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