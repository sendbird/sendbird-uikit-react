import { WavHeader } from '../../_externals/lamejs/lame.all';
declare function encodeMp3(arrayBuffer: ArrayBuffer): WavHeader;
declare function downsampleToWav(file: File, callback: (buffer: ArrayBuffer) => void): void;
export { downsampleToWav, encodeMp3 };
