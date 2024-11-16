using Todolist.Models;

namespace Todolist.Repositories
{
    public interface ITodoListRepository
    {
        Task<ListTodo> CreateTodoList(ListTodo listTodo);
        Task<ListTodo> GetTodoListById(int id);
        Task<IEnumerable<ListTodo>> GetUserTodoLists(int userId);
        Task<bool> AddCollaborator(int todoListId, int userId, CollaboratorRole role);
        Task<bool> RemoveCollaborator(int todoListId, int userId);
        Task<bool> UpdateCollaboratorRole(int todoListId, int userId, CollaboratorRole role);
        Task<bool> HasAccess(int todoListId, int userId);
        // Add these new methods
        Task<ListTodo> UpdateTodoList(ListTodo todoList);
        Task DeleteTodoList(int id);
    }

}
