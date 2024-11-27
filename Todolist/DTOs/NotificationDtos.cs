public class NotificationDto
{
    public int Id { get; set; }
    public string Message { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Type { get; set; }
    public int? RelatedTodoId { get; set; }
}

public class NotificationCreateDto
{
    public int UserId { get; set; }
    public string Message { get; set; }
    public string Type { get; set; }
    public int? RelatedTodoId { get; set; }
} 