
// background.js

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectScript') {
    browser.scripting.executeScript({
      target: { tabId: request.tabId },
      func: setAudioChannel,
      args: [request.channel]
    });
  }
});

function setAudioChannel(channel) {
  window.dispatchEvent(new CustomEvent('audio_splitter_apply', { detail: channel }));
}
