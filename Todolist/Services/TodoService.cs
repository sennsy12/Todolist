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

        public async Task<IEnumerable<Todo>> GetAllTodosAsync()
        {
            return await _todoRepository.GetAllAsync();
        }

        public async Task<Todo?> GetTodoByIdAsync(int id)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            if (todo == null)
                return null;

            return todo;
        }

        public async Task<Todo> CreateTodoAsync(TodoCreateDto todoDto)
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
                UpdatedAt = DateTime.UtcNow
            };

            return await _todoRepository.CreateAsync(todo);
        }

        public async Task<Todo> UpdateTodoAsync(int id, TodoUpdateDto todoDto)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            if (todo == null)
                return null;

            todo.Title = todoDto.Title;
            todo.Description = todoDto.Description;
            todo.IsCompleted = todoDto.IsCompleted;
            todo.Category = todoDto.Category;
            todo.DueDateTime = todoDto.DueDateTime;  
            todo.Priority = todoDto.Priority;
            todo.UpdatedAt = DateTime.UtcNow;

            return await _todoRepository.UpdateAsync(todo);
        }

        public async Task DeleteTodoAsync(int id)
        {
            await _todoRepository.DeleteAsync(id);
        }
    }
}
