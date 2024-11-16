using Microsoft.EntityFrameworkCore;
using Todolist.Models;
using TodoList.Data;

namespace Todolist.Repositories
{
    public class TodoListRepository : ITodoListRepository
    {
        private readonly ApplicationDbContext _context;

        public TodoListRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListTodo> CreateTodoList(ListTodo listTodo)
        {
            _context.TodoLists.Add(listTodo);
            await _context.SaveChangesAsync();
            return listTodo;
        }

        public async Task<ListTodo> GetTodoListById(int id)
        {
            return await _context.TodoLists
                .Include(tl => tl.Owner)
                .Include(tl => tl.Collaborators)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(tl => tl.Id == id);
        }

        public async Task<IEnumerable<ListTodo>> GetUserTodoLists(int userId)
        {
            return await _context.TodoLists
                .Where(tl => tl.OwnerId == userId || tl.Collaborators.Any(c => c.UserId == userId))
                .Include(tl => tl.Owner)
                .Include(tl => tl.Collaborators)
                    .ThenInclude(c => c.User)
                .ToListAsync();
        }

        public async Task<bool> AddCollaborator(int todoListId, int userId, CollaboratorRole role)
        {
            var collaborator = new TodoListCollaborator
            {
                TodoListId = todoListId,
                UserId = userId,
                Role = role,
                AddedAt = DateTime.UtcNow
            };

            _context.TodoListCollaborators.Add(collaborator);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveCollaborator(int todoListId, int userId)
        {
            var collaborator = await _context.TodoListCollaborators
                .FirstOrDefaultAsync(c => c.TodoListId == todoListId && c.UserId == userId);

            if (collaborator != null)
            {
                _context.TodoListCollaborators.Remove(collaborator);
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }

        public async Task<bool> UpdateCollaboratorRole(int todoListId, int userId, CollaboratorRole role)
        {
            var collaborator = await _context.TodoListCollaborators
                .FirstOrDefaultAsync(c => c.TodoListId == todoListId && c.UserId == userId);

            if (collaborator != null)
            {
                collaborator.Role = role;
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }

        public async Task<ListTodo> UpdateTodoList(ListTodo todoList)
        {
            _context.TodoLists.Update(todoList);
            await _context.SaveChangesAsync();
            return todoList;
        }

        public async Task DeleteTodoList(int id)
        {
            var todoList = await _context.TodoLists.FindAsync(id);
            if (todoList != null)
            {
                _context.TodoLists.Remove(todoList);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> HasAccess(int todoListId, int userId)
        {
            return await _context.TodoLists
                .AnyAsync(tl => tl.Id == todoListId &&
                    (tl.OwnerId == userId || tl.Collaborators.Any(c => c.UserId == userId)));
        }
    }
}
