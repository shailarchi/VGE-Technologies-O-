# Verde Grid Energy (VGE Technologies OÜ) — React Web Frontend Container

FROM node:20-alpine AS build

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm ci

# Copy web frontend source code
COPY . .

# Build Vite SPA assets
RUN npm run build

# Production serve stage
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

# Serve application build on port 3000
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
