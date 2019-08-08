
const { createLogger, format, transports } = require('winston');

/* const {
  combine, timestamp, label, printf,
} = format; */

// transport with level error logs only error, debug logs everything except trace etc.
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'blue',
    debug: 'cyan',
    trace: 'white',
  },
};


const coloredFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.splat(),
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
);

const noColorFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.errors({ stack: true }),
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
);

const jsonFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  format.json(),
);

const logger = createLogger({
  levels: logLevels.levels,
  transports: [
    new transports.File({
      name: 'combined',
      filename: `${__dirname}/logs/combined.log`,
      level: 'info',
      format: noColorFormat,
    }),
    new transports.Console({
      name: 'console',
      level: 'trace',
      format: coloredFormat,
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      name: 'crash',
      filename: `${__dirname}/logs/crash.log`,
      level: 'error',
      format: jsonFormat,
    }),
  ],
});

module.exports = logger;
