using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Todolist.Exceptions;
using TodoList.DTOs;
using TodoList.Models;
using TodoList.Services;


namespace TodoList.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/todos")]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;
        private readonly ILogger<TodoController> _logger;

        public TodoController(ITodoService todoService, ILogger<TodoController> logger)
        {
            _todoService = todoService;
            _logger = logger;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetAllTodos()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var todos = await _todoService.GetAllTodosForUserAsync(userId);
                return Ok(todos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved henting av todos");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpGet("shared")]
        public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetSharedTodos()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var todos = await _todoService.GetSharedTodosAsync(userId);
                return Ok(todos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved henting av delte todos");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoResponseDto>> GetTodoById(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var todo = await _todoService.GetTodoByIdForUserAsync(id, userId);
                return Ok(todo);
            }
            catch (NotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved henting av todo");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpPost("create")]
        public async Task<ActionResult<TodoResponseDto>> CreateTodo([FromBody] TodoCreateDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var todo = await _todoService.CreateTodoForUserAsync(dto, userId);
                return CreatedAtAction(nameof(GetTodoById), new { id = todo.Id }, todo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved opprettelse av todo");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult<TodoResponseDto>> UpdateTodo(int id, [FromBody] TodoUpdateDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var todo = await _todoService.UpdateTodoForUserAsync(id, dto, userId);

                if (todo == null)
                    return NotFound("Todo not found or you don't have permission to update it");

                return Ok(todo);
            }
            catch (NotFoundException)
            {
                return NotFound("Todo not found");
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid("You don't have permission to update this todo");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating todo");
                return StatusCode(500, "An internal error occurred while updating the todo");
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                await _todoService.DeleteTodoForUserAsync(id, userId);
                return NoContent();
            }
            catch (NotFoundException)
            {
                return NotFound();
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved sletting av todo");
                return StatusCode(500, "En intern feil oppstod");
            }
        }
    }
}