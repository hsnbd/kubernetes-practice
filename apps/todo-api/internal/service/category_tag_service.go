package service

import (
	"context"
	"errors"
	"time"

	"todo-api/internal/models"
	"todo-api/internal/repository"

	"github.com/google/uuid"
)

// CategoryService handles category business logic
type CategoryService struct {
	repo *repository.PostgresRepository
}

func NewCategoryService(repo *repository.PostgresRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) Create(ctx context.Context, userID uuid.UUID, req models.CreateCategoryRequest) (*models.Category, error) {
	category := &models.Category{
		ID:        uuid.New(),
		UserID:    userID,
		Name:      req.Name,
		Color:     req.Color,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.repo.CreateCategory(ctx, category); err != nil {
		return nil, err
	}

	return category, nil
}

func (s *CategoryService) GetByID(ctx context.Context, userID, categoryID uuid.UUID) (*models.Category, error) {
	category, err := s.repo.GetCategoryByID(ctx, categoryID)
	if err != nil {
		return nil, err
	}

	if category.UserID != userID {
		return nil, errors.New("access denied")
	}

	return category, nil
}

func (s *CategoryService) GetByUserID(ctx context.Context, userID uuid.UUID) ([]models.Category, error) {
	return s.repo.GetCategoriesByUserID(ctx, userID)
}

func (s *CategoryService) Update(ctx context.Context, userID, categoryID uuid.UUID, req models.UpdateCategoryRequest) (*models.Category, error) {
	category, err := s.repo.GetCategoryByID(ctx, categoryID)
	if err != nil {
		return nil, err
	}

	if category.UserID != userID {
		return nil, errors.New("access denied")
	}

	if req.Name != "" {
		category.Name = req.Name
	}
	if req.Color != "" {
		category.Color = req.Color
	}
	category.UpdatedAt = time.Now()

	if err := s.repo.UpdateCategory(ctx, category); err != nil {
		return nil, err
	}

	return category, nil
}

func (s *CategoryService) Delete(ctx context.Context, userID, categoryID uuid.UUID) error {
	category, err := s.repo.GetCategoryByID(ctx, categoryID)
	if err != nil {
		return err
	}

	if category.UserID != userID {
		return errors.New("access denied")
	}

	return s.repo.DeleteCategory(ctx, categoryID)
}

// TagService handles tag business logic
type TagService struct {
	repo *repository.PostgresRepository
}

func NewTagService(repo *repository.PostgresRepository) *TagService {
	return &TagService{repo: repo}
}

func (s *TagService) Create(ctx context.Context, userID uuid.UUID, req models.CreateTagRequest) (*models.Tag, error) {
	tag := &models.Tag{
		ID:        uuid.New(),
		UserID:    userID,
		Name:      req.Name,
		CreatedAt: time.Now(),
	}

	if err := s.repo.CreateTag(ctx, tag); err != nil {
		return nil, err
	}

	return tag, nil
}

func (s *TagService) GetByID(ctx context.Context, userID, tagID uuid.UUID) (*models.Tag, error) {
	tag, err := s.repo.GetTagByID(ctx, tagID)
	if err != nil {
		return nil, err
	}

	if tag.UserID != userID {
		return nil, errors.New("access denied")
	}

	return tag, nil
}

func (s *TagService) GetByUserID(ctx context.Context, userID uuid.UUID) ([]models.Tag, error) {
	return s.repo.GetTagsByUserID(ctx, userID)
}

func (s *TagService) Delete(ctx context.Context, userID, tagID uuid.UUID) error {
	tag, err := s.repo.GetTagByID(ctx, tagID)
	if err != nil {
		return err
	}

	if tag.UserID != userID {
		return errors.New("access denied")
	}

	return s.repo.DeleteTag(ctx, tagID)
}
