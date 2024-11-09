namespace TodoList.DTOs;

public class TodoUpdateDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsCompleted { get; set; }
    public string Category { get; set; }
    public DateTime? DueDateTime { get; set; }  
    public string Priority { get; set; }
}