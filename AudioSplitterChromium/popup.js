document.getElementById('left').addEventListener('click', () => applyChannel('left'));
document.getElementById('right').addEventListener('click', () => applyChannel('right'));
document.getElementById('none').addEventListener('click', () => applyChannel('none'));

function applyChannel(channel) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (ch) => {
          window.dispatchEvent(new CustomEvent('audio_splitter_apply', { detail: ch }));
        },
        args: [channel]
      });
    });
  });
}
