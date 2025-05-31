FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run format:check
RUN npm run format
RUN npm run build

CMD ["npm", "run", "prod"]
