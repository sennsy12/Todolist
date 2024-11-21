
namespace Todolist.DTOs
{
    public class SubTodoDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SubTodoCreateDto
    {
        public string Text { get; set; }
    }

    public class SubTodoUpdateDto
    {
        public string Text { get; set; }
        public bool IsCompleted { get; set; }
    }

}
