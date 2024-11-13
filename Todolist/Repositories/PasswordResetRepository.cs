
using Microsoft.EntityFrameworkCore;
using TodoList.Data;
using TodoList.Models;


namespace TodoList.Repositories
{
    public class PasswordResetRepository : IPasswordResetRepository
    {
        private readonly ApplicationDbContext _context;

        public PasswordResetRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> UpdateUserResetTokenAsync(User user, string resetToken)
        {
            user.ResetToken = resetToken;
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(1);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ValidateResetTokenAsync(string email, string token)
        {
            return await _context.Users.AnyAsync(u =>
                u.Email == email &&
                u.ResetToken == token &&
                u.ResetTokenExpires > DateTime.UtcNow);
        }

        public async Task<bool> UpdatePasswordAsync(string email, string passwordHash)
        {
            var user = await GetUserByEmailAsync(email);
            if (user == null) return false;

            user.PasswordHash = passwordHash;
            user.ResetToken = "";
            user.ResetTokenExpires = null;

            return await _context.SaveChangesAsync() > 0;
        }
    }
}
