const { PrismaClient } = require('@prisma/client');
require('server-only');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: [  'error'],
  });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({
      log: ['query','error'],
    });
  }
  prisma = global.cachedPrisma;
}

exports.db = prisma;
