// ICollaboratorRepository.cs
using Todolist.Models;
using TodoList.Models;

namespace TodoList.Repositories
{
    public interface ICollaboratorRepository
    {
        Task<bool> AddCollaboratorAsync(int todoId, int userId);
        Task<bool> RemoveCollaboratorAsync(int todoId, int userId);
        Task<List<TodoCollaborator>> GetCollaboratorsAsync(int todoId);
        Task<List<Todo>> GetSharedTodosAsync(int userId);
        Task<bool> HasAccessAsync(int todoId, int userId);
        Task<bool> IsCollaboratorAsync(int todoId, int userId);
    }
}