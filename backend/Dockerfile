# ==========================================
# STAGE 1: The Build Environment
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package management files first to leverage Docker layer caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies like TypeScript)
RUN npm ci

# Copy the rest of the backend source code
COPY . .

# Compile TypeScript to JavaScript (assumes output directory is /dist)
RUN npm run build

# Remove development dependencies, leaving only production modules
RUN npm prune --production

# ==========================================
# STAGE 2: The Production Runtime
# ==========================================

FROM node:20-alpine

# Set node environment to production (hides dev logs, optimizes performance)
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install ONLY production dependencies (ignores nodemon entirely)
RUN npm ci --omit=dev

# Copy the rest of your backend source files
COPY . .

# Run the container under a non-privileged system user for security
USER node

# Expose your backend server port (make sure your Express app listens on this port!)
EXPOSE 5000

# Start the application using native Node.js (avoid nodemon in production)
CMD ["node", "index.js"]