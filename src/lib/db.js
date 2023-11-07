const { PrismaClient } = require('@prisma/client');
const { logger } = require('./logger');
require('server-only');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'warn', emit: 'event' },
      { level: 'info', emit: 'event' },
      { level: 'error', emit: 'event' },
    ]
  });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'warn', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'error', emit: 'event' },
      ]
    });
  }
  prisma = global.cachedPrisma;
}

prisma.$on('warn', (e) => {
  
  logger.warn(e.message, e.target)
})
prisma.$on('info', (e) => {
 logger.info( e.message, e.target)
})

prisma.$on('error', (e) => {
  logger.error(e.message, e.target)
})
prisma.$on('query', (e) => {
  logger.info("Execute Query", e.query, "Params", e.params,"Duration",e.duration, 'ms')
})

exports.db = prisma;
