FROM node:20-alpine AS builder

WORKDIR /app

# Disable telemetry and enforce CI-friendly install behavior.
ENV EXPO_NO_TELEMETRY=1
ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Export static web assets for hardened runtime serving.
RUN npx expo export --platform web

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist ./
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ > /dev/null || exit 1
