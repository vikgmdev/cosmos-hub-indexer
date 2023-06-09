#!/bin/bash
VERSION=$(cat VERSION)
GIT_REVISION=$(cat GIT_REVISION)
COIN_TICKER='cosmos'

docker build -t node/${COIN_TICKER}:${VERSION} -f ./Dockerfile --build-arg GIT_REVISION=${GIT_REVISION} .
