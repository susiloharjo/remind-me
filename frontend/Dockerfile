# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve Stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the build output to replace the default nginx contents.
# Note: verify if the output path is dist/frontend/browser or just dist/frontend depending on angular.json
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
