using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoList.DTOs;
using TodoList.Models;
using TodoList.Services;


namespace TodoList.Controllers
{
    [Authorize]
    [Route("api/todos")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;
        private readonly ILogger<TodoController> _logger; 

        public TodoController(ITodoService todoService, ILogger<TodoController> logger) 
        {
            _todoService = todoService;
            _logger = logger;
        }

        [HttpGet("user-todos")]
        public async Task<ActionResult<IEnumerable<Todo>>> GetAllTodosForUser()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].ToString();

                var userId = GetUserIdFromToken();

                var todos = await _todoService.GetAllTodosForUserAsync(userId);

                return Ok(todos);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { error = ex.Message });
            }
        }


        // Henter en spesifikk todo for den innloggede brukeren
        [HttpGet("user-todos/{id}")]  
        public async Task<ActionResult<Todo>> GetTodoById(int id)
        {
            var userId = GetUserIdFromToken();
            var todo = await _todoService.GetTodoByIdForUserAsync(id, userId);

            if (todo == null)
                return NotFound();

            return Ok(todo);
        }

        // Oppretter en ny todo for den innloggede brukeren
        [HttpPost("create")]  
        public async Task<IActionResult> CreateTodo([FromBody] TodoCreateDto todoDto)
        {
            var userId = GetUserIdFromToken();
            try
            {
                var newTodo = await _todoService.CreateTodoForUserAsync(todoDto, userId);
                return Ok(newTodo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Oppdaterer en eksisterende todo for den innloggede brukeren
        [HttpPut("update/{id}")]  
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] TodoUpdateDto todoDto)
        {
            var userId = GetUserIdFromToken();
            var updatedTodo = await _todoService.UpdateTodoForUserAsync(id, todoDto, userId);

            if (updatedTodo == null)
                return NotFound();

            return Ok(updatedTodo);
        }

        // Sletter en todo for den innloggede brukeren
        [HttpDelete("delete/{id}")]  
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var userId = GetUserIdFromToken();
            await _todoService.DeleteTodoForUserAsync(id, userId);
            return NoContent();
        }

        // Hjelpemetode for å hente bruker-ID fra JWT-tokenet
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                throw new UnauthorizedAccessException("Bruker-ID ikke funnet i token");
            }
            return int.Parse(userIdClaim.Value);
        }
    }
}