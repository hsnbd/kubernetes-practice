package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	DatabaseURL        string
	JWTSecret          string
	JWTExpirationHours int
	GinMode            string
	LogLevel           string
	CORSOrigins        []string
}

func Load() *Config {
	// Load .env file if it exists (optional)
	_ = godotenv.Load()

	config := &Config{
		Port:               getEnv("PORT", "8080"),
		DatabaseURL:        getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/tododb?sslmode=disable"),
		JWTSecret:          getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
		JWTExpirationHours: getEnvAsInt("JWT_EXPIRATION_HOURS", 24),
		GinMode:            getEnv("GIN_MODE", "debug"),
		LogLevel:           getEnv("LOG_LEVEL", "debug"),
		CORSOrigins:        parseOrigins(getEnv("CORS_ORIGINS", "*")),
	}

	// Validate required fields
	if config.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	return config
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}

func parseOrigins(origins string) []string {
	if origins == "" {
		return []string{}
	}

	result := []string{}
	current := ""

	for _, char := range origins {
		if char == ',' {
			if current != "" {
				result = append(result, current)
				current = ""
			}
		} else {
			current += string(char)
		}
	}

	if current != "" {
		result = append(result, current)
	}

	return result
}
