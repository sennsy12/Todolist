using TodoList.DTOs;
using TodoList.Models;

namespace TodoList.Services
{
    public interface IUserService
    {
        Task<AuthResponseDto> RegisterAsync(UserRegisterDto userDto);
        Task<AuthResponseDto> LoginAsync(UserLoginDto userDto);
    }
}