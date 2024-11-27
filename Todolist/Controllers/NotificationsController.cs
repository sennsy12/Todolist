using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoList.Services;
using TodoList.DTOs;

namespace Todolist.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/notifications")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null) return Unauthorized(); // Handle null case

            var userId = int.Parse(userClaim.Value);

            var notifications = await _notificationService.GetNotificationsForUserAsync(userId);

            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null) return Unauthorized(); // Handle null case

            var userId = int.Parse(userClaim.Value);

            await _notificationService.MarkAsReadAsync(id, userId);

            return Ok();
        }
    }
} 