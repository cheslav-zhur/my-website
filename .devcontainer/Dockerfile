FROM mcr.microsoft.com/devcontainers/javascript-node:24

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

# The base image ships pnpm on npm-global, earlier on PATH than corepack.
RUN corepack enable \
 && rm -f /usr/local/share/npm-global/bin/pn /usr/local/share/npm-global/bin/pnpm \
    /usr/local/share/npm-global/bin/pnpx /usr/local/share/npm-global/bin/pnx \
 && mkdir -p "$PNPM_HOME" \
 && chown -R node:node "$PNPM_HOME"
