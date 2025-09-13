FROM node:22.19-alpine3.21

WORKDIR /app

COPY ../../../package*.json ./

RUN npm install

COPY ../../../ ./

CMD ["npx", "ts-node", "src/tools/benchmark/benchmark.ts"]
