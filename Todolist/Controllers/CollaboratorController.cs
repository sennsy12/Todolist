using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Todolist.Exceptions;
using TodoList.Services;
using TodoList.DTOs;

namespace Todolist.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/collaborators")]
    public class CollaboratorController : ControllerBase
    {
        private readonly ICollaboratorService _collaboratorService;
        private readonly ILogger<CollaboratorController> _logger;

        public CollaboratorController(
            ICollaboratorService collaboratorService,
            ILogger<CollaboratorController> logger)
        {
            _collaboratorService = collaboratorService;
            _logger = logger;
        }

        [HttpPost("{todoId}/add")]  // Endret rute-struktur
        public async Task<IActionResult> AddCollaborator(int todoId, [FromBody] CollaboratorDto collaboratorDto)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var result = await _collaboratorService.AddCollaboratorAsync(todoId, currentUserId, collaboratorDto.Username);

                if (result)
                    return Ok();

                return BadRequest("Bruker er allerede lagt til som samarbeidspartner");
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (NotFoundException)
            {
                return NotFound("Bruker ikke funnet");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved tillegging av samarbeidspartner");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpDelete("remove/{username}")]
        public async Task<IActionResult> RemoveCollaborator(int todoId, string username)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var result = await _collaboratorService.RemoveCollaboratorAsync(todoId, currentUserId, username);

                if (result)
                    return Ok();

                return NotFound("Bruker er ikke en samarbeidspartner");
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (NotFoundException)
            {
                return NotFound("Bruker ikke funnet");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved fjerning av samarbeidspartner");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<string>>> GetCollaborators(int todoId)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var collaborators = await _collaboratorService.GetCollaboratorsAsync(todoId, currentUserId);
                return Ok(collaborators);
            }
            catch (Todolist.Exceptions.UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved henting av samarbeidspartnere");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpGet("shared")]
        public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetSharedTodos()
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var sharedTodos = await _collaboratorService.GetSharedTodosAsync(currentUserId);
                return Ok(sharedTodos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved henting av delte todos");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

        [HttpGet("check-access")]
        public async Task<ActionResult<bool>> HasAccess(int todoId)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var hasAccess = await _collaboratorService.HasAccessAsync(todoId, currentUserId);
                return Ok(hasAccess);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Feil ved sjekking av tilgang");
                return StatusCode(500, "En intern feil oppstod");
            }
        }

    }
}
