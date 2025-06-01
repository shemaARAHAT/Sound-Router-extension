document.getElementById('left').addEventListener('click', () => applyChannel('left'));
document.getElementById('right').addEventListener('click', () => applyChannel('right'));
document.getElementById('none').addEventListener('click', () => applyChannel('none'));
document.getElementById('mono').addEventListener('click', () => applyChannel('mono'));

function applyChannel(channel) {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs[0];
    if (!tab) return;

    browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }).then(() => {
      browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: (ch) => {
          window.dispatchEvent(new CustomEvent('audio_splitter_apply', { detail: ch }));
        },
        args: [channel]
      });
    });
  });
}
