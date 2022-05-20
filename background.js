chrome.runtime.onInstalled.addListener(() => {
  console.log("NoQuora installed.");
});

//listen on new google search requests
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    //construct new search url if it doesn't have the operator already
    const searchOperator = "-inurl:quora.com";
    const url = new URL(details.url);
    const query = url.searchParams.get("q");
    if (!query.includes(searchOperator)) {
      url.searchParams.set("q", `${query} ${searchOperator}`);
    }
    //return new request with modified search query
    return { redirectUrl: url.toString() };
  },
  { urls: ["https://www.google.com/search?*"] },
  ["blocking"]
);

//YzSd gsmt
chrome.webRequest.onCompleted.addListener(
  (details) => {
    //script to be ran in document:
    const script = () => {
      function cleanupPage() {
        const unescapedUrl = new URL(window.location.href);
        if (unescapedUrl.searchParams.get("q").includes("-inurl:quora.com")) {
          window.onload = () => {
            //try to clean up the page a bit
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

      cleanupPage();
    };

    //execute script
    chrome.tabs.executeScript({
      code: script.toString().trim().slice(7, -1),
    });
  },
  { urls: ["*://*.google.com/search?*"] }
);
