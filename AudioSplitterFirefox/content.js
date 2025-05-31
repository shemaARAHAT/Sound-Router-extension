window.addEventListener('audio_splitter_apply', (e) => {
    const channel = e.detail;
    const mediaElements = document.querySelectorAll('video, audio');
  
    mediaElements.forEach(media => {
      if (!media._splitter) {
        try {
          const context = new AudioContext();
          const source = context.createMediaElementSource(media);
          const panner = context.createStereoPanner();
          source.connect(panner).connect(context.destination);
          media._splitter = { context, source, panner };
        } catch (err) {
          console.warn('Error initializing audio splitter:', err);
          return;
        }
      }
  
      if (channel === 'none') {
        media._splitter.panner.pan.value = 0;
      } else {
        media._splitter.panner.pan.value = (channel === 'left') ? -1 : 1;
      }
    });
  });