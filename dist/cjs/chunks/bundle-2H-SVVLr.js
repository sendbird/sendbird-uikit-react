'use strict';

var consts = require('./bundle-4jVvOUfV.js');
var lame_all = require('../lame.all.js');

// Thanks to https://codesandbox.io/s/media-recorder-api-downsampling-16k-mp3-encode-using-lame-js-forked-n1pblw
function encodeMp3(arrayBuffer) {
    var wav = lame_all.WavHeader.readHeader(new DataView(arrayBuffer));
    var dataView = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);
    var mp3Encoder = new lame_all.Mp3Encoder(wav.channels, wav.sampleRate, 128);
    var maxSamples = 1152;
    var samplesLeft = (wav.channels === 1) ? dataView : new Int16Array(wav.dataLen / (2 * wav.channels));
    var samplesRight = (wav.channels === 2) ? new Int16Array(wav.dataLen / (2 * wav.channels)) : undefined;
    if (wav.channels > 1) {
        for (var j = 0; j < samplesLeft.length; j++) {
            samplesLeft[j] = dataView[j * 2];
            samplesRight[j] = dataView[j * 2 + 1];
        }
    }
    var dataBuffer = [];
    var remaining = samplesLeft.length;
    for (var i = 0; remaining >= maxSamples; i += maxSamples) {
        var left = samplesLeft.subarray(i, i + maxSamples);
        var right = void 0;
        if (samplesRight) {
            right = samplesRight.subarray(i, i + maxSamples);
        }
        var mp3buf = mp3Encoder.encodeBuffer(left, right);
        dataBuffer.push(new Int8Array(mp3buf));
        remaining -= maxSamples;
    }
    var mp3Lastbuf = mp3Encoder.flush();
    dataBuffer.push(new Int8Array(mp3Lastbuf));
    return dataBuffer;
}
// Convert audioFile to arrayBuffer, because Mp3Encoder requires a parameter of ArrayBuffer type
function downsampleToWav(file, callback) {
    // Browser compatibility
    // https://caniuse.com/?search=AudioContext
    var audioCtx = new AudioContext({ sampleRate: consts.VOICE_RECORDER_AUDIO_SAMPLE_RATE });
    var fileReader = new FileReader();
    fileReader.onload = function (ev) {
        // Decode audio
        audioCtx.decodeAudioData(ev.target.result, function (buffer) {
            // this is where you down sample the audio, usually is 44100 samples per second
            var usingWebkit = !window.OfflineAudioContext;
            var offlineAudioCtx = new OfflineAudioContext(1, 16000 * buffer.duration, 16000);
            var soundSource = offlineAudioCtx.createBufferSource();
            soundSource.buffer = buffer;
            soundSource.connect(offlineAudioCtx.destination);
            var reader = new FileReader();
            reader.onload = function () {
                var renderCompleteHandler = function (evt) {
                    var renderedBuffer = usingWebkit ? evt.renderedBuffer : evt;
                    var buffer = bufferToWav(renderedBuffer, renderedBuffer.length);
                    if (callback) {
                        callback(buffer);
                    }
                };
                if (usingWebkit) {
                    offlineAudioCtx.oncomplete = renderCompleteHandler;
                    offlineAudioCtx.startRendering();
                }
                else {
                    offlineAudioCtx
                        .startRendering()
                        .then(renderCompleteHandler)
                        // eslint-disable-next-line no-console
                        .catch(function (err) { return console.warn(err); });
                }
            };
            reader.readAsArrayBuffer(file);
            soundSource.start(0);
        });
    };
    fileReader.readAsArrayBuffer(file);
}
function bufferToWav(abuffer, len) {
    var numOfChan = abuffer.numberOfChannels;
    var length = len * numOfChan * 2 + 44;
    var buffer = new ArrayBuffer(length);
    var view = new DataView(buffer);
    var channels = [];
    var i = 0;
    var sample;
    var offset = 0;
    var pos = 0;
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

exports.downsampleToWav = downsampleToWav;
exports.encodeMp3 = encodeMp3;
//# sourceMappingURL=bundle-2H-SVVLr.js.map
