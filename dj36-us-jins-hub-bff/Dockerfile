################################################################################
# builder
################################################################################
FROM node:22.13.1 AS builder

RUN apt update
RUN DEBIAN_FRONTEND=noninteractive apt install -y --no-install-recommends \
    ts-node \
    tzdata

COPY ./package*.json /
RUN npm config set strict-ssl false
RUN npm ci

################################################################################
# development
################################################################################
FROM node:22.13.1 AS dev

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
FROM stoplight/prism AS mock
COPY ./app/openapi/root.yaml /app/openapi/root.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4010", "/app/openapi/root.yaml"]

################################################################################
# mock_cart
################################################################################
FROM stoplight/prism AS mock_cart
COPY ./app/openapi/clients/carts/carts.yaml /app/openapi/clients/carts/carts.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4020", "/app/openapi/clients/carts/carts.yaml"]

################################################################################
# mock_diameter
################################################################################
FROM stoplight/prism AS mock_diameter
COPY ./app/openapi/clients/diameters/diameters.yaml /app/openapi/clients/diameters/diameters.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4030", "/app/openapi/clients/diameters/diameters.yaml"]

################################################################################
# mock_inventory
################################################################################
FROM stoplight/prism AS mock_inventory
COPY ./app/openapi/clients/inventories/inventories.yaml /app/openapi/clients/inventories/inventories.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4040", "/app/openapi/clients/inventories/inventories.yaml"]

################################################################################
# mock_item
################################################################################
FROM stoplight/prism AS mock_item
COPY ./app/openapi/clients/items/items.yaml /app/openapi/clients/items/items.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4050", "/app/openapi/clients/items/items.yaml"]

################################################################################
# mock_location
################################################################################
FROM stoplight/prism AS mock_location
COPY ./app/openapi/clients/locations/locations.yaml /app/openapi/clients/locations/locations.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4060", "/app/openapi/clients/locations/locations.yaml"]

################################################################################
# mock_oms
################################################################################
FROM stoplight/prism AS mock_oms
COPY ./app/openapi/clients/oms/oms.yaml /app/openapi/clients/oms/oms.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4070", "/app/openapi/clients/oms/oms.yaml"]

################################################################################
# mock_staff
################################################################################
FROM stoplight/prism AS mock_staff
COPY ./app/openapi/clients/staffs/staffs.yaml /app/openapi/clients/staffs/staffs.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4080", "/app/openapi/clients/staffs/staffs.yaml"]

################################################################################
# mock_warranty
################################################################################
FROM stoplight/prism AS mock_warranty
COPY ./app/openapi/clients/warranties/warranties.yaml /app/openapi/clients/warranties/warranties.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4090", "/app/openapi/clients/warranties/warranties.yaml"]

################################################################################
# mock_price
################################################################################
FROM stoplight/prism AS mock_price
COPY ./app/openapi/clients/prices/prices.yaml /app/openapi/clients/prices/prices.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4100", "/app/openapi/clients/prices/prices.yaml"]

################################################################################
# mock_sales_order
################################################################################
FROM stoplight/prism AS mock_sales_order
COPY ./app/openapi/clients/salesOrder/salesOrder.yaml /app/openapi/clients/salesOrder/salesOrder.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "4110", "/app/openapi/clients/salesOrder/salesOrder.yaml"]

################################################################################
# mock_bffValidator
################################################################################
FROM stoplight/prism AS mock_bffvalidator
COPY ./app/openapi/clients/bffValidators/bffValidators.yaml /app/openapi/clients/bffValidators/bffValidators.yaml
CMD ["mock", "-h", "0.0.0.0", "-p", "5000", "/app/openapi/clients/bffValidators/bffValidators.yaml"]

################################################################################
# production
################################################################################
FROM node:22.13.1 AS prod

ENV TZ Asia/Tokyo

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
