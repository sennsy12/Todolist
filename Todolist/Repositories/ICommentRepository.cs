using Todolist.Models;

namespace TodoList.Repositories
{
    public interface ICommentRepository
    {
        Task<IEnumerable<TodoComment>> GetAllForTodoAsync(int todoId);
        Task<TodoComment> CreateAsync(TodoComment comment);
        Task<TodoComment> GetByIdAsync(int id);
        Task DeleteAsync(int id);
        Task<bool> BelongsToUserAsync(int commentId, int userId);
    }
}
