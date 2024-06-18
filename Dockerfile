FROM node:20.11.0

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build

CMD ["npm", "run", "start:dev"]