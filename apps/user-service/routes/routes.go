package routes

import (
	"user-service/controllers"
	"user-service/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	public := router.Group("/api/v1")
	{
		public.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
		public.POST("/register", controllers.Register)
		public.POST("/login", controllers.Login)
	}

	// Protected routes
	protected := router.Group("/api/v1")
	protected.Use(middleware.AuthMiddleware())
	{
		// Add protected routes here
		protected.GET("/me", func(c *gin.Context) {
			userId, _ := c.Get("userId")
			c.JSON(200, gin.H{"user_id": userId})
		})
	}
}
