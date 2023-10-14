const winston = require('winston');

// Define the logger configuration
//TODO : Add timestamp for production
const environment = process.env.NODE_ENV || 'dev';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.printf(({ level, message, timestamp }) => {
                    return ` [${level}]: ${message}`;
                })),
        }),
        new winston.transports.File({ 
            filename: 'src/logs/error.log', 
            level: 'error',
            format: winston.format.json()
        }),
        new winston.transports.File({
            filename: 'src/logs/combined.log',
            format: winston.format.json()
        })
    ]
});

module.exports = { logger };
