package service

import (
	"context"
	"errors"
	"time"

	"todo-api/internal/models"
	"todo-api/internal/repository"

	"github.com/google/uuid"
)

type TodoService struct {
	repo *repository.PostgresRepository
}

func NewTodoService(repo *repository.PostgresRepository) *TodoService {
	return &TodoService{
		repo: repo,
	}
}

func (s *TodoService) Create(ctx context.Context, userID uuid.UUID, req models.CreateTodoRequest) (*models.Todo, error) {
	// Verify user exists
	_, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, errors.New("user not found - please log in again")
	}

	todo := &models.Todo{
		ID:          uuid.New(),
		UserID:      userID,
		Title:       req.Title,
		Description: req.Description,
		Priority:    req.Priority,
		Completed:   false,
		CategoryID:  req.CategoryID,
		DueDate:     req.DueDate,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := s.repo.CreateTodo(ctx, todo); err != nil {
		return nil, err
	}

	// Add tags if provided
	if len(req.Tags) > 0 {
		if err := s.repo.AddTodoTags(ctx, todo.ID, req.Tags); err != nil {
			return nil, err
		}
	}

	// Fetch the complete todo with tags
	return s.repo.GetTodoByID(ctx, todo.ID)
}

func (s *TodoService) GetByID(ctx context.Context, userID, todoID uuid.UUID) (*models.Todo, error) {
	todo, err := s.repo.GetTodoByID(ctx, todoID)
	if err != nil {
		return nil, err
	}

	// Check if user owns the todo
	if todo.UserID == userID {
		return todo, nil
	}

	// Check if the todo is shared with the user
	isShared, _, err := s.repo.IsSharedWith(ctx, todoID, userID)
	if err != nil {
		return nil, err
	}

	if !isShared {
		return nil, errors.New("todo not found or access denied")
	}

	return todo, nil
}

func (s *TodoService) GetByUserID(ctx context.Context, userID uuid.UUID) ([]models.Todo, error) {
	return s.repo.GetTodosByUserID(ctx, userID)
}

func (s *TodoService) GetSharedWithUser(ctx context.Context, userID uuid.UUID) ([]models.Todo, error) {
	return s.repo.GetSharedTodos(ctx, userID)
}

func (s *TodoService) Update(ctx context.Context, userID, todoID uuid.UUID, req models.UpdateTodoRequest) (*models.Todo, error) {
	// Get existing todo
	todo, err := s.repo.GetTodoByID(ctx, todoID)
	if err != nil {
		return nil, err
	}

	// Check if user owns the todo
	hasAccess := todo.UserID == userID

	// If user doesn't own it, check if they have write permission
	if !hasAccess {
		isShared, perm, err := s.repo.IsSharedWith(ctx, todoID, userID)
		if err != nil {
			return nil, err
		}
		if isShared && perm == "write" {
			hasAccess = true
		}
	}

	if !hasAccess {
		return nil, errors.New("access denied: you don't have permission to update this todo")
	}

	// Update fields if provided
	if req.Title != nil {
		todo.Title = *req.Title
	}
	if req.Description != nil {
		todo.Description = *req.Description
	}
	if req.CategoryID != nil {
		todo.CategoryID = req.CategoryID
	}
	if req.DueDate != nil {
		todo.DueDate = req.DueDate
	}
	if req.Priority != nil {
		todo.Priority = *req.Priority
	}
	todo.UpdatedAt = time.Now()

	if err := s.repo.UpdateTodo(ctx, todo); err != nil {
		return nil, err
	}

	// Update tags if provided
	if req.Tags != nil {
		if err := s.repo.RemoveTodoTags(ctx, todoID); err != nil {
			return nil, err
		}
		if len(req.Tags) > 0 {
			if err := s.repo.AddTodoTags(ctx, todoID, req.Tags); err != nil {
				return nil, err
			}
		}
	}

	// Fetch the updated todo with tags
	return s.repo.GetTodoByID(ctx, todoID)
}

func (s *TodoService) ToggleComplete(ctx context.Context, userID, todoID uuid.UUID) (*models.Todo, error) {
	// Get existing todo
	todo, err := s.repo.GetTodoByID(ctx, todoID)
	if err != nil {
		return nil, err
	}

	// Check if user owns the todo
	hasAccess := todo.UserID == userID

	// If user doesn't own it, check if they have write permission
	if !hasAccess {
		isShared, perm, err := s.repo.IsSharedWith(ctx, todoID, userID)
		if err != nil {
			return nil, err
		}
		if isShared && perm == "write" {
			hasAccess = true
		}
	}

	if !hasAccess {
		return nil, errors.New("access denied: you don't have permission to update this todo")
	}

	// Toggle completed status
	todo.Completed = !todo.Completed
	now := time.Now()
	if todo.Completed {
		todo.CompletedAt = &now
	} else {
		todo.CompletedAt = nil
	}
	todo.UpdatedAt = now

	if err := s.repo.UpdateTodo(ctx, todo); err != nil {
		return nil, err
	}

	return s.repo.GetTodoByID(ctx, todoID)
}

func (s *TodoService) Delete(ctx context.Context, userID, todoID uuid.UUID) error {
	// Get existing todo
	todo, err := s.repo.GetTodoByID(ctx, todoID)
	if err != nil {
		return err
	}

	// Check if user owns the todo
	if todo.UserID != userID {
		return errors.New("access denied: you can only delete your own todos")
	}

	return s.repo.DeleteTodo(ctx, todoID)
}

func (s *TodoService) ShareTodo(ctx context.Context, userID, todoID, sharedWithUserID uuid.UUID, permission string) error {
	// Get existing todo
	todo, err := s.repo.GetTodoByID(ctx, todoID)
	if err != nil {
		return err
	}

	// Check if user owns the todo
	if todo.UserID != userID {
		return errors.New("access denied: you can only share your own todos")
	}

	// Create share
	share := &models.TodoShare{
		ID:               uuid.New(),
		TodoID:           todoID,
		SharedByUserID:   userID,
		SharedWithUserID: sharedWithUserID,
		Permission:       permission,
		CreatedAt:        time.Now(),
	}

	return s.repo.ShareTodo(ctx, share)
}

func (s *TodoService) UnshareTodo(ctx context.Context, userID, todoID, sharedWithUserID uuid.UUID) error {
	// Get existing todo
	todo, err := s.repo.GetTodoByID(ctx, todoID)
	if err != nil {
		return err
	}

	// Check if user owns the todo
	if todo.UserID != userID {
		return errors.New("access denied: you can only unshare your own todos")
	}

	return s.repo.UnshareTodo(ctx, todoID, sharedWithUserID)
}

func (s *TodoService) GetTodoShares(ctx context.Context, userID, todoID uuid.UUID) ([]models.TodoShare, error) {
	// Get existing todo
	todo, err := s.repo.GetTodoByID(ctx, todoID)
	if err != nil {
		return nil, err
	}

	// Check if user owns the todo
	if todo.UserID != userID {
		return nil, errors.New("access denied: you can only view shares for your own todos")
	}

	return s.repo.GetTodoShares(ctx, todoID)
}
