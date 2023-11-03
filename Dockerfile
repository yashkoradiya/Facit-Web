FROM node:16-alpine3.16
WORKDIR /app

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN  yarn install && yarn cache clean
COPY . .
RUN yarn build
RUN yarn test

FROM nginx:alpine
WORKDIR /app
COPY nginx.conf /etc/nginx/
COPY openssl.cnf /etc/ssl/
COPY --from=0 /app/dist/. /app/html/
CMD ["nginx", "-g", "daemon off;"]
#