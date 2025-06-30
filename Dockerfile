# ---- Base Stage ----
# Usar una imagen base de Node.js. Alpine es ligera.
# Especificar la versión de Node que coincida con la de desarrollo (ej. LTS)
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# Instalar dependencias de Prisma (como openssl para algunas conexiones)
# Esto puede variar según la imagen base y los requerimientos de Prisma/PostgreSQL
# Para Alpine, a veces se necesita libpq o openssl
# RUN apk add --no-cache openssl libpq # Descomentar si es necesario para Prisma/PostgreSQL

# Copiar package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# ---- Dependencies Stage ----
# Instalar solo dependencias de producción primero para una mejor gestión de caché
FROM base AS dependencies
RUN npm install --omit=dev --no-optional
# Si tienes dependencias opcionales que son necesarias en producción, ajusta el flag.
# Copiar todo el contenido de node_modules de producción
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# Instalar todas las dependencias (incluyendo devDependencies) para la etapa de build
RUN npm install

# ---- Build Stage ----
# Copiar el resto del código fuente (incluyendo prisma schema)
FROM dependencies AS build
COPY . .

# Generar Prisma Client (necesario antes de compilar Typescript si se importa el cliente generado)
# Este paso depende de las devDependencies (prisma CLI)
RUN npx prisma generate

# Compilar Typescript a Javascript
RUN npm run build
# Esto ejecutará 'tsc' según lo definido en package.json, compilando src -> dist

# ---- Production Stage ----
# Usar una imagen más pequeña para producción
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Copiar variables de entorno de build-time si es necesario (ej. DATABASE_URL para migraciones)
# Aunque es mejor pasarlas en runtime a través de docker-compose

# Copiar dependencias de producción desde la etapa 'dependencies'
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copiar los artefactos de build (código Javascript compilado y Prisma client) desde la etapa 'build'
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma 
# Es importante copiar el schema.prisma para que Prisma Client funcione en runtime si lo necesita
# y también para ejecutar migraciones en producción si se decide hacerlo así.
# El cliente generado (node_modules/.prisma/client) ya está en node_modules.

# Copiar la carpeta 'public' que contiene los archivos estáticos del frontend
COPY --from=build /usr/src/app/public ./public

# Copiar package.json para que el comando start (node dist/server.js) funcione si es referenciado
# y para que Prisma sepa dónde encontrar el schema si es necesario
COPY package*.json ./ 

# Exponer el puerto en el que corre la aplicación (según src/config.ts o .env)
# El valor por defecto es 3000
EXPOSE 3000 

# Comando para ejecutar la aplicación
# NODE_ENV=production es importante para optimizaciones y para que PrismaClient no use el global hack
CMD ["node", "dist/server.js"]
# Se puede añadir un script de entrypoint para ejecutar migraciones antes de iniciar, si se desea.
# ENTRYPOINT ["./entrypoint.sh"] # Ejemplo
# Y el entrypoint.sh podría ser:
# #!/bin/sh
# npx prisma migrate deploy # Aplica migraciones pendientes en producción
# exec "$@" # Ejecuta el CMD
# Asegúrate de que entrypoint.sh sea ejecutable (chmod +x) y copiado a la imagen.
# Por ahora, las migraciones se manejarán manualmente o como un paso separado.
