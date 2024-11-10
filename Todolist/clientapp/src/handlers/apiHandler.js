// Henter alle todos for den innloggede brukeren
export const fetchTodos = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Ingen token funnet');
        }

        const response = await fetch('http://localhost:5121/api/todos/user-todos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server respons:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};





// Legger til en ny todo
export const addTodo = async (newTodo) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5121/api/todos/create', {  // Endret URL til /api/todos/create
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Legg til token i forespørselshodet
            },
            body: JSON.stringify(newTodo),
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding todo:', error);
    }
};

// Oppdaterer en eksisterende todo
export const updateTodo = async (todo) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/todos/update/${todo.id}`, {  // Endret URL til /api/todos/update/{id}
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Legg til token i forespørselshodet
            },
            body: JSON.stringify(todo),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating todo:', error);
    }
};

// Sletter en eksisterende todo
export const deleteTodo = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5121/api/todos/delete/${id}`, {  // Endret URL til /api/todos/delete/{id}
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Legg til token i forespørselshodet
            }
        });
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
};