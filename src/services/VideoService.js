import StackOverflowVideo from '../entities/StackOverflowVideo.js';

export default class VideoService {
  static CHUNK_SIZE = 1024 * 1024; // 1 MB
  static VIDEO = StackOverflowVideo;

  currentTime;

  constructor() {
    this.currentTime = 0;
    this.#incrementTime();
  }

  /**
   * The video has started playing, increment it
   */
  #incrementTime() {
    const interval = setInterval(() => {
      console.log('Current time: ' + this.currentTime);
      this.currentTime += 1;
      if (this.currentTime >= VideoService.VIDEO.duration) {
        console.log('Video ended');
        clearInterval(interval);
        this.currentTime = 'Video ended!';
      }
    }, 1000);
  }

  calculateVideoInfo(range) {
    const start = Number(range.match(/\d+/)[0]);
    const end = Math.min(start + VideoService.CHUNK_SIZE, VideoService.VIDEO.size - 1);
    const contentLength = end - start + 1;
    return {start, end, contentLength};
  }
}