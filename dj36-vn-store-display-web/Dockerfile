################################################################################
# builder
################################################################################
FROM node:20.12.0 AS builder

ARG VITE_BFF_ENDPOINT
ARG VITE_SERVER_PORT

# Inject as environment variables for Vite
ENV VITE_BFF_ENDPOINT=$VITE_BFF_ENDPOINT
ENV VITE_SERVER_PORT=$VITE_SERVER_PORT


WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build


################################################################################
# development
################################################################################
FROM node:20.12.0 AS dev

WORKDIR /app
ENV TZ=Asia/Tokyo

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]


################################################################################
# production
################################################################################
FROM nginx:stable-alpine AS prod

ARG VITE_BFF_ENDPOINT
ARG VITE_SERVER_PORT

# Inject as environment variables for Vite
ENV VITE_BFF_ENDPOINT=$VITE_BFF_ENDPOINT
ENV VITE_SERVER_PORT=$VITE_SERVER_PORT

ENV TZ=Asia/Tokyo

RUN apk add --no-cache gettext

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html


COPY ./nginx/default.conf.template /tmp/default.conf.template

RUN envsubst '${VITE_BFF_ENDPOINT} ${VITE_SERVER_PORT}' < /tmp/default.conf.template > /etc/nginx/conf.d/default.conf && \
    cat /etc/nginx/conf.d/default.conf

# Use dynamic port
EXPOSE ${VITE_SERVER_PORT}

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]