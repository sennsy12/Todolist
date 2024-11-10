using TodoList.DTOs;
using TodoList.Models;

namespace TodoList.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<Todo>> GetAllTodosForUserAsync(int userId);
        Task<Todo?> GetTodoByIdForUserAsync(int id, int userId);
        Task<Todo> CreateTodoForUserAsync(TodoCreateDto todoDto, int userId);
        Task<Todo?> UpdateTodoForUserAsync(int id, TodoUpdateDto todoDto, int userId);
        Task DeleteTodoForUserAsync(int id, int userId);
    }
}