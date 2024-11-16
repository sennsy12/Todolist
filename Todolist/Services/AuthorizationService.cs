using Microsoft.AspNetCore.Authorization;
using TodoList.DTOs;
using Todolist.Models;
using TodoList.Services;
using Todolist.DTOs;
using Todolist.Repositories;

namespace Todolist.Services
{
    public class AuthorizationService : TodoList.Services.IAuthorizationService

    {
        private readonly ITodoListRepository _todoListRepository;
        private readonly IUserService _userService;

        public AuthorizationService(ITodoListRepository todoListRepository, IUserService userService)
        {
            _todoListRepository = todoListRepository;
            _userService = userService;
        }

        public async Task<bool> CanAccessTodoList(int todoListId)
        {
            var userId = _userService.GetCurrentUserId();
            var listTodo = await _todoListRepository.GetTodoListById(todoListId);

            if (listTodo == null) return false;
            if (listTodo.OwnerId == userId) return true;

            var collaborator = listTodo.Collaborators
                .FirstOrDefault(c => c.UserId == userId);

            return collaborator != null;
        }

        public async Task<bool> CanEditTodoList(int todoListId)
        {
            var userId = _userService.GetCurrentUserId();
            var listTodo = await _todoListRepository.GetTodoListById(todoListId);

            if (listTodo == null) return false;
            if (listTodo.OwnerId == userId) return true;

            var collaborator = listTodo.Collaborators
                .FirstOrDefault(c => c.UserId == userId);

            return collaborator?.Role == CollaboratorRole.Editor ||
                   collaborator?.Role == CollaboratorRole.Admin;
        }

        public async Task<bool> IsListOwner(int todoListId, int userId)
        {
            var listTodo = await _todoListRepository.GetTodoListById(todoListId);
            return listTodo?.OwnerId == userId;
        }

        public async Task<bool> CanManageCollaborators(int todoListId)
        {
            var userId = _userService.GetCurrentUserId();
            var listTodo = await _todoListRepository.GetTodoListById(todoListId);

            if (listTodo == null) return false;
            if (listTodo.OwnerId == userId) return true;

            var collaborator = listTodo.Collaborators
                .FirstOrDefault(c => c.UserId == userId);

            return collaborator?.Role == CollaboratorRole.Admin;
        }

        public async Task<CollaboratorDto> GetCollaboratorRole(int todoListId, int userId)
        {
            var listTodo = await _todoListRepository.GetTodoListById(todoListId);
            var collaborator = listTodo?.Collaborators
                .FirstOrDefault(c => c.UserId == userId);

            return collaborator != null ? new CollaboratorDto
            {
                Username = collaborator.User.Username,
                Role = collaborator.Role.ToString()
            } : null;
        }

    }
}
