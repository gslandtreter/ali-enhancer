chrome.webRequest.onCompleted.addListener(
  (details) => {
    // Ignore non XHR requests.
    if (details.type !== "xmlhttprequest") {
      return;
    }

    setTimeout(() => {
      chrome.scripting
        .executeScript({
          files: ["js/injected_finder.js"],
          target: {
            tabId: details.tabId,
          },
          // @ts-ignore
          world: "MAIN",
        })
        .catch(() => {});
    }, 200);
  },
  {
    urls: ["*://*.sebrae.com.br/*"],
  }
);
