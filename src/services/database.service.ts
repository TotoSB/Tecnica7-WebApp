import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // En desarrollo, evita crear múltiples instancias de PrismaClient debido al hot-reloading.
  // https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      // log: ['query', 'info', 'warn', 'error'], // Descomentar para ver logs de Prisma
    });
  }
  prisma = global.prisma;
}

export default prisma;

// Extender el objeto global de Node.js para incluir `prisma` en desarrollo
declare global {
  var prisma: PrismaClient | undefined;
}
