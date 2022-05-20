let requestingTabId;
chrome.runtime.onInstalled.addListener(() => {
  console.log("NoQuora installed.");
});

//listen on new google search requests
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    //construct new search url
    const searchFlag = "-inurl:quora.com";
    const url = new URL(details.url);

    const query = url.searchParams.get("q");
    if (!query.includes(searchFlag)) {
      url.searchParams.set("q", `${query} ${searchFlag}`);
    }
    //update tab id before next request
    requestingTabId = details.tabId;
    //return new request with modified search query
    return { redirectUrl: url.toString() };
  },
  { urls: ["https://www.google.com/search?*"] },
  ["blocking"]
);

//YzSd gsmt
chrome.webRequest.onCompleted.addListener(
  (details) => {
    //script to be ran inside search window that hides the keyword
    const script = () => {
      function cleanSearchBox() {
        const unescapedUrl = new URL(window.location.href);
        if (unescapedUrl.searchParams.get("q").includes("-inurl:quora.com")) {
          window.onload = () => {
            const cleanString = (s) => {
              return s.replaceAll(/(-[Ii]nurl:quora.com)/g, "").trim();
            };

            const searchBox = document.querySelector("[name='q']");
            const businessPanel = document.querySelector("[class='YzSd gsmt']");

            document.title = cleanString(document.title);
            if (searchBox) {
              searchBox.value = cleanString(searchBox.value);
            }
            if (businessPanel) {
              businessPanel.innerHTML = cleanString(businessPanel.innerHTML);
            }
          };
        }
      }
      cleanSearchBox();
    };

    //execute script
    chrome.tabs.executeScript(requestingTabId, {
      code: script.toString().slice(7, -1),
    });
  },
  { urls: ["*://*.google.com/search?*"] }
);
