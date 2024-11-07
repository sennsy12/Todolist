export const fetchTodos = async () => {
  try {
    const response = await fetch('http://localhost:5121/Todo/api/');
return await response.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
}
};

export const addTodo = async (newTodo) => {
  try {
    const response = await fetch('http://localhost:5121/Todo/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });
return await response.json();
  } catch (error) {
    console.error('Error adding todo:', error);
}
};

export const updateTodo = async (todo) => {
  try {
    const response = await fetch(`http://localhost:5121/todo/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
return await response.json();
  } catch (error) {
    console.error('Error saving todo:', error);
}
};

export const deleteTodo = async (id) => {
  try {
    await fetch(`http://localhost:5121/todo/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Error deleting todo:', error);
}
};
