#!/bin/bash
VERSION=$(cat VERSION)
COIN_TICKER='cosmos'
COIN_DIR='gaianode'
NODE_RPC_PORT=30500

docker run -dit \
  -v $(pwd)/app.toml:/wallets/${COIN_DIR}/config/app.toml \
  -v $(pwd)/config.toml:/wallets/${COIN_DIR}/config/config.toml \
  -v ${COIN_TICKER}_data:/wallets/${COIN_DIR}/data \
  -p ${NODE_RPC_PORT}:1317 \
  -p 26656:26656 \
  --name ${COIN_TICKER}-${VERSION} \
  --restart always \
  node/${COIN_TICKER}:${VERSION}
  
#   -v $(pwd)/cosmoshub-4-pruned.20230607.0310.tar.lz4:/snapshot/cosmoshub-4-pruned.20230607.0310.tar.lz4 \

# # docker run -d --name temp-container -v gaianode_data:/wallets/gaianode/data -v /home/vick/Challenges/Scanworks/node/cosmoshub-4-pruned.20230607.0310.tar.lz4:/snapshot/cosmoshub-4-pruned.20230607.0310.tar.lz4 ubuntu:22.04 sleep infinity

# # docker exec temp-container cp /snapshot/cosmoshub-4-pruned.20230607.0310.tar.lz4 /wallets/gaianode/data/

# rm -rf data/*
# lz4 -d cosmoshub-4-pruned.20230607.0310.tar.lz4 | tar xf -