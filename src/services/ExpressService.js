import express from 'express';
import path from 'path';
import VideoService from './VideoService.js';
import fs from 'fs';

export default class ExpressService extends VideoService {
  #app;
  static PORT = process.env.PORT;
  static NODE_ENV = process.env.NODE_ENV;

  /**
   * @constructor
   * When the app starts, we need to begin streaming the video
   */
  constructor() {
    super();
    this.#app = express();
  }

  #initialize() {
    this.#app.use(express.static(path.resolve('public')));
  }

  // Range: bytes=0-199

  #addLoggingMiddleware() {
    this.#app.use((req, res, next) => {
      console.log(`${req.method} ${req.path} ${req.headers.range}`);
      return next();
    });
  }

  #addVideoRoute() {
    this.#app.get('/video', async (req, res) => {
      const range = req.headers.range;
      const {start, end, contentLength} = this.calculateVideoInfo(range);
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${VideoService.VIDEO.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, headers);
      const videoStream = fs.createReadStream(VideoService.VIDEO.path, {start, end});
      videoStream.pipe(res);
    });
  }

  #addVideoTimeRoute() {
    this.#app.get('/currentTime', (req, res) => {
      return res.send(this.currentTime.toString());
    });
  }

  start() {
    this.#initialize();
    this.#addLoggingMiddleware();
    this.#addVideoRoute();
    this.#addVideoTimeRoute();
    this.#app.listen(ExpressService.PORT, () => {
      console.log(`Server is listening on port ${ExpressService.PORT}`);
    });
  }
}