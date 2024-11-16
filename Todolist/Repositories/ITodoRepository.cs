using Todolist.Models;

namespace TodoList.Repositories
{
    public interface ITodoRepository
    {
        Task<IEnumerable<Todo>> GetAllForUserAsync(int userId);
        Task<Todo?> GetByIdForUserAsync(int id, int userId);
        Task<Todo> CreateAsync(Todo todo);
        Task<Todo> UpdateAsync(Todo todo);
        Task DeleteForUserAsync(int id, int userId);

    }
}