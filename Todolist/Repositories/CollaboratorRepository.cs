// CollaboratorRepository.cs
using Microsoft.EntityFrameworkCore;
using TodoList.Data;
using Todolist.Models;

namespace TodoList.Repositories
{
    public class CollaboratorRepository : ICollaboratorRepository
    {
        private readonly ApplicationDbContext _context;

        public CollaboratorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddCollaboratorAsync(int todoId, int userId)
        {
            if (await _context.TodoCollaborators
                .AnyAsync(tc => tc.TodoId == todoId && tc.UserId == userId))
                return false;

            var collaborator = new TodoCollaborator
            {
                TodoId = todoId,
                UserId = userId,
                AddedAt = DateTime.UtcNow
            };

            _context.TodoCollaborators.Add(collaborator);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveCollaboratorAsync(int todoId, int userId)
        {
            var collaborator = await _context.TodoCollaborators
                .FirstOrDefaultAsync(tc => tc.TodoId == todoId && tc.UserId == userId);

            if (collaborator == null)
                return false;

            _context.TodoCollaborators.Remove(collaborator);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<TodoCollaborator>> GetCollaboratorsAsync(int todoId)
        {
            return await _context.TodoCollaborators
                .Include(tc => tc.User)
                .Where(tc => tc.TodoId == todoId)
                .ToListAsync();
        }

        public async Task<List<Todo>> GetSharedTodosAsync(int userId)
        {
            return await _context.TodoCollaborators
                .Where(tc => tc.UserId == userId)
                .Include(tc => tc.Todo)
                    .ThenInclude(t => t.User)
                .Include(tc => tc.Todo)
                    .ThenInclude(t => t.SubTodos)
                .Include(tc => tc.Todo)
                    .ThenInclude(t => t.Comments)
                        .ThenInclude(c => c.User)
                .Select(tc => tc.Todo)
                .ToListAsync();
        }

        public async Task<bool> HasAccessAsync(int todoId, int userId)
        {
            return await _context.TodoCollaborators
                .AnyAsync(tc => tc.TodoId == todoId && tc.UserId == userId);
        }
    }
}