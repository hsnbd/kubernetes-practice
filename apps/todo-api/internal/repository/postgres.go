package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"todo-api/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// PostgresRepository implements the Repository interface using PostgreSQL
type PostgresRepository struct {
	db *pgxpool.Pool
}

// NewPostgresRepository creates a new PostgresRepository instance
func NewPostgresRepository(pool *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{
		db: pool,
	}
}

// User methods

// CreateUser creates a new user in the database
func (r *PostgresRepository) CreateUser(ctx context.Context, user *models.User) error {
	query := `
		INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(ctx, query,
		user.ID,
		user.Email,
		user.PasswordHash,
		user.Name,
		user.CreatedAt,
		user.UpdatedAt,
	)
	return err
}

// GetUserByID retrieves a user by their ID
func (r *PostgresRepository) GetUserByID(ctx context.Context, userID uuid.UUID) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, name, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	var user models.User
	err := r.db.QueryRow(ctx, query, userID).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Name,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail retrieves a user by their email
func (r *PostgresRepository) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, name, created_at, updated_at
		FROM users
		WHERE email = $1
	`
	var user models.User
	err := r.db.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Name,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// Category methods

// CreateCategory creates a new category in the database
func (r *PostgresRepository) CreateCategory(ctx context.Context, category *models.Category) error {
	query := `
		INSERT INTO categories (id, user_id, name, color, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(ctx, query,
		category.ID,
		category.UserID,
		category.Name,
		category.Color,
		category.CreatedAt,
		category.UpdatedAt,
	)
	return err
}

// GetCategoryByID retrieves a category by its ID
func (r *PostgresRepository) GetCategoryByID(ctx context.Context, categoryID uuid.UUID) (*models.Category, error) {
	query := `
		SELECT id, user_id, name, color, created_at, updated_at
		FROM categories
		WHERE id = $1
	`
	var category models.Category
	err := r.db.QueryRow(ctx, query, categoryID).Scan(
		&category.ID,
		&category.UserID,
		&category.Name,
		&category.Color,
		&category.CreatedAt,
		&category.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("category not found")
		}
		return nil, err
	}
	return &category, nil
}

// GetCategoriesByUserID retrieves all categories for a user
func (r *PostgresRepository) GetCategoriesByUserID(ctx context.Context, userID uuid.UUID) ([]models.Category, error) {
	query := `
		SELECT id, user_id, name, color, created_at, updated_at
		FROM categories
		WHERE user_id = $1
		ORDER BY name
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []models.Category
	for rows.Next() {
		var category models.Category
		err := rows.Scan(
			&category.ID,
			&category.UserID,
			&category.Name,
			&category.Color,
			&category.CreatedAt,
			&category.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return categories, nil
}

// UpdateCategory updates a category in the database
func (r *PostgresRepository) UpdateCategory(ctx context.Context, category *models.Category) error {
	query := `
		UPDATE categories
		SET name = $1, color = $2, updated_at = $3
		WHERE id = $4
	`
	result, err := r.db.Exec(ctx, query,
		category.Name,
		category.Color,
		category.UpdatedAt,
		category.ID,
	)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("category not found")
	}
	return nil
}

// DeleteCategory deletes a category from the database
func (r *PostgresRepository) DeleteCategory(ctx context.Context, categoryID uuid.UUID) error {
	query := `DELETE FROM categories WHERE id = $1`
	result, err := r.db.Exec(ctx, query, categoryID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("category not found")
	}
	return nil
}

// Tag methods

// CreateTag creates a new tag in the database
func (r *PostgresRepository) CreateTag(ctx context.Context, tag *models.Tag) error {
	query := `
		INSERT INTO tags (id, user_id, name, created_at)
		VALUES ($1, $2, $3, $4)
	`
	_, err := r.db.Exec(ctx, query,
		tag.ID,
		tag.UserID,
		tag.Name,
		tag.CreatedAt,
	)
	return err
}

// GetTagByID retrieves a tag by its ID
func (r *PostgresRepository) GetTagByID(ctx context.Context, tagID uuid.UUID) (*models.Tag, error) {
	query := `
		SELECT id, user_id, name, created_at
		FROM tags
		WHERE id = $1
	`
	var tag models.Tag
	err := r.db.QueryRow(ctx, query, tagID).Scan(
		&tag.ID,
		&tag.UserID,
		&tag.Name,
		&tag.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("tag not found")
		}
		return nil, err
	}
	return &tag, nil
}

// GetTagsByUserID retrieves all tags for a user
func (r *PostgresRepository) GetTagsByUserID(ctx context.Context, userID uuid.UUID) ([]models.Tag, error) {
	query := `
		SELECT id, user_id, name, created_at
		FROM tags
		WHERE user_id = $1
		ORDER BY name
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []models.Tag
	for rows.Next() {
		var tag models.Tag
		err := rows.Scan(
			&tag.ID,
			&tag.UserID,
			&tag.Name,
			&tag.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tags, nil
}

// DeleteTag deletes a tag from the database
func (r *PostgresRepository) DeleteTag(ctx context.Context, tagID uuid.UUID) error {
	query := `DELETE FROM tags WHERE id = $1`
	result, err := r.db.Exec(ctx, query, tagID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("tag not found")
	}
	return nil
}

// Todo methods

// CreateTodo creates a new todo in the database
func (r *PostgresRepository) CreateTodo(ctx context.Context, todo *models.Todo) error {
	query := `
		INSERT INTO todos (id, user_id, title, description, completed, priority, due_date, category_id, created_at, updated_at, completed_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`
	_, err := r.db.Exec(ctx, query,
		todo.ID,
		todo.UserID,
		todo.Title,
		todo.Description,
		todo.Completed,
		todo.Priority,
		todo.DueDate,
		todo.CategoryID,
		todo.CreatedAt,
		todo.UpdatedAt,
		todo.CompletedAt,
	)
	return err
}

// GetTodoByID retrieves a todo by its ID with category and tags
func (r *PostgresRepository) GetTodoByID(ctx context.Context, todoID uuid.UUID) (*models.Todo, error) {
	query := `
		SELECT 
			t.id, t.user_id, t.title, t.description, t.completed, 
			t.priority, t.due_date, t.category_id, t.created_at, 
			t.updated_at, t.completed_at,
			c.id, c.user_id, c.name, c.color, c.created_at, c.updated_at
		FROM todos t
		LEFT JOIN categories c ON t.category_id = c.id
		WHERE t.id = $1
	`
	var todo models.Todo
	var category models.Category
	var categoryID, categoryUserID *uuid.UUID
	var categoryName, categoryColor *string
	var categoryCreatedAt, categoryUpdatedAt *time.Time

	err := r.db.QueryRow(ctx, query, todoID).Scan(
		&todo.ID,
		&todo.UserID,
		&todo.Title,
		&todo.Description,
		&todo.Completed,
		&todo.Priority,
		&todo.DueDate,
		&todo.CategoryID,
		&todo.CreatedAt,
		&todo.UpdatedAt,
		&todo.CompletedAt,
		&categoryID,
		&categoryUserID,
		&categoryName,
		&categoryColor,
		&categoryCreatedAt,
		&categoryUpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("todo not found")
		}
		return nil, err
	}

	// Set category if it exists
	if categoryID != nil {
		category.ID = *categoryID
		category.UserID = *categoryUserID
		category.Name = *categoryName
		category.Color = *categoryColor
		category.CreatedAt = *categoryCreatedAt
		category.UpdatedAt = *categoryUpdatedAt
		todo.Category = &category
	}

	// Fetch tags
	tags, err := r.GetTodoTags(ctx, todoID)
	if err != nil {
		return nil, err
	}
	todo.Tags = tags

	return &todo, nil
}

// GetTodosByUserID retrieves all todos for a user with categories and tags
func (r *PostgresRepository) GetTodosByUserID(ctx context.Context, userID uuid.UUID) ([]models.Todo, error) {
	query := `
		SELECT 
			t.id, t.user_id, t.title, t.description, t.completed, 
			t.priority, t.due_date, t.category_id, t.created_at, 
			t.updated_at, t.completed_at,
			c.id, c.user_id, c.name, c.color, c.created_at, c.updated_at
		FROM todos t
		LEFT JOIN categories c ON t.category_id = c.id
		WHERE t.user_id = $1
		ORDER BY t.created_at DESC
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []models.Todo
	for rows.Next() {
		var todo models.Todo
		var category models.Category
		var categoryID, categoryUserID *uuid.UUID
		var categoryName, categoryColor *string
		var categoryCreatedAt, categoryUpdatedAt *time.Time

		err := rows.Scan(
			&todo.ID,
			&todo.UserID,
			&todo.Title,
			&todo.Description,
			&todo.Completed,
			&todo.Priority,
			&todo.DueDate,
			&todo.CategoryID,
			&todo.CreatedAt,
			&todo.UpdatedAt,
			&todo.CompletedAt,
			&categoryID,
			&categoryUserID,
			&categoryName,
			&categoryColor,
			&categoryCreatedAt,
			&categoryUpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		// Set category if it exists
		if categoryID != nil {
			category.ID = *categoryID
			category.UserID = *categoryUserID
			category.Name = *categoryName
			category.Color = *categoryColor
			category.CreatedAt = *categoryCreatedAt
			category.UpdatedAt = *categoryUpdatedAt
			todo.Category = &category
		}

		// Fetch tags for this todo
		tags, err := r.GetTodoTags(ctx, todo.ID)
		if err != nil {
			return nil, err
		}
		todo.Tags = tags

		todos = append(todos, todo)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return todos, nil
}

// GetSharedTodos retrieves all todos shared with a user
func (r *PostgresRepository) GetSharedTodos(ctx context.Context, userID uuid.UUID) ([]models.Todo, error) {
	query := `
		SELECT 
			t.id, t.user_id, t.title, t.description, t.completed, 
			t.priority, t.due_date, t.category_id, t.created_at, 
			t.updated_at, t.completed_at,
			c.id, c.user_id, c.name, c.color, c.created_at, c.updated_at
		FROM todos t
		INNER JOIN todo_shares ts ON t.id = ts.todo_id
		LEFT JOIN categories c ON t.category_id = c.id
		WHERE ts.shared_with_user_id = $1
		ORDER BY t.created_at DESC
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []models.Todo
	for rows.Next() {
		var todo models.Todo
		var category models.Category
		var categoryID, categoryUserID *uuid.UUID
		var categoryName, categoryColor *string
		var categoryCreatedAt, categoryUpdatedAt *time.Time

		err := rows.Scan(
			&todo.ID,
			&todo.UserID,
			&todo.Title,
			&todo.Description,
			&todo.Completed,
			&todo.Priority,
			&todo.DueDate,
			&todo.CategoryID,
			&todo.CreatedAt,
			&todo.UpdatedAt,
			&todo.CompletedAt,
			&categoryID,
			&categoryUserID,
			&categoryName,
			&categoryColor,
			&categoryCreatedAt,
			&categoryUpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		// Set category if it exists
		if categoryID != nil {
			category.ID = *categoryID
			category.UserID = *categoryUserID
			category.Name = *categoryName
			category.Color = *categoryColor
			category.CreatedAt = *categoryCreatedAt
			category.UpdatedAt = *categoryUpdatedAt
			todo.Category = &category
		}

		// Fetch tags for this todo
		tags, err := r.GetTodoTags(ctx, todo.ID)
		if err != nil {
			return nil, err
		}
		todo.Tags = tags

		todos = append(todos, todo)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return todos, nil
}

// UpdateTodo updates a todo in the database
func (r *PostgresRepository) UpdateTodo(ctx context.Context, todo *models.Todo) error {
	query := `
		UPDATE todos
		SET title = $1, description = $2, completed = $3, priority = $4, 
		    due_date = $5, category_id = $6, updated_at = $7, completed_at = $8
		WHERE id = $9
	`
	result, err := r.db.Exec(ctx, query,
		todo.Title,
		todo.Description,
		todo.Completed,
		todo.Priority,
		todo.DueDate,
		todo.CategoryID,
		todo.UpdatedAt,
		todo.CompletedAt,
		todo.ID,
	)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("todo not found")
	}
	return nil
}

// DeleteTodo deletes a todo from the database
func (r *PostgresRepository) DeleteTodo(ctx context.Context, todoID uuid.UUID) error {
	query := `DELETE FROM todos WHERE id = $1`
	result, err := r.db.Exec(ctx, query, todoID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("todo not found")
	}
	return nil
}

// Todo tags methods

// AddTodoTags adds tags to a todo
func (r *PostgresRepository) AddTodoTags(ctx context.Context, todoID uuid.UUID, tagIDs []uuid.UUID) error {
	if len(tagIDs) == 0 {
		return nil
	}

	// Use a transaction to insert all tags
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	query := `
		INSERT INTO todo_tags (todo_id, tag_id)
		VALUES ($1, $2)
		ON CONFLICT (todo_id, tag_id) DO NOTHING
	`

	for _, tagID := range tagIDs {
		_, err := tx.Exec(ctx, query, todoID, tagID)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

// RemoveTodoTags removes all tags from a todo
func (r *PostgresRepository) RemoveTodoTags(ctx context.Context, todoID uuid.UUID) error {
	query := `DELETE FROM todo_tags WHERE todo_id = $1`
	_, err := r.db.Exec(ctx, query, todoID)
	return err
}

// GetTodoTags retrieves all tags for a todo
func (r *PostgresRepository) GetTodoTags(ctx context.Context, todoID uuid.UUID) ([]models.Tag, error) {
	query := `
		SELECT t.id, t.user_id, t.name, t.created_at
		FROM tags t
		INNER JOIN todo_tags tt ON t.id = tt.tag_id
		WHERE tt.todo_id = $1
		ORDER BY t.name
	`
	rows, err := r.db.Query(ctx, query, todoID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []models.Tag
	for rows.Next() {
		var tag models.Tag
		err := rows.Scan(
			&tag.ID,
			&tag.UserID,
			&tag.Name,
			&tag.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tags, nil
}

// Todo sharing methods

// ShareTodo shares a todo with another user
func (r *PostgresRepository) ShareTodo(ctx context.Context, share *models.TodoShare) error {
	query := `
		INSERT INTO todo_shares (id, todo_id, shared_by_user_id, shared_with_user_id, permission, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(ctx, query,
		share.ID,
		share.TodoID,
		share.SharedByUserID,
		share.SharedWithUserID,
		share.Permission,
		share.CreatedAt,
	)
	return err
}

// UnshareTodo removes a share for a todo
func (r *PostgresRepository) UnshareTodo(ctx context.Context, todoID, sharedWithUserID uuid.UUID) error {
	query := `
		DELETE FROM todo_shares 
		WHERE todo_id = $1 AND shared_with_user_id = $2
	`
	result, err := r.db.Exec(ctx, query, todoID, sharedWithUserID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("todo share not found")
	}
	return nil
}

// GetTodoShares retrieves all shares for a todo
func (r *PostgresRepository) GetTodoShares(ctx context.Context, todoID uuid.UUID) ([]models.TodoShare, error) {
	query := `
		SELECT id, todo_id, shared_by_user_id, shared_with_user_id, permission, created_at
		FROM todo_shares
		WHERE todo_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(ctx, query, todoID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var shares []models.TodoShare
	for rows.Next() {
		var share models.TodoShare
		err := rows.Scan(
			&share.ID,
			&share.TodoID,
			&share.SharedByUserID,
			&share.SharedWithUserID,
			&share.Permission,
			&share.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		shares = append(shares, share)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return shares, nil
}

// IsSharedWith checks if a todo is shared with a specific user and returns the permission level
func (r *PostgresRepository) IsSharedWith(ctx context.Context, todoID, userID uuid.UUID) (bool, string, error) {
	query := `
		SELECT permission
		FROM todo_shares
		WHERE todo_id = $1 AND shared_with_user_id = $2
	`
	var permission string
	err := r.db.QueryRow(ctx, query, todoID, userID).Scan(&permission)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return false, "", nil
		}
		return false, "", err
	}
	return true, permission, nil
}
