ARG NODE_VERSION=22.19.0

# Create build stage
FROM node:${NODE_VERSION}-slim AS build

# Set the working directory inside the container
WORKDIR /workspace

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Create a new stage for the production image
FROM node:${NODE_VERSION}-slim

# Set the working directory inside the container
WORKDIR /workspace

# Copy only the necessary files from the build stage
COPY --from=build /workspace/.output ./

# Define environment variables
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD ["node", "server/index.mjs"]
