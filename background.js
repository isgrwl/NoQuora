chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension installed");
});

/*chrome.tabs.onUpdated.addListener((id, info, tab) => {
  console.log(tab.url.slice(0, 29));
  if (tab.pendingUrl) {
    console.log(tab.pendingUrl);
    if (tab.pendingUrl.slice(0, 29) === "https://www.google.com/search") {
      tab.pendingUrl = "https://pro-wash.ca";
    }
  }
});*/

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.log(details);
  },
  { urls: ["https://*.google.com/*"] }
);
