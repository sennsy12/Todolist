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
            if (!await _todoRepository.HasAccessAsync(todoId, currentUserId))
                throw new Exceptions.UnauthorizedAccessException("Du har ikke tilgang til denne oppgaven");

            var collaborator = await _userRepository.GetByUsernameAsync(collaboratorUsername);
            if (collaborator == null)
                throw new NotFoundException("Bruker ikke funnet");
            if (collaborator.Id == currentUserId)
                throw new InvalidOperationException("Du kan ikke legge til deg selv som samarbeidspartner");

            return await _collaboratorRepository.AddCollaboratorAsync(todoId, collaborator.Id);
        }

        public async Task<bool> RemoveCollaboratorAsync(int todoId, int currentUserId, string collaboratorUsername)
        {
            var todo = await _todoRepository.GetByIdForUserAsync(todoId, currentUserId);
            if (todo == null)
                throw new Exceptions.UnauthorizedAccessException("Ingen tilgang til denne oppgaven");

            var collaborator = await _userRepository.GetByUsernameAsync(collaboratorUsername);
            if (collaborator == null)
                throw new NotFoundException("Bruker ikke funnet");

            // Sjekk om brukeren som skal fjernes er eieren
            if (collaborator.Id == todo.UserId)
                throw new InvalidOperationException("Kan ikke fjerne eieren av oppgaven");

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
