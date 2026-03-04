package repository

import (
	"context"

	"todo-api/internal/models"

	"github.com/google/uuid"
)

// Repository defines the interface for data access
type Repository interface {
	// User methods
	CreateUser(ctx context.Context, user *models.User) error
	GetUserByID(ctx context.Context, userID uuid.UUID) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)

	// Category methods
	CreateCategory(ctx context.Context, category *models.Category) error
	GetCategoryByID(ctx context.Context, categoryID uuid.UUID) (*models.Category, error)
	GetCategoriesByUserID(ctx context.Context, userID uuid.UUID) ([]models.Category, error)
	UpdateCategory(ctx context.Context, category *models.Category) error
	DeleteCategory(ctx context.Context, categoryID uuid.UUID) error

	// Tag methods
	CreateTag(ctx context.Context, tag *models.Tag) error
	GetTagByID(ctx context.Context, tagID uuid.UUID) (*models.Tag, error)
	GetTagsByUserID(ctx context.Context, userID uuid.UUID) ([]models.Tag, error)
	DeleteTag(ctx context.Context, tagID uuid.UUID) error

	// Todo methods
	CreateTodo(ctx context.Context, todo *models.Todo) error
	GetTodoByID(ctx context.Context, todoID uuid.UUID) (*models.Todo, error)
	GetTodosByUserID(ctx context.Context, userID uuid.UUID) ([]models.Todo, error)
	GetSharedTodos(ctx context.Context, userID uuid.UUID) ([]models.Todo, error)
	UpdateTodo(ctx context.Context, todo *models.Todo) error
	DeleteTodo(ctx context.Context, todoID uuid.UUID) error

	// Todo tags methods
	AddTodoTags(ctx context.Context, todoID uuid.UUID, tagIDs []uuid.UUID) error
	RemoveTodoTags(ctx context.Context, todoID uuid.UUID) error
	GetTodoTags(ctx context.Context, todoID uuid.UUID) ([]models.Tag, error)

	// Todo sharing methods
	ShareTodo(ctx context.Context, share *models.TodoShare) error
	UnshareTodo(ctx context.Context, todoID, sharedWithUserID uuid.UUID) error
	GetTodoShares(ctx context.Context, todoID uuid.UUID) ([]models.TodoShare, error)
	IsSharedWith(ctx context.Context, todoID, userID uuid.UUID) (bool, string, error)
}
