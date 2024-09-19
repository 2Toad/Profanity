FROM node:20.17-alpine3.19

WORKDIR /app

COPY ../../package*.json ./

RUN npm install

COPY ../../ ./

CMD ["npx", "ts-node", "src/benchmark/benchmark.ts"]
