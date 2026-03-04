package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"todo-api/internal/config"
	"todo-api/internal/handler"
	"todo-api/internal/middleware"
	"todo-api/internal/repository"
	"todo-api/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Setup logger
	logger, _ := zap.NewProduction()
	if cfg.LogLevel == "debug" {
		logger, _ = zap.NewDevelopment()
	}
	defer logger.Sync()

	// Set Gin mode
	gin.SetMode(cfg.GinMode)

	// Connect to database
	dbpool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		logger.Fatal("Unable to connect to database", zap.Error(err))
	}
	defer dbpool.Close()

	// Verify database connection
	if err := dbpool.Ping(context.Background()); err != nil {
		logger.Fatal("Unable to ping database", zap.Error(err))
	}
	logger.Info("Connected to database successfully")

	// Initialize repository
	repo := repository.NewPostgresRepository(dbpool)

	// Initialize services
	authService := service.NewAuthService(repo, cfg.JWTSecret, cfg.JWTExpirationHours)
	todoService := service.NewTodoService(repo)
	categoryService := service.NewCategoryService(repo)
	tagService := service.NewTagService(repo)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService)
	todoHandler := handler.NewTodoHandler(todoService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	tagHandler := handler.NewTagHandler(tagService)

	// Setup router
	router := gin.Default()

	// Global middleware
	router.Use(middleware.RequestIDMiddleware())

	// CORS configuration
	corsConfig := cors.Config{
		AllowOrigins:     cfg.CORSOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(corsConfig))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	// API routes
	api := router.Group("/api")
	{
		// Auth routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.GET("/me", middleware.AuthMiddleware(cfg.JWTSecret), authHandler.GetMe)
		}

		// Protected routes
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))
		{
			// Todo routes
			todos := protected.Group("/todos")
			{
				todos.POST("", todoHandler.Create)
				todos.GET("", todoHandler.GetAll)
				todos.GET("/shared", todoHandler.GetShared)
				todos.GET("/:id", todoHandler.GetByID)
				todos.PUT("/:id", todoHandler.Update)
				todos.PATCH("/:id/complete", todoHandler.ToggleComplete)
				todos.DELETE("/:id", todoHandler.Delete)
				todos.POST("/:id/share", todoHandler.ShareTodo)
				todos.DELETE("/:id/share/:userId", todoHandler.UnshareTodo)
				todos.GET("/:id/shares", todoHandler.GetShares)
			}

			// Category routes
			categories := protected.Group("/categories")
			{
				categories.POST("", categoryHandler.Create)
				categories.GET("", categoryHandler.GetAll)
				categories.PUT("/:id", categoryHandler.Update)
				categories.DELETE("/:id", categoryHandler.Delete)
			}

			// Tag routes
			tags := protected.Group("/tags")
			{
				tags.POST("", tagHandler.Create)
				tags.GET("", tagHandler.GetAll)
				tags.DELETE("/:id", tagHandler.Delete)
			}
		}
	}

	// Create HTTP server
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	// Start server in goroutine
	go func() {
		logger.Info(fmt.Sprintf("Server starting on port %s", cfg.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Failed to start server", zap.Error(err))
		}
	}()

	// Wait for interrupt signal for graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("Shutting down server...")

	// Graceful shutdown with 5 second timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server forced to shutdown", zap.Error(err))
	}

	logger.Info("Server exited")
}
