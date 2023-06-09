# Use the golang official image as a base image
FROM golang:1.18 as builder

ARG GIT_REVISION
WORKDIR /usr/src

# Install necessary dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y make gcc git 

# Clone the Cosmos Gaia
RUN git clone https://github.com/cosmos/gaia.git && \
  cd gaia && \
  git checkout ${GIT_REVISION} && \
  make install

RUN chmod +x /usr/src/gaia/cmd/gaiad
RUN chown 1000:1000 /usr/src/gaia/cmd/gaiad
RUN gaiad init cosmos-indexer-js --chain-id cosmoshub-4 --home /usr/src/.gaia

# Use ubuntu:22.04 for the runtime
FROM ubuntu:22.04

ENV COIN_DIR gaianode
ENV CUSTOM_MONIKER "cosmos-indexer-js"

# Install runtime dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
  ca-certificates \
  curl \
  wget \
  liblz4-tool \
  aria2 \
  && rm -rf /var/lib/apt/lists/*  && \
  /usr/sbin/groupadd -g 1000 node && \
  /usr/sbin/useradd -u 1000 -g node node && \
  mkdir -p /wallets/bin && \
  mkdir -p /wallets/${COIN_DIR}/config && \
  mkdir -p /wallets/${COIN_DIR}/data

# Create node for the runtime
WORKDIR /wallets/bin/

VOLUME /wallets/${COIN_DIR}

# Expose P2P and RPC ports
EXPOSE 26656 26657 1317

# Copy the node binary from the builder stage
COPY --from=builder /go/bin/gaiad /wallets/bin
COPY --from=builder /usr/src/.gaia/config /wallets/${COIN_DIR}/config
COPY --from=builder /usr/src/.gaia/data /wallets/${COIN_DIR}/data

RUN chown -R node:node /wallets

RUN curl https://dl2.quicksync.io/json/addrbook.cosmos.json > /wallets/${COIN_DIR}/config/addrbook.json
RUN wget https://raw.githubusercontent.com/cosmos/mainnet/master/genesis/genesis.cosmoshub-4.json.gz
RUN gzip -d genesis.cosmoshub-4.json.gz
RUN mv genesis.cosmoshub-4.json /wallets/${COIN_DIR}/config/genesis.json

# USER node

# Start the node
CMD ["/wallets/bin/gaiad", "start", "--x-crisis-skip-assert-invariants", "--home", "/wallets/gaianode"]
