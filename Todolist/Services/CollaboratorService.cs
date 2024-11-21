using Todolist.DTOs;
using Todolist.Exceptions;
using TodoList.DTOs;
using TodoList.Repositories;
using TodoList.Services;

namespace Todolist.Services
{
    public class CollaboratorService : ICollaboratorService
    {
        private readonly ICollaboratorRepository _collaboratorRepository;
        private readonly ITodoRepository _todoRepository;
        private readonly IUserRepository _userRepository;

        public CollaboratorService(
            ICollaboratorRepository collaboratorRepository,
            ITodoRepository todoRepository,
            IUserRepository userRepository)
        {
            _collaboratorRepository = collaboratorRepository;
            _todoRepository = todoRepository;
            _userRepository = userRepository;
        }

        public async Task<bool> AddCollaboratorAsync(int todoId, int currentUserId, string collaboratorUsername)
        {
            var todo = await _todoRepository.GetByIdForUserAsync(todoId, currentUserId);
            if (todo == null || todo.UserId != currentUserId)
                throw new Exceptions.UnauthorizedAccessException("You don't have permission to add collaborators to this todo");
            var collaborator = await _userRepository.GetByUsernameAsync(collaboratorUsername);
            if (collaborator == null)
                throw new NotFoundException("User not found");
            if (collaborator.Id == currentUserId)
                throw new InvalidOperationException("Cannot add yourself as a collaborator");
            return await _collaboratorRepository.AddCollaboratorAsync(todoId, collaborator.Id);
        }


        public async Task<bool> RemoveCollaboratorAsync(int todoId, int currentUserId, string collaboratorUsername)
        {
            var todo = await _todoRepository.GetByIdForUserAsync(todoId, currentUserId);
            if (todo == null || todo.UserId != currentUserId)
                throw new Exceptions.UnauthorizedAccessException("You don't have permission to remove collaborators from this todo");
            var collaborator = await _userRepository.GetByUsernameAsync(collaboratorUsername);
            if (collaborator == null)
                throw new NotFoundException("User not found");

            return await _collaboratorRepository.RemoveCollaboratorAsync(todoId, collaborator.Id);
        }

        public async Task<IEnumerable<string>> GetCollaboratorsAsync(int todoId, int currentUserId)
        {
            if (!await _todoRepository.HasAccessAsync(todoId, currentUserId))
                throw new Exceptions.UnauthorizedAccessException("You don't have access to this todo");

            var collaborators = await _collaboratorRepository.GetCollaboratorsAsync(todoId);
            return collaborators.Select(c => c.User.Username);
        }

        public async Task<IEnumerable<TodoResponseDto>> GetSharedTodosAsync(int userId)
        {
            var sharedTodos = await _collaboratorRepository.GetSharedTodosAsync(userId);

            return sharedTodos.Select(todo => new TodoResponseDto
            {
                Id = todo.Id,
                Title = todo.Title,
                Description = todo.Description,
                IsCompleted = todo.IsCompleted,
                Category = todo.Category,
                DueDateTime = todo.DueDateTime,
                Priority = todo.Priority,
                CreatedAt = todo.CreatedAt,
                UpdatedAt = todo.UpdatedAt,
                OwnerUsername = todo.User.Username,
                CollaboratorUsernames = todo.Collaborators.Select(c => c.User.Username).ToList(),
                SubTodos = todo.SubTodos.Select(st => new SubTodoDto
                {
                    Id = st.Id,
                    Text = st.Text,
                    IsCompleted = st.IsCompleted,
                    CreatedAt = st.CreatedAt
                }).ToList(),
                Comments = todo.Comments.Select(c => new CommentResponseDto
                {
                    Id = c.Id,
                    Text = c.Text,
                    Username = c.User.Username,
                    CreatedAt = c.CreatedAt
                }).ToList()
            });
        }

        public async Task<bool> HasAccessAsync(int todoId, int userId)
        {
            return await _todoRepository.HasAccessAsync(todoId, userId);
        }
    }
}
