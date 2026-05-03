FROM node:20-alpine

WORKDIR /app

# dependencies
COPY package*.json ./
RUN npm install

# copy source
COPY . .

# Prisma generate (مهم عندك)
RUN npx prisma generate --schema=src/core/prisma/schema.prisma

# build app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]