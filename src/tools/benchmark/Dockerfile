FROM node:24.14-alpine3.23

WORKDIR /app

COPY ../../../package*.json ./

RUN npm install

COPY ../../../ ./

CMD ["npx", "ts-node", "src/tools/benchmark/benchmark.ts"]
