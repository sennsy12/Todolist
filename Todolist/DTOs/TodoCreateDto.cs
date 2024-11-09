namespace TodoList.DTOs;

public class TodoCreateDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public DateTime? DueDate { get; set; }
    public string Priority { get; set; }  
}