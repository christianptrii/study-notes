package database

import (
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"back-end/models"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "root:@tcp(localhost:3306)/study-notes?charset=utf8mb4&parseTime=True&loc=Local"

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connection established!")

	err = DB.AutoMigrate(&models.Study{})
	if err != nil {
		log.Fatal("Failed to auto-migrate database schema:", err)
	}
}
