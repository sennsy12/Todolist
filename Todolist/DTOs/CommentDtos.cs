namespace TodoList.DTOs
{
    public class CommentCreateDto
    {
        public string Text { get; set; }
    }

    public class CommentResponseDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string Username { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
