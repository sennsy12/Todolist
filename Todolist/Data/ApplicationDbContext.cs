using Microsoft.EntityFrameworkCore;
using Todolist.Models;
using TodoList.Models;

namespace TodoList.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            this.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Todo> Todos { get; set; }
        public DbSet<TodoCollaborator> TodoCollaborators { get; set; }
        public DbSet<SubTodo> SubTodos { get; set; }
        public DbSet<TodoComment> TodoComments { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Todo konfigurasjoner
            modelBuilder.Entity<Todo>()
                .HasOne(t => t.User)
                .WithMany(u => u.Todos)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // TodoCollaborator konfigurasjoner
            modelBuilder.Entity<TodoCollaborator>()
                .HasKey(tc => tc.Id);

            modelBuilder.Entity<TodoCollaborator>()
                .HasOne(tc => tc.Todo)
                .WithMany(t => t.Collaborators)
                .HasForeignKey(tc => tc.TodoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TodoCollaborator>()
                .HasOne(tc => tc.User)
                .WithMany(u => u.SharedTodos)
                .HasForeignKey(tc => tc.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // SubTodo konfigurasjoner
            modelBuilder.Entity<SubTodo>()
                .HasOne(st => st.Todo)
                .WithMany(t => t.SubTodos)
                .HasForeignKey(st => st.TodoId)
                .OnDelete(DeleteBehavior.Cascade);

            // TodoComment konfigurasjoner
            modelBuilder.Entity<TodoComment>()
                .HasOne(c => c.Todo)
                .WithMany(t => t.Comments)
                .HasForeignKey(c => c.TodoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TodoComment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indekser for bedre ytelse
            modelBuilder.Entity<Todo>()
                .HasIndex(t => t.UserId);

            modelBuilder.Entity<TodoCollaborator>()
                .HasIndex(tc => new { tc.TodoId, tc.UserId })
                .IsUnique();

            modelBuilder.Entity<SubTodo>()
                .HasIndex(st => st.TodoId);

            modelBuilder.Entity<TodoComment>()
                .HasIndex(c => c.TodoId);

            // Konfigurer required felter og lengdebegrensninger
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(u => u.Username)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.PasswordHash)
                    .IsRequired();

                entity.HasIndex(u => u.Username)
                    .IsUnique();

                entity.HasIndex(u => u.Email)
                    .IsUnique();
            });

            modelBuilder.Entity<Todo>(entity =>
            {
                entity.Property(t => t.Title)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(t => t.Description)
                    .HasMaxLength(500);

                entity.Property(t => t.Category)
                    .HasMaxLength(50);

                entity.Property(t => t.Priority)
                    .HasMaxLength(20);
            });

            modelBuilder.Entity<SubTodo>(entity =>
            {
                entity.Property(st => st.Text)
                    .IsRequired()
                    .HasMaxLength(500);
            });

            modelBuilder.Entity<TodoComment>(entity =>
            {
                entity.Property(c => c.Text)
                    .IsRequired()
                    .HasMaxLength(1000);
            });
        }
    }
}