
using Todolist.Exceptions;
using Todolist.Models;
using TodoList.DTOs;
using TodoList.Repositories;
using TodoList.Services;

namespace Todolist.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly ITodoRepository _todoRepository;

        public CommentService(ICommentRepository commentRepository, ITodoRepository todoRepository)
        {
            _commentRepository = commentRepository;
            _todoRepository = todoRepository;
        }

        public async Task<IEnumerable<CommentResponseDto>> GetTodoCommentsAsync(int todoId, int userId)
        {
            if (!await _todoRepository.HasAccessAsync(todoId, userId))
                throw new Exceptions.UnauthorizedAccessException("No access to this todo");

            var comments = await _commentRepository.GetAllForTodoAsync(todoId);
            return comments.Select(c => new CommentResponseDto
            {
                Id = c.Id,
                Text = c.Text,
                Username = c.User.Username,
                CreatedAt = c.CreatedAt
            });
        }

        public async Task<CommentResponseDto> AddCommentAsync(int todoId, int userId, CommentCreateDto dto)
        {
            if (!await _todoRepository.HasAccessAsync(todoId, userId))
                throw new Exceptions.UnauthorizedAccessException("No access to this todo");

            var comment = new TodoComment
            {
                Text = dto.Text,
                TodoId = todoId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            var createdComment = await _commentRepository.CreateAsync(comment);
            return new CommentResponseDto
            {
                Id = createdComment.Id,
                Text = createdComment.Text,
                Username = createdComment.User.Username,
                CreatedAt = createdComment.CreatedAt
            };
        }

        public async Task DeleteCommentAsync(int todoId, int commentId, int userId)
        {
            if (!await _todoRepository.HasAccessAsync(todoId, userId))
                throw new Exceptions.UnauthorizedAccessException("No access to this todo");

            var comment = await _commentRepository.GetByIdAsync(commentId);
            if (comment == null || comment.TodoId != todoId)
                throw new NotFoundException("Comment not found");

            if (comment.UserId != userId)
                throw new Exceptions.UnauthorizedAccessException("Can only delete own comments");

            await _commentRepository.DeleteAsync(commentId);
        }
    }
}
