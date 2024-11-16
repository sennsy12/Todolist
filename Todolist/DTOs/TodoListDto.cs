namespace Todolist.DTOs
{
    public class TodoListDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserDto Owner { get; set; }
        public List<CollaboratorDto> Collaborators { get; set; }
    }
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }
    public class CreateTodoListDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime? DueDateTime { get; set; }
        public string Priority { get; set; }
        public bool IsCompleted { get; set; }
    }



    public class CollaboratorDto
    {
        public string Username { get; set; }
        public string Role { get; set; }
    }

}
