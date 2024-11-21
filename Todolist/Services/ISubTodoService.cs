using Todolist.DTOs;

namespace TodoList.Services
{
    public interface ISubTodoService
    {
        Task<IEnumerable<SubTodoDto>> GetTodoSubTasksAsync(int todoId, int userId);
        Task<SubTodoDto> CreateSubTaskAsync(int todoId, int userId, SubTodoCreateDto dto);
        Task<SubTodoDto> UpdateSubTaskAsync(int todoId, int subTodoId, int userId, SubTodoUpdateDto dto);
        Task DeleteSubTaskAsync(int todoId, int subTodoId, int userId);
    }
}
