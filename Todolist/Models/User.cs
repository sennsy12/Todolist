using System.ComponentModel.DataAnnotations;

namespace TodoList.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "user";
        public ICollection<Todo> Todos { get; set; }
        [Required]
        public required string Email { get; set; }
  
        public string ResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }

    }
}