using TodoList.Models;

namespace Todolist.Models
{
    public class ListTodo
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime? DueDateTime { get; set; }
        public string Priority { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int OwnerId { get; set; }
        public User Owner { get; set; }
        public ICollection<TodoListCollaborator> Collaborators { get; set; }
        public ICollection<Todo> Todos { get; set; }
    }
}