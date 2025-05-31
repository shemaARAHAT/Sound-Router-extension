document.getElementById('left').addEventListener('click', () => applyChannel('left'));
document.getElementById('right').addEventListener('click', () => applyChannel('right'));
document.getElementById('none').addEventListener('click', () => applyChannel('none'));

function applyChannel(channel) {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs[0];
    if (!tab) return;

    browser.tabs.executeScript(tab.id, {
      file: 'content.js'
    }).then(() => {
      browser.tabs.executeScript(tab.id, {
        code: `window.dispatchEvent(new CustomEvent('audio_splitter_apply', { detail: '${channel}' }));`
      });
    }).catch(err => console.error('Script injection error:', err));
  });
}