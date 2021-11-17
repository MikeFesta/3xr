// SPDX-License-Identifier: Apache-2.0
import Express = require('express');
import * as BodyParser from 'body-parser';
import { Request, Response } from 'express';
import Helmet from 'helmet';
import Log from '@root/log';
import Morgan from 'morgan';
import Path from 'path';

class App {
  constructor() {
    this.app = Express();
    this.config();
    this.routes();
    this.errors();
  }

  public app: Express.Application;

  private config(): void {
    this.app.set('view engine', 'pug');
    this.app.enable('trust proxy'); // For IP address logging

    // Configure Middleware
    this.app.use(
      Morgan('dev', {
        skip: function (req, res) {
          // Skip Errors
          return res.statusCode >= 400;
          // Note: Morgan adds an extra \n at the end, so slice it off
        },
        stream: { write: message => Log.info(message.slice(0, -1)) },
      }),
    );
    this.app.use(Helmet());
    this.app.use(BodyParser.json());
    this.app.use(BodyParser.urlencoded({ extended: false }));
    // Allow content to be loaded via www.3xr.com and dev.3xr.com
    this.app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      // TODO: figure out the correct syntax
      //res.header('Access-Control-Allow-Origin', 'dev.3xr.com');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
    });
    this.app.use(Express.static(Path.join(__dirname, '..', 'public')));
  }

  private routes(): void {
    this.app.use('/', require('./routes/index'));
    this.app.use('/assignment', require('./routes/assignment'));
    this.app.use('/asset', require('./routes/asset'));
    this.app.use('/asset_submission', require('./routes/asset_submission'));
    this.app.use('/download_zips', require('./routes/download_zips'));
    this.app.use('/messages', require('./routes/messages'));
    this.app.use('/sync', require('./routes/sync'));
    this.app.use('/upload', require('./routes/upload'));
  }

  private errors(): void {
    // error handler
    this.app.use((err: Error, req: Request, res: Response, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error', { error_message: err });
    });
  }
}

export default new App().app;
