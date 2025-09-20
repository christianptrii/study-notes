package database

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"back-end/models"
)

var DB *gorm.DB

func ConnectDB() {
	// Contoh DSN untuk PostgreSQL
	// Pastikan untuk mengganti "user", "password", "host", "port", dan "dbname"
	dsn := "host=localhost user=postgres password=12345 dbname=study-notes port=5432 sslmode=disable TimeZone=Asia/Jakarta"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connection established!")

	err = DB.AutoMigrate(&models.Study{})
	if err != nil {
		log.Fatal("Failed to auto-migrate database schema:", err)
	}
}
