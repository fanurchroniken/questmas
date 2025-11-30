# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Accept build arguments (Coolify may pass these)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Also accept as environment variables (Coolify may set these directly)
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Make build script executable and use it
# This script creates .env file from environment variables
RUN chmod +x scripts/build.sh || true

# Build the application
# Create .env file from environment variables for Vite
# Coolify may pass these as ARG or ENV, so we check both
RUN if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then \
      echo "ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set!" && \
      echo "Please set these as environment variables in Coolify with 'Build Time' enabled." && \
      echo "Current VITE_SUPABASE_URL: ${VITE_SUPABASE_URL:-NOT SET}" && \
      echo "Current VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY:+SET}${VITE_SUPABASE_ANON_KEY:-NOT SET}" && \
      exit 1; \
    fi && \
    echo "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" > .env && \
    echo "VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY" >> .env && \
    echo "Environment variables configured for build" && \
    npm run build

# Production stage
FROM nginx:alpine

# Ensure JavaScript files are mapped to application/javascript in mime.types
# Replace any text/javascript entries with application/javascript
RUN sed -i 's|text/javascript|application/javascript|g' /etc/nginx/mime.types

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration with proper MIME types
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Test nginx configuration to ensure it's valid
RUN nginx -t

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

