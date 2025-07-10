#!/bin/bash
set -eu -o pipefail

git pull

source "/usr/local/share/nvm/nvm.sh"
nvm deactivate
nvm install

export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
npm install --global corepack@latest
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
