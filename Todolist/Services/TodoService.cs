using Todolist.DTOs;
using Todolist.Exceptions;
using Todolist.Models;
using Todolist.Repositories;
using TodoList.DTOs;
using TodoList.Models;
using TodoList.Repositories;

namespace TodoList.Services
{
    public class TodoService : ITodoService
    {
        private readonly ITodoRepository _todoRepository;
        private readonly ICollaboratorRepository _collaboratorRepository;

        public TodoService(
            ITodoRepository todoRepository,
            ICollaboratorRepository collaboratorRepository)
        {
            _todoRepository = todoRepository;
            _collaboratorRepository = collaboratorRepository;
        }

        public async Task<IEnumerable<TodoResponseDto>> GetAllTodosForUserAsync(int userId)
        {
            var todos = await _todoRepository.GetAllForUserAsync(userId);
            return todos.Select(todo => MapToTodoResponseDto(todo));
        }

        public async Task<TodoResponseDto> GetTodoByIdForUserAsync(int id, int userId)
        {
            var todo = await _todoRepository.GetByIdForUserAsync(id, userId);
            if (todo == null)
                throw new NotFoundException("Todo not found");

            return MapToTodoResponseDto(todo);
        }

        public async Task<TodoResponseDto> CreateTodoForUserAsync(TodoCreateDto todoDto, int userId)
        {
            var todo = new Todo
            {
                Title = todoDto.Title,
                Description = todoDto.Description,
                IsCompleted = false,
                Category = todoDto.Category,
                DueDateTime = todoDto.DueDateTime,
                Priority = todoDto.Priority,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = userId,
                Collaborators = new List<TodoCollaborator>(),
                SubTodos = new List<SubTodo>(),
                Comments = new List<TodoComment>()
            };

            var createdTodo = await _todoRepository.CreateAsync(todo);

            var todoWithRelations = await _todoRepository.GetByIdForUserAsync(createdTodo.Id, userId);
            return MapToTodoResponseDto(todoWithRelations);
        }

        public async Task<TodoResponseDto?> UpdateTodoForUserAsync(int id, TodoUpdateDto todoDto, int userId)
        {
            var existingTodo = await _todoRepository.GetByIdForUserAsync(id, userId);

            if (existingTodo == null)
                return null;

            existingTodo.Title = todoDto.Title;
            existingTodo.Description = todoDto.Description;
            existingTodo.IsCompleted = todoDto.IsCompleted;
            existingTodo.Category = todoDto.Category;
            existingTodo.DueDateTime = todoDto.DueDateTime;
            existingTodo.Priority = todoDto.Priority;
            existingTodo.UpdatedAt = DateTime.UtcNow;

            var updatedTodo = await _todoRepository.UpdateAsync(existingTodo);
            return MapToTodoResponseDto(updatedTodo);
        }

        public async Task DeleteTodoForUserAsync(int id, int userId)
        {
            var todo = await _todoRepository.GetByIdForUserAsync(id, userId);
            if (todo == null)
                throw new NotFoundException("Todo not found");

            if (todo.UserId != userId)
                throw new System.UnauthorizedAccessException("You can only delete your own todos");

            await _todoRepository.DeleteForUserAsync(id, userId);
        }

        public async Task<IEnumerable<TodoResponseDto>> GetSharedTodosAsync(int userId)
        {
            var sharedTodos = await _collaboratorRepository.GetSharedTodosAsync(userId);
            return sharedTodos.Select(todo => MapToTodoResponseDto(todo));
        }

        private TodoResponseDto MapToTodoResponseDto(Todo todo)
        {
            return new TodoResponseDto
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
                OwnerUsername = todo.User?.Username ?? "",  
                CollaboratorUsernames = todo.Collaborators?.Select(c => c.User.Username).ToList() ?? new List<string>(),
                SubTodos = todo.SubTodos?.Select(st => new SubTodoDto
                {
                    Id = st.Id,
                    Text = st.Text,
                    IsCompleted = st.IsCompleted,
                    CreatedAt = st.CreatedAt
                }).ToList() ?? new List<SubTodoDto>(),
                Comments = todo.Comments?.Select(c => new CommentResponseDto
                {
                    Id = c.Id,
                    Text = c.Text,
                    Username = c.User?.Username ?? "",
                    CreatedAt = c.CreatedAt
                }).ToList() ?? new List<CommentResponseDto>()
            };
        }
    }
}