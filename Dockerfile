# Use Node.js LTS as the base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy root files (if any)
# Not needed if we just rely on client and server folders

# Copy client and server
COPY client ./client
COPY server ./server

# Install client dependencies and build
WORKDIR /app/client
RUN npm install
RUN npm run build

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Expose the port the server listens on
EXPOSE 5000

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]
