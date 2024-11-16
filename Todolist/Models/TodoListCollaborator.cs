using TodoList.Models;

namespace Todolist.Models
{
    public class TodoListCollaborator
    {
        public int Id { get; set; }
        public int TodoListId { get; set; }
        public ListTodo TodoList { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public CollaboratorRole Role { get; set; }
        public DateTime AddedAt { get; set; }
    }
}
