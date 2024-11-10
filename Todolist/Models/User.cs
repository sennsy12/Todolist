namespace TodoList.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "user";
        public ICollection<Todo> Todos { get; set; }
    }
}