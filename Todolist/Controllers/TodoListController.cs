using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Todolist.Models;
using Todolist.Services;
using Todolist.DTOs;
using Todolist.Repositories;
using TodoList.Services;
using TodoList.Repositories;

namespace Todolist.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TodoListController : ControllerBase
    {
        private readonly ITodoListRepository _todoListRepository;
        private readonly TodoList.Services.IAuthorizationService _authorizationService;
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;
        public TodoListController(
    ITodoListRepository todoListRepository,
   TodoList.Services.IAuthorizationService authorizationService,
    IUserService userService,
    IUserRepository userRepository)
        {
            _todoListRepository = todoListRepository;
            _authorizationService = authorizationService;
            _userService = userService;
            _userRepository = userRepository;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ListTodo>> GetTodoList(int id)
        {
            if (!await _authorizationService.CanAccessTodoList(id))
                return Forbid();

            var todoList = await _todoListRepository.GetTodoListById(id);
            if (todoList == null)
                return NotFound();

            return Ok(todoList);
        }

        [HttpPost]
        public async Task<ActionResult<ListTodo>> CreateTodoList(CreateTodoListDto dto)
        {
            var userId = _userService.GetCurrentUserId();
            var todoList = new ListTodo
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                DueDateTime = dto.DueDateTime?.ToUniversalTime(),
                Priority = dto.Priority,
                IsCompleted = dto.IsCompleted,
                OwnerId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _todoListRepository.CreateTodoList(todoList);
            return CreatedAtAction(nameof(GetTodoList), new { id = todoList.Id }, todoList);
        }



        [HttpPost("{id}/collaborators")]
        public async Task<IActionResult> AddCollaborator(int id, [FromBody] CollaboratorDto dto)
        {
            if (!await _authorizationService.CanManageCollaborators(id))
                return Forbid();

            var user = await _userRepository.GetByUsernameAsync(dto.Username);
            if (user == null)
                return BadRequest("User not found");

            var role = Enum.Parse<CollaboratorRole>(dto.Role);
            var success = await _todoListRepository.AddCollaborator(id, user.Id, role);

            if (!success)
                return BadRequest("Failed to add collaborator");

            return Ok();
        }




        [HttpDelete("{id}/collaborators/{userId}")]
        public async Task<IActionResult> RemoveCollaborator(int id, int userId)
        {
            if (!await _authorizationService.CanManageCollaborators(id))
                return Forbid();

            var success = await _todoListRepository.RemoveCollaborator(id, userId);

            if (!success)
                return BadRequest("Failed to remove collaborator");

            return Ok();
        }



        [HttpPut("{id}/collaborators/{userId}")]
        public async Task<IActionResult> UpdateCollaboratorRole(int id, int userId, [FromBody] CollaboratorDto dto)
        {
            if (!await _authorizationService.CanManageCollaborators(id))
                return Forbid();

            var role = Enum.Parse<CollaboratorRole>(dto.Role);
            var success = await _todoListRepository.UpdateCollaboratorRole(id, userId, role);

            if (!success)
                return BadRequest("Failed to update collaborator role");

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ListTodo>> UpdateTodoList(int id, CreateTodoListDto dto)
        {
            var userId = _userService.GetCurrentUserId();
            var todoList = await _todoListRepository.GetTodoListById(id);

            if (todoList == null)
                return NotFound();

            if (todoList.OwnerId != userId)
                return Forbid();

            todoList.Title = dto.Title;
            todoList.Description = dto.Description;
            todoList.Category = dto.Category;
            todoList.DueDateTime = dto.DueDateTime?.ToUniversalTime();
            todoList.Priority = dto.Priority;
            todoList.UpdatedAt = DateTime.UtcNow;

            await _todoListRepository.UpdateTodoList(todoList);
            return Ok(todoList);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoList(int id)
        {
            var userId = _userService.GetCurrentUserId();
            var todoList = await _todoListRepository.GetTodoListById(id);

            if (todoList == null)
                return NotFound();

            if (todoList.OwnerId != userId)
                return Forbid();

            await _todoListRepository.DeleteTodoList(id);
            return Ok();
        }


        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<ListTodo>>> GetUserTodoLists()
        {
            var userId = _userService.GetCurrentUserId();
            var lists = await _todoListRepository.GetUserTodoLists(userId);
            return Ok(lists);
        }
    }
}
