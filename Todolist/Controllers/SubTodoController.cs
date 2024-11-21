using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Todolist.DTOs;
using Todolist.Exceptions;
using TodoList.Services;

namespace TodoList.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/todos/{todoId}/subtodos")]
    public class SubTodoController : ControllerBase
    {
        private readonly ISubTodoService _subTodoService;
        private readonly ILogger<SubTodoController> _logger;

        public SubTodoController(ISubTodoService subTodoService, ILogger<SubTodoController> logger)
        {
            _subTodoService = subTodoService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubTodoDto>>> GetSubTodos(int todoId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var subTasks = await _subTodoService.GetTodoSubTasksAsync(todoId, userId);
                return Ok(subTasks);
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved henting av deloppgaver");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpPost]
        public async Task<ActionResult<SubTodoDto>> CreateSubTodo(int todoId, [FromBody] SubTodoCreateDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var subTask = await _subTodoService.CreateSubTaskAsync(todoId, userId, dto);
                return CreatedAtAction(nameof(GetSubTodos), new { todoId }, subTask);
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved opprettelse av deloppgave");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpPut("{subTodoId}")]
        public async Task<ActionResult<SubTodoDto>> UpdateSubTodo(int todoId, int subTodoId, [FromBody] SubTodoUpdateDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var updatedSubTask = await _subTodoService.UpdateSubTaskAsync(todoId, subTodoId, userId, dto);
                return Ok(updatedSubTask);
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (NotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved oppdatering av deloppgave");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpDelete("{subTodoId}")]
        public async Task<IActionResult> DeleteSubTodo(int todoId, int subTodoId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                await _subTodoService.DeleteSubTaskAsync(todoId, subTodoId, userId);
                return NoContent();
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (NotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved sletting av deloppgave");
                return StatusCode(500, "En intern feil oppstod");
            }
        }
    }
}
