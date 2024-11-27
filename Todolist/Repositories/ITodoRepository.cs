using TodoList.Models;

namespace TodoList.Repositories
{
    public interface ITodoRepository
    {
        Task<IEnumerable<Todo>> GetAllForUserAsync(int userId);
        Task<Todo?> GetByIdForUserAsync(int id, int userId);
        Task<Todo> CreateAsync(Todo todo);
        Task<Todo> UpdateAsync(Todo todo);
        Task DeleteAsync(int id);
        Task<bool> HasAccessAsync(int todoId, int userId);
        Task<Todo> GetByIdAsync(int todoId);
    }
}