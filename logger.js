
const winston = require('winston');


const logger = new (winston.Logger)({    
    transports: [
      new (winston.transports.File)({
        name: 'info-file',
        filename: './logs/combined.log',
        level: 'info'
      }),
      new (winston.transports.File)({
        name: 'error-file',
        filename: './logs/combined.log',
        level: 'error',
        handleExceptions: true,
        humanReadableUnhandledException: true
      }),
      new (winston.transports.File)({
        name: 'crash',
        filename: './logs/crash.log',
        level: 'error',
        handleExceptions: true,
        humanReadableUnhandledException: true
      }),
      new (winston.transports.Console)({
        name: "console",
        level: "info",
        prettyPrint: true,
        timestamp: true,
        colorize: true,
        handleExceptions: true,
        humanReadableUnhandledException: true        
      })
    ],    
  });

  module.exports = logger;
  
