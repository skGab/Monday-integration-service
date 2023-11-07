FROM node:18-alpine as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --production
COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD npm run start:prod
