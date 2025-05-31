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

window.addEventListener('audio_splitter_apply', (e) => {
  const channel = e.detail;
  const videos = document.querySelectorAll('video, audio');

  videos.forEach(media => {
    if (media._splitter) {
      try {
        media._splitter.source.disconnect();
        media._splitter.panner.disconnect();
        media._splitter.source.connect(media._splitter.context.destination);
      } catch (e) {
        console.warn('Disconnection error:', e);
      }
    } else {
      try {
        const context = new AudioContext();
        const source = context.createMediaElementSource(media);
        const panner = context.createStereoPanner();
        source.connect(panner).connect(context.destination);
        media._splitter = { context, source, panner };
      } catch (e) {
        console.warn('Initialization error:', e);
        return;
      }
    }

    if (channel === 'none') {
      if (media._splitter && media._splitter.panner) {
        media._splitter.panner.pan.value = 0;
      }
    } else {
      media._splitter.panner.pan.value = channel === 'left' ? -1 : 1;
    }
  });
});