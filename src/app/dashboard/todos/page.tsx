'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { FirestoreService } from '@/lib/firebase/firestore';
import { Todo, Collections } from '@/lib/firebase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { where, orderBy } from 'firebase/firestore';

const todosService = new FirestoreService<Todo>(Collections.TODOS);

export default function TodosPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time updates
    const unsubscribe = todosService.subscribe(
      [
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      ],
      (updatedTodos) => {
        setTodos(updatedTodos);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching todos:', error);
        setError('Failed to load todos');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTodoTitle.trim()) return;

    try {
      await todosService.create({
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim(),
        completed: false,
        userId: user.uid,
      });

      setNewTodoTitle('');
      setNewTodoDescription('');
    } catch (error) {
      console.error('Error creating todo:', error);
      setError('Failed to create todo');
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    if (!todo.id) return;

    try {
      await todosService.update(todo.id, {
        completed: !todo.completed,
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo');
    }
  };

  const handleEditTodo = async () => {
    if (!editingTodo?.id || !editTitle.trim()) return;

    try {
      await todosService.update(editingTodo.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });

      setEditingTodo(null);
      setEditTitle('');
      setEditDescription('');
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todosService.delete(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo');
    }
  };

  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Todos</h1>
        <p className="text-muted-foreground">
          Manage your tasks and stay organized
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
          <CardDescription>
            Create a new task to add to your list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTodo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter todo title"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter todo description"
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                rows={3}
              />
            </div>
            <Button type="submit">
              <Icons.add className="mr-2 h-4 w-4" />
              Add Todo
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {todos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No todos yet. Create your first one above!
              </p>
            </CardContent>
          </Card>
        ) : (
          todos.map((todo) => (
            <Card key={todo.id} className={todo.completed ? 'opacity-60' : ''}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <h3 className={`font-medium ${todo.completed ? 'line-through' : ''}`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-sm text-muted-foreground">
                        {todo.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(todo)}
                      >
                        <Icons.edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Todo</DialogTitle>
                        <DialogDescription>
                          Make changes to your todo item
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input
                            id="edit-title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleEditTodo}>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => todo.id && handleDeleteTodo(todo.id)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}