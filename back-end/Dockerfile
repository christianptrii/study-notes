# Menggunakan image Go resmi yang berisi semua tools untuk kompilasi
FROM golang:1.25-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Copy file dependensi
COPY go.mod go.sum ./
# Download dependensi
RUN go mod download

# Copy seluruh source code
COPY . .

# Build aplikasi Go di dalam container
RUN go build -o /main .

# Beri tahu Docker bahwa aplikasi berjalan di port 8080
EXPOSE 8080

# Perintah untuk menjalankan aplikasi yang sudah di-build
CMD ["/main"]