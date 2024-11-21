using Todolist.Models;

namespace TodoList.Repositories
{
    public interface ISubTodoRepository
    {
        Task<IEnumerable<SubTodo>> GetAllForTodoAsync(int todoId);
        Task<SubTodo> GetByIdAsync(int id);
        Task<SubTodo> CreateAsync(SubTodo subTodo);
        Task<SubTodo> UpdateAsync(SubTodo subTodo);
        Task DeleteAsync(int id);
        Task<bool> BelongsToUserAsync(int subTodoId, int userId);
    }
}
