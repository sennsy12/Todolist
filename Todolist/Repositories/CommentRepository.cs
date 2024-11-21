using Microsoft.EntityFrameworkCore;
using Todolist.Models;
using TodoList.Data;
using TodoList.Repositories;

namespace Todolist.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDbContext _context;

        public CommentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TodoComment>> GetAllForTodoAsync(int todoId)
        {
            return await _context.TodoComments
                .Include(c => c.User)
                .Where(c => c.TodoId == todoId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<TodoComment> GetByIdAsync(int id)
        {
            return await _context.TodoComments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<TodoComment> CreateAsync(TodoComment comment)
        {
            _context.TodoComments.Add(comment);
            await _context.SaveChangesAsync();
            return await GetByIdAsync(comment.Id);
        }

        public async Task DeleteAsync(int id)
        {
            var comment = await _context.TodoComments.FindAsync(id);
            if (comment != null)
            {
                _context.TodoComments.Remove(comment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> BelongsToUserAsync(int commentId, int userId)
        {
            return await _context.TodoComments
                .AnyAsync(c => c.Id == commentId && c.UserId == userId);
        }
    }
   
}
