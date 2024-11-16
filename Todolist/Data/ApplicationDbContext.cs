using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Todolist.Models;
using TodoList.Models;

namespace TodoList.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Todo> Todos { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<ListTodo> TodoLists { get; set; }
    public DbSet<TodoListCollaborator> TodoListCollaborators { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TodoListCollaborator>()
            .HasOne(tlc => tlc.TodoList)
            .WithMany(tl => tl.Collaborators)
            .HasForeignKey(tlc => tlc.TodoListId);

        modelBuilder.Entity<TodoListCollaborator>()
            .HasOne(tlc => tlc.User)
            .WithMany()
            .HasForeignKey(tlc => tlc.UserId);

        modelBuilder.Entity<ListTodo>()
            .HasOne(tl => tl.Owner)
            .WithMany()
            .HasForeignKey(tl => tl.OwnerId);

    }
}
