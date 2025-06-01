// MonoProcessor with FULL cleanup to avoid volume stacking
(function () {
  let monoProcessorURL;

  window.addEventListener('audio_splitter_apply', async (e) => {
    const channel = e.detail;
    const mediaElements = document.querySelectorAll('video, audio');

    for (const media of mediaElements) {
      if (!media._splitter) {
        try {
          const context = new AudioContext();
          const source = context.createMediaElementSource(media);
          media._splitter = { context, source };
        } catch (err) {
          console.warn('Audio init error:', err);
          continue;
        }
      } else {
        media._splitter.source.disconnect();
        if (media._splitter.processor) {
          media._splitter.processor.disconnect();
          media._splitter.processor = null;
        }
        media._splitter.panner?.disconnect();
      }

      const context = media._splitter.context;

      if (channel === 'mono') {
        try {
          if (!monoProcessorURL) {
            monoProcessorURL = URL.createObjectURL(new Blob([`
              class MonoProcessor extends AudioWorkletProcessor {
                process(inputs, outputs) {
                  const input = inputs[0];
                  const output = outputs[0];
                  if (input.length < 2) return true;
                  const inputL = input[0];
                  const inputR = input[1];
                  const outputL = output[0];
                  const outputR = output[1];
                  for (let i = 0; i < inputL.length; i++) {
                    const mono = (inputL[i] + inputR[i]) * 0.25;
                    outputL[i] = mono;
                    outputR[i] = mono;
                  }
                  return true;
                }
              }
              registerProcessor('mono-processor', MonoProcessor);
            `], { type: 'application/javascript' }));
          }

          await context.audioWorklet.addModule(monoProcessorURL);
          const node = new AudioWorkletNode(context, 'mono-processor');
          media._splitter.source.connect(node).connect(context.destination);
          media._splitter.processor = node;
        } catch (err) {
          console.warn('Inline mono processor failed:', err);
        }
      } else {
        const panner = context.createStereoPanner();
        media._splitter.source.connect(panner).connect(context.destination);
        media._splitter.panner = panner;
        panner.pan.value = channel === 'left' ? -1 : channel === 'right' ? 1 : 0;
      }
    }
  });
})();
