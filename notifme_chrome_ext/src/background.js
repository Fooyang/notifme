chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   var curr = getCurrentTab();
  console.log("here");
  if (request.action === "updateEditMode") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // chrome.tabs.sendMessage(tabs[0].id, { action: "updateEditMode", editMode: request.editMode });
      console.log(tabs);
      chrome.tabs.sendMessage(tabs[0].id, { action: "updateEditMode", editMode: request.editMode});
    });
  }
});

// async function getCurrentTab() {
//   let queryOptions = {active: true, lastFocusedWindow: true};
//   let [tab] = await chrome.tabs.query(queryOptions);
//   return tab;
// }