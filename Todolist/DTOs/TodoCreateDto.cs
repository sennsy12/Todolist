using Todolist.DTOs;

namespace TodoList.DTOs;

public class TodoCreateDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public DateTime? DueDateTime { get; set; }  
    public string Priority { get; set; }
}

public class TodoUpdateDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsCompleted { get; set; }
    public string Category { get; set; }
    public DateTime? DueDateTime { get; set; }
    public string Priority { get; set; }
}

public class TodoResponseDto
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
    public string OwnerUsername { get; set; }
    public List<string> CollaboratorUsernames { get; set; }
    public List<SubTodoDto> SubTodos { get; set; }
    public List<CommentResponseDto> Comments { get; set; }
}