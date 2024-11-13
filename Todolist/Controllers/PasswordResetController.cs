using Microsoft.AspNetCore.Mvc;
using TodoList.DTOs;
using TodoList.Services;

namespace TodoList.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordResetController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public PasswordResetController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<PasswordResetResponseDto>> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            var result = await _emailService.SendResetPasswordEmailAsync(forgotPasswordDto);
            return Ok(new PasswordResetResponseDto { Success = result });
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<PasswordResetResponseDto>> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var result = await _emailService.ResetPasswordAsync(resetPasswordDto);
            return Ok(new PasswordResetResponseDto { Success = result });
        }
    }
}
