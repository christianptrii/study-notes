package main

import (
	"back-end/database"
	"back-end/handlers"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	// Koneksi ke database saat aplikasi dimulai.
	database.ConnectDB()

	// Inisialisasi Gin router.
	r := gin.Default()

	// Atur rute-rute API.
	r.GET("/items", handlers.GetItems)
	r.POST("/items", handlers.CreateItem)
	r.PUT("/items/:id", handlers.UpdateItem)
	r.DELETE("/items/:id", handlers.DeleteItem)

	// Jalankan server di port 8080.
	log.Println("Server berjalan di http://localhost:8080")
	r.Run(":8080")
}
