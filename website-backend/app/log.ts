// SPDX-License-Identifier: Apache-2.0
const Winston = require('winston');

class LogClass {
  private warnOnlyFilter = Winston.format((info, opts) => {
    return info.level === 'warn' ? info : false;
  });

  private options = {
    error_file: {
      level: 'error',
      filename: './logs/error.log',
      format: Winston.format.combine(Winston.format.timestamp(), Winston.format.json()),
      handleExceptions: true,
      maxsize: 5242880,
      maxfiles: 5,
    },
    warning_file: {
      level: 'warn',
      filename: './logs/warnings.log',
      format: Winston.format.combine(this.warnOnlyFilter(), Winston.format.timestamp(), Winston.format.json()),
      handleExceptions: true,
      maxsize: 5242880,
      maxfiles: 5,
    },
    console: {
      level: 'silly',
      handleExceptions: true,
      format: Winston.format.combine(Winston.format.colorize(), Winston.format.simple()),
    },
  };

  private logger;
  constructor() {
    this.logger = Winston.createLogger({
      transports: [
        new Winston.transports.File(this.options.error_file),
        new Winston.transports.File(this.options.warning_file),
        new Winston.transports.Console(this.options.console),
      ],
      exitOnError: false,
    });
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public verbose(message: string): void {
    this.logger.verbose(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public silly(message: string): void {
    this.logger.silly(message);
  }
}

module.exports = new LogClass();

export default new LogClass();
