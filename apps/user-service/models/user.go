package models

import "time"

type User struct {
	ID                uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Name              string    `json:"name" gorm:"not null"`
	Email             string    `json:"email" gorm:"unique;not null"`
	EmailVerifiedAt   *time.Time `json:"email_verified_at"` // nullable
	Password          string    `json:"password" gorm:"not null"`
	RememberToken     *string   `json:"remember_token"` // nullable, 100-char token
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

type RegisterInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	SubscribeNewsletter bool `json:"subscribeNewsletter"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
