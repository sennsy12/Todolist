using Microsoft.EntityFrameworkCore;
using TodoList.Data;
using TodoList.Models;

namespace TodoList.Repositories
{
    public class TodoRepository : ITodoRepository
    {
        private readonly ApplicationDbContext _context;

        public TodoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Todo>> GetAllForUserAsync(int userId)
        {
            return await _context.Todos
                .Include(t => t.User)
                .Include(t => t.Collaborators)
                    .ThenInclude(c => c.User)
                .Include(t => t.SubTodos)
                .Include(t => t.Comments)
                    .ThenInclude(c => c.User)
                .Where(t => t.UserId == userId || t.Collaborators.Any(c => c.UserId == userId))
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<Todo?> GetByIdForUserAsync(int id, int userId)
        {
            return await _context.Todos
                .Include(t => t.User)
                .Include(t => t.Collaborators)
                    .ThenInclude(c => c.User)
                .Include(t => t.SubTodos)
                .Include(t => t.Comments)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(t => t.Id == id &&
                    (t.UserId == userId || t.Collaborators.Any(c => c.UserId == userId)));
        }

        public async Task<Todo> CreateAsync(Todo todo)
        {
            todo.CreatedAt = DateTime.UtcNow;
            todo.UpdatedAt = DateTime.UtcNow;
            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();
            return todo;
        }

        public async Task<Todo> UpdateAsync(Todo todo)
        {
            todo.UpdatedAt = DateTime.UtcNow;
            _context.Entry(todo).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return todo;
        }

        public async Task DeleteForUserAsync(int id, int userId)
        {
            var todo = await _context.Todos
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todo != null)
            {
                _context.Todos.Remove(todo);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> HasAccessAsync(int todoId, int userId)
        {
            return await _context.Todos
                .AnyAsync(t => t.Id == todoId &&
                    (t.UserId == userId || t.Collaborators.Any(c => c.UserId == userId)));
        }
    }
}