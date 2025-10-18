FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for development)
RUN npm ci

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Create and set permissions for .next directory
RUN mkdir -p .next && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
