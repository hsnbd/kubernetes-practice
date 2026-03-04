package models

import (
	"time"

	"github.com/google/uuid"
)

// User represents a user in the system
type User struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Name         string    `json:"name"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Todo represents a todo item
type Todo struct {
	ID          uuid.UUID  `json:"id"`
	UserID      uuid.UUID  `json:"user_id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Completed   bool       `json:"completed"`
	Priority    int        `json:"priority"`
	DueDate     *time.Time `json:"due_date,omitempty"`
	CategoryID  *uuid.UUID `json:"category_id,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
	Category    *Category  `json:"category,omitempty"`
	Tags        []Tag      `json:"tags,omitempty"`
}

// Category represents a todo category
type Category struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Name      string    `json:"name"`
	Color     string    `json:"color"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Tag represents a todo tag
type Tag struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

// TodoShare represents a shared todo
type TodoShare struct {
	ID               uuid.UUID `json:"id"`
	TodoID           uuid.UUID `json:"todo_id"`
	SharedByUserID   uuid.UUID `json:"shared_by_user_id"`
	SharedWithUserID uuid.UUID `json:"shared_with_user_id"`
	Permission       string    `json:"permission"`
	CreatedAt        time.Time `json:"created_at"`
}

// Request/Response DTOs

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Name     string `json:"name" binding:"required,min=2"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type CreateCategoryRequest struct {
	Name  string `json:"name" binding:"required,max=100"`
	Color string `json:"color" binding:"required,len=7"`
}

type UpdateCategoryRequest struct {
	Name  string `json:"name" binding:"omitempty,max=100"`
	Color string `json:"color" binding:"omitempty,len=7"`
}

type CreateTagRequest struct {
	Name string `json:"name" binding:"required,max=50"`
}

type CreateTodoRequest struct {
	Title       string      `json:"title" binding:"required,max=255"`
	Description string      `json:"description"`
	CategoryID  *uuid.UUID  `json:"category_id"`
	DueDate     *time.Time  `json:"due_date"`
	Priority    int         `json:"priority"`
	Tags        []uuid.UUID `json:"tags"`
}

type UpdateTodoRequest struct {
	Title       *string     `json:"title" binding:"omitempty,max=255"`
	Description *string     `json:"description"`
	CategoryID  *uuid.UUID  `json:"category_id"`
	DueDate     *time.Time  `json:"due_date"`
	Priority    *int        `json:"priority"`
	Tags        []uuid.UUID `json:"tags"`
}

type ShareTodoRequest struct {
	SharedWithUserID uuid.UUID `json:"shared_with_user_id" binding:"required"`
	Permission       string    `json:"permission" binding:"required,oneof=read write"`
}

type TodoFilters struct {
	CategoryID *uuid.UUID
	Completed  *bool
	Search     string
	Tag        *uuid.UUID
}
