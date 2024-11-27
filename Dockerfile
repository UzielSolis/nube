# Use the official Node.js image as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the builder stage
WORKDIR /app

# Copy package.json and package-lock.json from the examen_1 folder for dependency installation
COPY examen_1/package*.json ./examen_1/

# Install dependencies inside the examen_1 folder
RUN cd examen_1 && npm install

# Copy the rest of the project files from examen_1
COPY examen_1 /app/examen_1

# Build the TypeScript files if necessary
RUN cd examen_1 && npm run build

# Use a lightweight Node.js image for the final stage
FROM node:18-alpine

# Set the working directory for the final image
WORKDIR /app

# Copy only the built files and node_modules from the builder stage
COPY --from=builder /app/examen_1/dist ./dist
COPY --from=builder /app/examen_1/node_modules ./node_modules

# Expose the port your application runs on (adjust if needed)
EXPOSE 3000

# Define the command to run your app
CMD ["node", "dist/index.js"]
