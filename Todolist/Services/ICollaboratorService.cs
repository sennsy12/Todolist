using TodoList.DTOs;

namespace TodoList.Services
{
    public interface ICollaboratorService
    {
        Task<bool> AddCollaboratorAsync(int todoId, int currentUserId, string collaboratorUsername);
        Task<bool> RemoveCollaboratorAsync(int todoId, int currentUserId, string collaboratorUsername);
        Task<IEnumerable<string>> GetCollaboratorsAsync(int todoId, int currentUserId);
        Task<IEnumerable<TodoResponseDto>> GetSharedTodosAsync(int userId);
        Task<bool> HasAccessAsync(int todoId, int userId);
    }
}
