using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TodoList.DTOs;
using TodoList.Models;
using TodoList.Repositories;

namespace TodoList.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(UserRegisterDto userDto)
        {
            if (await _userRepository.CheckUserExistsAsync(userDto.Username))
                throw new Exception("Brukernavn er allerede tatt.");

            var user = new User
            {
                Username = userDto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password)
            };

            await _userRepository.CreateUserAsync(user);

            return GenerateJwtToken(user);
        }

        public async Task<AuthResponseDto> LoginAsync(UserLoginDto userDto)
        {
            var user = await _userRepository.GetByUsernameAsync(userDto.Username);

            if (user == null)
            {
                throw new Exception("Ugyldig brukernavn eller passord.");
            }

            if (!BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
            {
                throw new Exception("Ugyldig brukernavn eller passord.");
            }

            return GenerateJwtToken(user);
        }

        private AuthResponseDto GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:SecretKey"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new AuthResponseDto
            {
                Token = tokenHandler.WriteToken(token),
                Username = user.Username,
                Role = user.Role
            };
        }
    }
}

