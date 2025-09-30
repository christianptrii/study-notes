FROM node:20-alpine

# Set direktori kerja
WORKDIR /app

# Copy dependency file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code
COPY . .

# Aplikasi React jalan di port 3000
EXPOSE 3000

# Jalankan React dev server
CMD ["npm", "start"]