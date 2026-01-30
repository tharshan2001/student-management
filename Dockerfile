# Use Node.js official image
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app in production
CMD ["npm", "start"]
