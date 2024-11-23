
using TodoList.DTOs;


namespace TodoList.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<TodoResponseDto>> GetAllTodosForUserAsync(int userId);
        Task<TodoResponseDto> GetTodoByIdForUserAsync(int id, int userId);
        Task<TodoResponseDto> CreateTodoForUserAsync(TodoCreateDto todoDto, int userId);
        Task<TodoResponseDto> UpdateTodoForUserAsync(int id, TodoUpdateDto todoDto, int userId);
        Task DeleteTodoForUserAsync(int id, int userId);
        Task<IEnumerable<TodoResponseDto>> GetSharedTodosAsync(int userId); 
}
}