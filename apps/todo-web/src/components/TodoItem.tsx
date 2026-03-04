import { useState } from 'react';
import { format } from 'date-fns';
import { type Todo } from '../api';
import { CheckCircleIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { todosAPI } from '../api';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
  onEdit: (todo: Todo) => void;
}

export default function TodoItem({ todo, onUpdate, onEdit }: TodoItemProps) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleToggle = async () => {
    try {
      await todosAPI.toggleComplete(todo.id);
      onUpdate();
    } catch (err) {
      console.error('Failed to toggle todo', err);
    }
  };

  const handleDelete = async () => {
    try {
      await todosAPI.delete(todo.id);
      onUpdate();
      setDeleteConfirm(false);
    } catch (err) {
      console.error('Failed to delete todo', err);
      setDeleteConfirm(false);
    }
  };

  return (
    <li className="px-4 py-4 hover:bg-gray-50">
      <div className="flex items-center">
        <button onClick={handleToggle} className="mr-4">
          {todo.completed ? (
            <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />
          ) : (
            <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`text-sm font-medium ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </p>
            {todo.category && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: todo.category.color + '20',
                  color: todo.category.color,
                }}
              >
                {todo.category.name}
              </span>
            )}
          </div>
          {todo.description && (
            <p className="mt-1 text-sm text-gray-500">{todo.description}</p>
          )}
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            {todo.due_date && (
              <span>Due: {format(new Date(todo.due_date), 'MMM d, yyyy')}</span>
            )}
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex gap-1">
                {todo.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="ml-4 flex items-center gap-2">
          {deleteConfirm ? (
            <>
              <button
                onClick={handleDelete}
                className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(todo)}
                className="text-indigo-600 hover:text-indigo-800"
                title="Edit todo"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-red-600 hover:text-red-800"
                title="Delete todo"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
