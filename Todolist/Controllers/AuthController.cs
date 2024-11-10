using Microsoft.AspNetCore.Mvc;
using TodoList.DTOs;
using TodoList.Services;

namespace TodoList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            try
            {
                var response = await _userService.RegisterAsync(registerDto);
                return Ok(response);
            }
            catch (Exception ex)
            {

                return BadRequest($"Registration failed: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Username) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest("Username and password cannot be null or empty");
            }

            try
            {
                var response = await _userService.LoginAsync(loginDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login Error: {ex.Message}");
                return Unauthorized(new { message = "Invalid username or password" });
            }
        }
    }
}
