FROM node:18-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser -S app
COPY . .
RUN npm ci --only=production --ignore-scripts
RUN chown -R app /opt/app
USER app
EXPOSE 3000
CMD [ "npm", "run", "start:watch" ]