using TodoList.Models;

namespace TodoList.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetByUsernameAsync(string username);
        Task<User> CreateUserAsync(User user);
        Task<bool> CheckUserExistsAsync(string username);
        Task<User> GetByIdAsync(int userId);
    }
}