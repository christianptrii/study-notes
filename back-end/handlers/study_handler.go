package handlers

import (
	"net/http"

	"back-end/database"
	"back-end/models"

	"github.com/gin-gonic/gin"
)

// GetItems mengambil semua item checklist dari database.
func GetItems(c *gin.Context) {
	var items []models.Study
	database.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

// CreateItem membuat item checklist baru.
func CreateItem(c *gin.Context) {
	var newItem models.Study
	if err := c.ShouldBindJSON(&newItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&newItem)
	c.JSON(http.StatusCreated, newItem)
}

// UpdateItem memperbarui item checklist yang sudah ada berdasarkan ID.
func UpdateItem(c *gin.Context) {
	id := c.Param("id")
	var item models.Study
	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

// DeleteItem menghapus item checklist berdasarkan ID-nya.
func DeleteItem(c *gin.Context) {
	id := c.Param("id")
	var item models.Study
	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}
	database.DB.Delete(&item)
	c.JSON(http.StatusOK, gin.H{"message": "Item deleted successfully"})
}
