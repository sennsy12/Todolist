using TodoList.DTOs;
using TodoList.Models;

namespace TodoList.Services;

public interface ITodoService
{
    Task<IEnumerable<Todo>> GetAllTodosAsync();
    Task<Todo> GetTodoByIdAsync(int id);
    Task<Todo> CreateTodoAsync(TodoCreateDto todoDto);
    Task<Todo> UpdateTodoAsync(int id, TodoUpdateDto todoDto);
    Task DeleteTodoAsync(int id);
}