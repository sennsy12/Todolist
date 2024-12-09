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
            _client = new MailjetClient(
                _configuration["Mailjet:ApiKey"],
                _configuration["Mailjet:ApiSecret"]);
        }

        public async Task<bool> SendResetPasswordEmailAsync(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _repository.GetUserByEmailAsync(forgotPasswordDto.Email);
            if (user == null) return false;

            var token = Guid.NewGuid().ToString("N");
            await _repository.UpdateUserResetTokenAsync(user, token);

            var resetLink = $"{_configuration["AppUrl"]}/reset-password?token={token}&email={forgotPasswordDto.Email}";

            var request = new MailjetRequest
            {
                Resource = Send.Resource
            }
            .Property(Send.FromEmail, _configuration["Mailjet:SenderEmail"])
            .Property(Send.FromName, "TodoList App")
            .Property(Send.Subject, "Reset Your Password")
            .Property(Send.HtmlPart, $"Click <a href='{resetLink}'>here</a> to reset your password")
            .Property(Send.Recipients, new JArray {
        new JObject {
            {"Email", forgotPasswordDto.Email}
        }
            });

            var response = await _client.PostAsync(request);
            return response.IsSuccessStatusCode;
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
