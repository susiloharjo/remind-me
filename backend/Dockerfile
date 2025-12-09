# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Install all dependencies (including devDependencies for tsc)
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript to JavaScript
RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Install only production dependencies
RUN npm install --only=production

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
# Copy prisma schema/migrations
COPY --from=builder /app/prisma ./prisma
# Copy generated Prisma Client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["npm", "start"]
