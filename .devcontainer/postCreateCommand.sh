#!/bin/bash
set -eu -o pipefail

git pull

source "/usr/local/share/nvm/nvm.sh"
nvm deactivate
nvm install

npm install --global pnpm
pnpm install
