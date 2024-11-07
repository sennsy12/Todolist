using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using TodoList.Models;

namespace TodoList.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
    {
    }

    public DbSet<Todo> Todos { get; set; }
}