using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoList.DTOs;
using Todolist.Exceptions;
using TodoList.Services;

namespace TodoList.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/todos/{todoId}/comments")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly ILogger<CommentController> _logger;

        public CommentController(ICommentService commentService, ILogger<CommentController> logger)
        {
            _commentService = commentService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentResponseDto>>> GetComments(int todoId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var comments = await _commentService.GetTodoCommentsAsync(todoId, userId);
                return Ok(comments);
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved henting av kommentarer");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpPost]
        public async Task<ActionResult<CommentResponseDto>> CreateComment(int todoId, [FromBody] CommentCreateDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var comment = await _commentService.AddCommentAsync(todoId, userId, dto);
                return CreatedAtAction(nameof(GetComments), new { todoId }, comment);
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved opprettelse av kommentar");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int todoId, int commentId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                await _commentService.DeleteCommentAsync(todoId, commentId, userId);
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
                _logger.LogError(ex, "Feil ved sletting av kommentar");
                return StatusCode(500, "En intern feil oppstod");
            }
        }
    }
}
