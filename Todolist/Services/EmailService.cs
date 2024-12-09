using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Mailjet.Client;
using Mailjet.Client.Resources;
using TodoList.DTOs;
using TodoList.Repositories;
using Newtonsoft.Json.Linq;


namespace TodoList.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly MailjetClient _client;
        private readonly IPasswordResetRepository _repository;

        public EmailService(IConfiguration configuration, IPasswordResetRepository repository)
        {
            _configuration = configuration;
            _repository = repository;

            var apiKey = _configuration["MailjetSettings:ApiKey"];
            var apiSecret = _configuration["MailjetSettings:ApiSecret"];

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            {
                throw new ArgumentException("Mailjet-innstillinger mangler i konfigurasjon");
            }

            _client = new MailjetClient(apiKey, apiSecret);
        }

        public async Task<bool> SendResetPasswordEmailAsync(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _repository.GetUserByEmailAsync(forgotPasswordDto.Email);
            if (user == null) return false;

            var token = Guid.NewGuid().ToString("N");
            await _repository.UpdateUserResetTokenAsync(user, token);

            var baseUrl = _configuration["AppUrl"];
            var resetLink = $"{baseUrl}/reset-password?token={token}&email={forgotPasswordDto.Email}";

            var request = new MailjetRequest
            {
                Resource = Send.Resource
            }
            .Property(Send.FromEmail, _configuration["MailjetSettings:SenderEmail"])
            .Property(Send.FromName, "TodoList App")
            .Property(Send.Subject, "Tilbakestill passord")
            .Property(Send.HtmlPart, GenerateResetEmailHtml(token, forgotPasswordDto.Email))
            .Property(Send.Recipients, new JArray {
        new JObject {
            {"Email", forgotPasswordDto.Email}
        }
            });

            var response = await _client.PostAsync(request);
            return response.IsSuccessStatusCode;
        }

        private string GenerateResetEmailHtml(string token, string email)
        {
            var resetLink = $"{_configuration["AppUrl"]}/reset-password?token={token}&email={email}";
            return $@"
        <h2>Tilbakestill ditt passord</h2>
        <p>Klikk på lenken under for å tilbakestille passordet ditt:</p>
        <p><a href='{resetLink}'>Tilbakestill passord</a></p>
        <p>Lenken er gyldig i 1 time.</p>";
        }



        public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            if (!await _repository.ValidateResetTokenAsync(resetPasswordDto.Email, resetPasswordDto.Token))
                return false;

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            return await _repository.UpdatePasswordAsync(resetPasswordDto.Email, passwordHash);
        }
    }
}
