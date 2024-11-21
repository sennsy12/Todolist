using Todolist.Models;
using TodoList.Models;


public class Todo
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsCompleted { get; set; }
    public string Category { get; set; }
    public DateTime? DueDateTime { get; set; }
    public string Priority { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public ICollection<TodoCollaborator> Collaborators { get; set; } = new List<TodoCollaborator>();
    public ICollection<SubTodo> SubTodos { get; set; } = new List<SubTodo>();
    public ICollection<TodoComment> Comments { get; set; } = new List<TodoComment>();
}