FROM mcr.microsoft.com/devcontainers/javascript-node:24

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

# The base image's global pnpm sits ahead of corepack on PATH.
RUN npm uninstall -g pnpm

RUN corepack enable

RUN mkdir -p "$PNPM_HOME" \
 && chown -R node:node /home/node/.local

RUN npm install -g vercel@63.0.1
