
using TodoList.DTOs;

namespace TodoList.Services
{
    public interface IEmailService
    {
        Task<bool> SendResetPasswordEmailAsync(ForgotPasswordDto forgotPasswordDto);
        Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    }
}