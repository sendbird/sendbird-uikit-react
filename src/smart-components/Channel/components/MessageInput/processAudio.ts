import { downsampleToWav, encodeMp3 } from "../../../../hooks/VoiceRecorder/WebAudioUtils";
import { VOICE_MESSAGE_FILE_NAME, VOICE_MESSAGE_MIME_TYPE } from "../../../../utils/consts";

export function processAudio(audioFile: File) {
  const job = new Promise<File>((resolve, reject) => {
    downsampleToWav(audioFile, (buffer) => {
      const mp3Buffer = encodeMp3(buffer);
      const mp3blob = new Blob(mp3Buffer, { type: VOICE_MESSAGE_MIME_TYPE });
      try {
        const convertedAudioFile = new File([mp3blob], VOICE_MESSAGE_FILE_NAME, {
          lastModified: new Date().getTime(),
          type: VOICE_MESSAGE_MIME_TYPE,
        });
        resolve(convertedAudioFile);
      } catch (error) {
        reject(error);
      }
    });
  })
  return job;
}
