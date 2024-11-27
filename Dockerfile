# Use the official Node.js image as the base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the TypeScript files if necessary
RUN npm run build

# Use a lightweight Node.js image for the final stage
FROM node:18-alpine

# Set the working directory for the final image
WORKDIR /app

# Copy only the built files from the previous stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your application runs on (adjust if needed)
EXPOSE 3000

# Define the command to run your app
CMD ["node", "dist/index.js"]
