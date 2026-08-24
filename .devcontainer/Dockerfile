FROM mcr.microsoft.com/devcontainers/javascript-node:24

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable && corepack prepare pnpm@10 --activate \
 && mkdir -p "$PNPM_HOME" \
 && chown -R node:node "$PNPM_HOME"
