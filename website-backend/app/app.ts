// SPDX-License-Identifier: Apache-2.0
import moduleAlias from "module-alias";
moduleAlias.addAliases({
  "@root": `${__dirname}`,
  "@access": `${__dirname}/access`,
  "@cors": `${__dirname}/cors`,
  "@interfaces": `${__dirname}/interfaces`,
  "@models": `${__dirname}/models`,
  "@routes": `${__dirname}/routes`,
  "@services": `${__dirname}/services`
})
if (process.env.NODE_ENV === "production") {
  moduleAlias.addAliases({
    "@enums": `${__dirname}/../3xr_types/enums.js`
  })
} else {
  moduleAlias.addAliases({
    "@enums": `${__dirname}/../3xr_types/enums.ts`
  })
}
import express from 'express';
import * as BodyParser from 'body-parser';
import { Request, Response } from 'express';
import Favicon from 'serve-favicon';
import Helmet from 'helmet';
import Log from './log';
import Morgan from 'morgan';
import Passport from 'passport';
import Path from 'path';
import Redis from 'redis';
import Session, { SessionOptions } from 'express-session';
const RedisStore = require('connect-redis')(Session); // Needs Session, so out of order
import { User } from '@models/user';
import { authTokenStrategy, bearerStrategy, localStrategy } from './auth/strategies';
require('dotenv').config();

var redisClient = process.env.REDIS_URL ? Redis.createClient(process.env.REDIS_URL as string) : Redis.createClient();
redisClient.on('error', Log.error);

class App {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.errors();
  }

  public app: express.Application;

  private config(): void {
    this.app.set('view engine', 'pug');
    this.app.enable('trust proxy'); // For IP address logging

    // Configure Middleware
    this.app.use(
      Morgan('dev', {
        skip: function (req: express.Request, res: express.Response) {
          // Skip Errors
          return res.statusCode >= 400;
          // Note: Morgan adds an extra \n at the end, so slice it off
        },
        stream: { write: (message: string) => Log.info(message.slice(0, -1)) },
      }),
    );
    this.app.use(
      Morgan('dev', {
        skip: function (req: express.Request, res: express.Response) {
          // Skip Non-Errors
          return res.statusCode < 400;
          // Note: Morgan adds an extra \n at the end, so slice it off
        },
        stream: { write: (message: string) => Log.error(message.slice(0, -1)) },
      }),
    );
    this.app.use(Helmet());
    this.app.use(BodyParser.json());
    this.app.use(BodyParser.urlencoded({ extended: false }));
    // In production, __dirname is in the build folder, which needs to be removed
    let baseDir = __dirname;
    if (baseDir.slice(-10) === '/build/app') {
      // Production
      baseDir = baseDir.substring(0, baseDir.length - 10) + '/app';
    }
    this.app.use(Favicon(Path.join(baseDir, '..', 'public', 'images', '3.ico')));
    this.app.use(express.static(Path.join(baseDir, '..', 'public')));

    Passport.use('authtoken', authTokenStrategy);
    Passport.use(localStrategy);
    Passport.use(bearerStrategy);

    Passport.serializeUser((user: any, next: Function) => {
      next(null, user.id);
    });
    Passport.deserializeUser((id: number, next: Function) => {
      User.getUserById(id)
        .then((user: any) => {
          next(null, user);
        })
        .catch((err: Error) => {
          Log.error(err.message);
          Log.error('Problem deserializing user - logging out');
        });
    });
    const sessionSettings: SessionOptions = {
      store: new RedisStore({ client: redisClient }),
      secret: process.env.REDIS_SECRET as string,
      resave: false,
      saveUninitialized: false,
      //cookie: { sameSite: true, secure: true },
    };
    this.app.use(Session(sessionSettings));
    this.app.use(Passport.initialize());
    this.app.use(Passport.session());
  }

  private routes(): void {
    this.app.use('/', require('./routes/index'));
    this.app.use('/a', require('./routes/a'));
    this.app.use('/ar', require('./routes/ar'));
    this.app.use('/asset', require('./routes/asset'));
  }

  private errors(): void {
    // error handler
    this.app.use((err: Error, req: Request, res: Response, next: Function) => {
      // render the error page
      res.status(500);
      res.render('error', { error_message: err });
    });
  }
}

export default new App().app;
