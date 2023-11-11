chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openNewTab") {
    const link = request.link || "https://www.google.com/"; // Default link if not provided
    const extensionUrl = chrome.runtime.getURL(link);

    // Open the link in a new tab
    chrome.tabs.create({ url: extensionUrl, active: true });
  }
});


// chrome.action.onClicked.addListener(function () {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     const activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, { action: "inject_content_script" });
//   });
// });

// chrome.browserAction.onClicked.addListener(function (tab) {
//   chrome.tabs.executeScript({
//     file: "content.js",
//   });
// });

// chrome.contextMenus.onClicked.addListener(function (info, tab) {
//   if (info.menuItemId === "getXPath") {
//     // Send a message to the content script to get the XPath
//     chrome.tabs.sendMessage(tab.id, { action: "getXPath" });
//   }
// });
