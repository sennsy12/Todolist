using Microsoft.EntityFrameworkCore;
using Todolist.Models;
using TodoList.Data;
using TodoList.Repositories;

namespace Todolist.Repositories
{
    public class SubTodoRepository : ISubTodoRepository
    {
        private readonly ApplicationDbContext _context;

        public SubTodoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SubTodo>> GetAllForTodoAsync(int todoId)
        {
            return await _context.SubTodos
                .Where(st => st.TodoId == todoId)
                .OrderBy(st => st.CreatedAt)
                .ToListAsync();
        }

        public async Task<SubTodo> GetByIdAsync(int id)
        {
            return await _context.SubTodos.FindAsync(id);
        }

        public async Task<SubTodo> CreateAsync(SubTodo subTodo)
        {
            subTodo.CreatedAt = DateTime.UtcNow;
            subTodo.UpdatedAt = DateTime.UtcNow;
            _context.SubTodos.Add(subTodo);
            await _context.SaveChangesAsync();
            return subTodo;
        }

        public async Task<SubTodo> UpdateAsync(SubTodo subTodo)
        {
            subTodo.UpdatedAt = DateTime.UtcNow;
            _context.Entry(subTodo).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return subTodo;
        }

        public async Task DeleteAsync(int id)
        {
            var subTodo = await _context.SubTodos.FindAsync(id);
            if (subTodo != null)
            {
                _context.SubTodos.Remove(subTodo);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> BelongsToUserAsync(int subTodoId, int userId)
        {
            return await _context.SubTodos
                .Include(st => st.Todo)
                .AnyAsync(st => st.Id == subTodoId &&
                    (st.Todo.UserId == userId || st.Todo.Collaborators.Any(c => c.UserId == userId)));
        }
    }
}