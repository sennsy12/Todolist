using Microsoft.AspNetCore.Mvc;
using TodoList.DTOs;
using TodoList.Models;
using TodoList.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TodoList.Controllers
{
    [Route("Todo")]
    public class TodoController : Controller
    {
        private readonly ITodoService _todoService;

        public TodoController(ITodoService todoService)
        {
            _todoService = todoService;
        }


        [HttpGet("api")]
        public async Task<ActionResult<IEnumerable<Todo>>> GetAllTodos()
        {
            var todos = await _todoService.GetAllTodosAsync();
            return Ok(todos);
        }

        // Get a specific todo by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Todo>> GetTodo(int id)
        {
            var todo = await _todoService.GetTodoByIdAsync(id);
            if (todo == null)
                return NotFound();

            return Ok(todo);
        }

        [HttpPost("api/todo")]
        public async Task<IActionResult> CreateTodo([FromBody] TodoCreateDto todoDto)
        {
            try
            {
                var newTodo = await _todoService.CreateTodoAsync(todoDto);
                return Ok(newTodo);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Feil ved oppretting av Todo: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] TodoUpdateDto todoDto)
        {
            var updatedTodo = await _todoService.UpdateTodoAsync(id, todoDto);
            if (updatedTodo == null)
                return NotFound();

            return Ok(updatedTodo);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            await _todoService.DeleteTodoAsync(id);
            return NoContent();
        }
    }
}
