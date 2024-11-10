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
            return await _context.Todos.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<Todo?> GetByIdForUserAsync(int id, int userId)
        {
            return await _context.Todos.SingleOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task<Todo> CreateAsync(Todo todo)
        {
            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();
            return todo;
        }

        public async Task<Todo> UpdateAsync(Todo todo)
        {
            _context.Entry(todo).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return todo;
        }

        public async Task DeleteForUserAsync(int id, int userId)
        {
            var todo = await GetByIdForUserAsync(id, userId);

            if (todo != null)
            {
                _context.Todos.Remove(todo);
                await _context.SaveChangesAsync();
            }
        }
    }
}