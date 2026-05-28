# 1. Use the official Node.js image as the foundation
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first to leverage Docker's caching mechanism
COPY package*.json ./

# 4. Install the dependencies
RUN npm install

# 5. The code itself will be handled by the bind mount (volumes) in docker-compose, 
# so I don't strictly need to COPY the rest for local development.

# 6. Expose the port my application listens on
EXPOSE 3000

