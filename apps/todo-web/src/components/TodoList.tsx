import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useTodoStore, useCategoryStore, useTagStore } from '../store';
import { todosAPI, categoriesAPI, tagsAPI, type Todo } from '../api';
import { PlusIcon, TagIcon, FolderIcon } from '@heroicons/react/24/outline';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import CategoryManager from './CategoryManager';
import TagManager from './TagManager';

export default function TodoList() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const { todos, setTodos, setLoading, setError } = useTodoStore();
  const { setCategories } = useCategoryStore();
  const { setTags } = useTagStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [todosRes, categoriesRes, tagsRes] = await Promise.all([
        todosAPI.getAll(),
        categoriesAPI.getAll(),
        tagsAPI.getAll(),
      ]);
      setTodos(todosRes.data);
      setCategories(categoriesRes.data);
      setTags(tagsRes.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hello, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Todo
          </button>
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <FolderIcon className="h-5 w-5 mr-2" />
            Categories
          </button>
          <button
            onClick={() => setIsTagManagerOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <TagIcon className="h-5 w-5 mr-2" />
            Tags
          </button>
        </div>

        {/* Todos list */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {!todos || todos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No todos yet. Create your first one!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onUpdate={loadData} onEdit={handleEdit} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <TodoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={loadData}
        todo={editingTodo}
      />

      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />

      <TagManager
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
      />
    </div>
  );
}
