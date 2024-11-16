using Todolist.DTOs;


namespace TodoList.Services
{
    public interface IAuthorizationService
    {
        Task<bool> CanAccessTodoList(int todoListId);
        Task<bool> CanEditTodoList(int todoListId);
        Task<bool> IsListOwner(int todoListId, int userId);
        Task<bool> CanManageCollaborators(int todoListId);
        Task<CollaboratorDto> GetCollaboratorRole(int todoListId, int userId);
    }
}
