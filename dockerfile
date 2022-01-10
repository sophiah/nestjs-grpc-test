FROM     node:14.18.2 as builder
WORKDIR  /pkg

ENV COODREAD_CONNSTR=""
ENV OTLP_ENDPOINT=""

COPY     package.json /pkg/
COPY     . .
RUN   npm i -g rimraf @nestjs/cli
RUN   rm -rf data .npmrc Dockerfile* .git \
      && npm run clean \
      && npm run build \
      && npm install --no-optional 
# removes all packages specified in the devDependencies section.
RUN      npm prune --production 

FROM     node:14.18.2-slim
WORKDIR  /app
RUN      groupadd app && useradd -g app app
# copy from build image
COPY     --chown=app:app --from=builder /pkg/node_modules /app/node_modules
COPY     --chown=app:app --from=builder /pkg/dist ./dist
USER     app
EXPOSE   8082
CMD      ["node", "dist/main.js"]