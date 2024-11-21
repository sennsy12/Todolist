
using TodoList.DTOs;

namespace TodoList.Services
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentResponseDto>> GetTodoCommentsAsync(int todoId, int userId);
        Task<CommentResponseDto> AddCommentAsync(int todoId, int userId, CommentCreateDto dto);
        Task DeleteCommentAsync(int todoId, int commentId, int userId);
    }
    
}
