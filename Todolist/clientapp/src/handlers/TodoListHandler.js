const API_BASE = 'http://localhost:5121/api/todolist';

export const fetchUserLists = async () => {
    const response = await fetch(`${API_BASE}/user`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await response.json();
};

export const createNewList = async (listData) => {
    const dueDateTime = listData.dueDate && listData.dueTime
        ? new Date(`${listData.dueDate}T${listData.dueTime}Z`).toISOString()
        : null;

    const response = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Title: listData.title,
            Description: listData.description,
            Category: listData.category,
            DueDateTime: dueDateTime,
            Priority: listData.priority,
            IsCompleted: listData.isCompleted || false
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create list');
    }

    return await response.json();
};


export const fetchTodoList = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await response.json();
};

export const addCollaborator = async (listId, collaboratorData) => {
    const response = await fetch(`${API_BASE}/${listId}/collaborators`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(collaboratorData)
    });
    return await response.json();
};

export const removeCollaborator = async (listId, userId) => {
    const response = await fetch(`${API_BASE}/${listId}/collaborators/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.ok;
};

export const updateTodoList = async (listId, listData) => {
    const response = await fetch(`${API_BASE}/${listId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listData)
    });

    if (!response.ok) {
        throw new Error('Failed to update list');
    }

    return await response.json();
};

export const deleteTodoList = async (listId) => {
    const response = await fetch(`${API_BASE}/${listId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete list');
    }

    return true;
};

export const updateCollaboratorRole = async (listId, userId, role) => {
    const response = await fetch(`${API_BASE}/${listId}/collaborators/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: role })
    });

    if (!response.ok) {
        throw new Error('Failed to update collaborator role');
    }

    return true;
};
