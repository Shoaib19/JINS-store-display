################################################################################
# builder
################################################################################
FROM node:20.12.0 as builder

RUN apt update
RUN DEBIAN_FRONTEND=noninteractive apt install -y --no-install-recommends \
    ts-node \
    tzdata

COPY ./package*.json /
RUN npm ci

################################################################################
# development
################################################################################
FROM node:20.12.0 as dev

COPY --from=builder /usr/bin /usr/bin
COPY --from=builder /usr/lib /usr/lib
COPY --from=builder /usr/share /usr/share
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /usr/local/lib /usr/local/lib
COPY --from=builder /node_modules /workspace/node_modules

WORKDIR /workspace

RUN apt update
RUN DEBIAN_FRONTEND=noninteractive apt install -y --no-install-recommends \
    ca-certificates \
    git \
    jq

RUN git config --global --add safe.directory /workspace

################################################################################
# mock
################################################################################
FROM stoplight/prism as mock
COPY ./app/openapi/root.yaml /app/openapi/root.yaml
CMD ["mock", "-h", "0.0.0.0", "/app/openapi/root.yaml"]

################################################################################
# production
################################################################################
FROM node:20.12.0 as prod

ENV TZ Asia/Ulaanbaatar

COPY --from=builder /usr/bin /usr/bin
COPY --from=builder /usr/lib /usr/lib
COPY --from=builder /usr/share /usr/share
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /usr/local/lib /usr/local/lib
COPY --from=builder /node_modules /app/node_modules

WORKDIR /app/
COPY ./app/src /app/src
COPY ./app/openapi /app/openapi
COPY ./app/*.ts /app/
COPY ./tsconfig.json /tsconfig.json

CMD ["ts-node", "-r", "tsconfig-paths/register", "./server.ts"]
