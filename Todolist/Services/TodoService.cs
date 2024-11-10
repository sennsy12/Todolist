using TodoList.DTOs;
using TodoList.Models;
using TodoList.Repositories;

namespace TodoList.Services
{
    public class TodoService : ITodoService
    {
        private readonly ITodoRepository _todoRepository;

        public TodoService(ITodoRepository todoRepository)
        {
            _todoRepository = todoRepository;
        }

        public async Task<IEnumerable<Todo>> GetAllTodosForUserAsync(int userId)
        {
            return await _todoRepository.GetAllForUserAsync(userId);
        }

        public async Task<Todo?> GetTodoByIdForUserAsync(int id, int userId)
        {
            return await _todoRepository.GetByIdForUserAsync(id, userId);
        }

        public async Task<Todo> CreateTodoForUserAsync(TodoCreateDto todoDto, int userId)
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
                UserId = userId 
            };

            return await _todoRepository.CreateAsync(todo);
        }

        public async Task<Todo?> UpdateTodoForUserAsync(int id, TodoUpdateDto todoDto, int userId)
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

            return await _todoRepository.UpdateAsync(existingTodo);
        }

        public async Task DeleteTodoForUserAsync(int id, int userId)
        {
            await _todoRepository.DeleteForUserAsync(id, userId);
        }
    }
}