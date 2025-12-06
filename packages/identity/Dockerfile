FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --production

COPY . .
RUN yarn build

EXPOSE 4100

CMD ["node", "dist/index.js"]
