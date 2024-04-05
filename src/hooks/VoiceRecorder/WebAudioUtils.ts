// Thanks to https://codesandbox.io/s/media-recorder-api-downsampling-16k-mp3-encode-using-lame-js-forked-n1pblw
import { VOICE_RECORDER_AUDIO_SAMPLE_RATE } from '../../utils/consts';
import { WavHeader, Mp3Encoder } from '../../_externals/lamejs/lame.all';

function encodeMp3(arrayBuffer: ArrayBuffer): WavHeader {
  const wav = WavHeader.readHeader(new DataView(arrayBuffer));
  const dataView = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);
  const mp3Encoder = new Mp3Encoder(wav.channels, wav.sampleRate, 128);
  const maxSamples = 1152;

  const samplesLeft = (wav.channels === 1) ? dataView : new Int16Array(wav.dataLen / (2 * wav.channels));
  const samplesRight = (wav.channels === 2) ? new Int16Array(wav.dataLen / (2 * wav.channels)) : undefined;

  if (wav.channels > 1) {
    for (let j = 0; j < samplesLeft.length; j++) {
      samplesLeft[j] = dataView[j * 2];
      if (samplesRight) {
        samplesRight[j] = dataView[j * 2 + 1];
      }
    }
  }

  const dataBuffer: Int8Array[] = [];
  let remaining = samplesLeft.length;
  for (let i = 0; remaining >= maxSamples; i += maxSamples) {
    const left = samplesLeft.subarray(i, i + maxSamples);
    let right;
    if (samplesRight) {
      right = samplesRight.subarray(i, i + maxSamples);
    }
    const mp3buf = mp3Encoder.encodeBuffer(left, right);
    dataBuffer.push(new Int8Array(mp3buf));
    remaining -= maxSamples;
  }

  const mp3Lastbuf = mp3Encoder.flush();
  dataBuffer.push(new Int8Array(mp3Lastbuf));
  return dataBuffer;
}

// Convert audioFile to arrayBuffer, because Mp3Encoder requires a parameter of ArrayBuffer type
function downsampleToWav(file: File, callback: (buffer: ArrayBuffer) => void): void {
  // Browser compatibility
  // https://caniuse.com/?search=AudioContext
  const audioCtx = new AudioContext({ sampleRate: VOICE_RECORDER_AUDIO_SAMPLE_RATE });
  const fileReader = new FileReader();
  fileReader.onload = function (ev) {
    // Decode audio
    audioCtx.decodeAudioData(ev.target?.result as ArrayBuffer, (buffer) => {
      // this is where you down sample the audio, usually is 44100 samples per second
      const usingWebkit = !window.OfflineAudioContext;
      const offlineAudioCtx = new OfflineAudioContext(1, 16000 * buffer.duration, 16000);

      const soundSource = offlineAudioCtx.createBufferSource();
      soundSource.buffer = buffer;
      soundSource.connect(offlineAudioCtx.destination);

      const reader = new FileReader();
      reader.onload = function () {
        const renderCompleteHandler = (evt): void => {
          const renderedBuffer = usingWebkit ? evt.renderedBuffer : evt;
          const buffer = bufferToWav(renderedBuffer, renderedBuffer.length);
          if (callback) {
            callback(buffer);
          }
        };
        if (usingWebkit) {
          offlineAudioCtx.oncomplete = renderCompleteHandler;
          offlineAudioCtx.startRendering();
        } else {
          offlineAudioCtx
            .startRendering()
            .then(renderCompleteHandler)
            // eslint-disable-next-line no-console
            .catch((err) => console.warn(err));
        }
      };
      reader.readAsArrayBuffer(file);
      soundSource.start(0);
    });
  };
  fileReader.readAsArrayBuffer(file);
}

function bufferToWav(abuffer, len) {
  const numOfChan = abuffer.numberOfChannels;
  const length = len * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let i = 0;
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this demo)
  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length
  // write interleaved data
  for (i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true); // write 16-bit sample
      pos += 2;
    }
    offset++; // next source sample
  }

  return buffer;

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

export { downsampleToWav, encodeMp3 };
