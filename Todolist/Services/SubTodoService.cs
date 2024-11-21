using Todolist.DTOs;
using Todolist.Exceptions;
using Todolist.Models;
using TodoList.Repositories;
using TodoList.Services;

namespace Todolist.Services
{
    public class SubTodoService : ISubTodoService
    {
        private readonly ISubTodoRepository _subTodoRepository;
        private readonly ITodoRepository _todoRepository;

        public SubTodoService(ISubTodoRepository subTodoRepository, ITodoRepository todoRepository)
        {
            _subTodoRepository = subTodoRepository;
            _todoRepository = todoRepository;
        }

        public async Task<IEnumerable<SubTodoDto>> GetTodoSubTasksAsync(int todoId, int userId)
        {
            if (!await _todoRepository.HasAccessAsync(todoId, userId))
                throw new Exceptions.UnauthorizedAccessException("No access to this todo");

            var subTodos = await _subTodoRepository.GetAllForTodoAsync(todoId);
            return subTodos.Select(st => new SubTodoDto
            {
                Id = st.Id,
                Text = st.Text,
                IsCompleted = st.IsCompleted,
                CreatedAt = st.CreatedAt
            });
        }

        public async Task<SubTodoDto> CreateSubTaskAsync(int todoId, int userId, SubTodoCreateDto dto)
        {
            if (!await _todoRepository.HasAccessAsync(todoId, userId))
                throw new Exceptions.UnauthorizedAccessException("No access to this todo");

            var subTodo = new SubTodo
            {
                Text = dto.Text,
                IsCompleted = false,
                TodoId = todoId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdSubTodo = await _subTodoRepository.CreateAsync(subTodo);
            return new SubTodoDto
            {
                Id = createdSubTodo.Id,
                Text = createdSubTodo.Text,
                IsCompleted = createdSubTodo.IsCompleted,
                CreatedAt = createdSubTodo.CreatedAt
            };
        }

        public async Task<SubTodoDto> UpdateSubTaskAsync(int todoId, int subTodoId, int userId, SubTodoUpdateDto dto)
        {
            if (!await _todoRepository.HasAccessAsync(todoId, userId))
                throw new Exceptions.UnauthorizedAccessException("No access to this todo");

            var subTodo = await _subTodoRepository.GetByIdAsync(subTodoId);
            if (subTodo == null || subTodo.TodoId != todoId)
                throw new NotFoundException("Subtask not found");

            subTodo.Text = dto.Text;
            subTodo.IsCompleted = dto.IsCompleted;
            subTodo.UpdatedAt = DateTime.UtcNow;

            var updatedSubTodo = await _subTodoRepository.UpdateAsync(subTodo);
            return new SubTodoDto
            {
                Id = updatedSubTodo.Id,
                Text = updatedSubTodo.Text,
                IsCompleted = updatedSubTodo.IsCompleted,
                CreatedAt = updatedSubTodo.CreatedAt
            };
        }

        public async Task DeleteSubTaskAsync(int todoId, int subTodoId, int userId)
        {
            if (!await _todoRepository.HasAccessAsync(todoId, userId))
                throw new Exceptions.UnauthorizedAccessException("No access to this todo");

            var subTodo = await _subTodoRepository.GetByIdAsync(subTodoId);
            if (subTodo == null || subTodo.TodoId != todoId)
                throw new NotFoundException("Subtask not found");

            await _subTodoRepository.DeleteAsync(subTodoId);
        }
    }
}
