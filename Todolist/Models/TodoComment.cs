using TodoList.Models;

namespace Todolist.Models
{
    public class TodoComment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int TodoId { get; set; }
        public Todo Todo { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
