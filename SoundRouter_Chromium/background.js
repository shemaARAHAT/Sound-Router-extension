
// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectScript') {
    chrome.scripting.executeScript({
      target: { tabId: request.tabId },
      func: setAudioChannel,
      args: [request.channel]
    });
  }
});

function setAudioChannel(channel) {
  window.dispatchEvent(new CustomEvent('audio_splitter_apply', { detail: channel }));
}
