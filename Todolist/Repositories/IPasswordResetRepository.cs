using TodoList.Models;

namespace TodoList.Repositories
{
    public interface IPasswordResetRepository
    {
        Task<User> GetUserByEmailAsync(string email);
        Task<bool> UpdateUserResetTokenAsync(User user, string resetToken);
        Task<bool> ValidateResetTokenAsync(string email, string token);
        Task<bool> UpdatePasswordAsync(string email, string passwordHash);
    }
}