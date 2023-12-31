var enabled;
if(!sessionStorage.getItem('isEnabled')) {
  enabled = false;
} else {
  enabled = sessionStorage.getItem('isEnabled') === 'true';
}

var isButtonClicked = false;
var lastButtonXpath = "";

var xPathList = [];

// Function to handle mouseover event
function handleMouseover(event) {
  // Check if the button has been clicked
  if (enabled) {
    // Check if the target is an HTML element
    if (event.target instanceof HTMLElement) {
      // Save the current border style for later restoration
      event.target._originalBorderStyle = event.target.style.border;
      if (event.target._originalBorderStyle != "7px solid green") {
        event.target.style.border = "7px solid orange";
      }
       // Change the color and width as needed
    }
  }
}

// Function to handle mouseout event
function handleMouseout(event) {
  // Check if the button has been clicked
  if (enabled) {
    // Check if the target is an HTML element
    if (event.target instanceof HTMLElement) {
      // Save the current border style for later restoration
      event.target._originalBorderStyle = event.target.style.border;
      if (event.target._originalBorderStyle != "7px solid green") {
        event.target.style.border = "";
      }
    }
  }
}

// Function to log button clicks with XPath
function logButtonClick(event) {
  if (event.target instanceof HTMLElement) {
    // Log the button click along with its XPath
    const xpath = getXPath(event.target);
    if (xpath == lastButtonXpath) {
      console.log("Final select");
      event.target._originalBorderStyle = event.target.style.border;
      event.target.style.border = "";

      // Send both pieces of data to the background script
      chrome.runtime.sendMessage({
          action: "sendData",
        xPathList: xPathList,
        lastButtonXpath: lastButtonXpath,
      });
    } else {
      event.target.style.border = "7px solid green";
      lastButtonXpath = xpath;
      xPathList.push(xpath);
    }
    
  }
}

// Function to get XPath of an element
function getXPath(element) {
  if (element && element.id) {
    // If the element has an ID, use it for the XPath
    return 'id("' + element.id + '")';
  } else {
    // Otherwise, traverse the DOM to generate the XPath
    let path = "";
    while (element.parentNode) {
      let index = 0;
      // Find the index of the element among its siblings
      for (
        let sibling = element.previousSibling;
        sibling;
        sibling = sibling.previousSibling
      ) {
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
          index++;
        }
      }
      // Append the node name and index to the path
      const nodeName = element.nodeName.toLowerCase();
      const id = element.id ? '[@id="' + element.id + '"]' : "";
      path = "/" + nodeName + "[" + (index + 1) + "]" + id + path;
      element = element.parentNode;
    }
    return path;
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateEditMode") {
    enabled = request.editMode;
    if (enabled) {
      document.addEventListener("mouseover", handleMouseover);
      document.addEventListener("mouseout", handleMouseout);
      document.addEventListener("click", logButtonClick);
    } else {
      document.removeEventListener("mouseover", handleMouseover);
      document.removeEventListener("mouseout", handleMouseout);
      document.removeEventListener("click", logButtonClick);
    }
    sessionStorage.setItem('isEnabled', enabled + '');
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if(request.action == "getEnabled") {
    chrome.runtime.sendMessage({
      action: "enabled",
      data: enabled
    });
  }
  console.log(enabled);
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if(request.action === "openNewTab") {
    window.open(request.link, "_blank");
    return true;
  }
})

window.addEventListener('beforeunload', function (event) {
  sessionStorage.clear();
  chrome.runtime.sendMessage({ action: "getEnabled" });
})