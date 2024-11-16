using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Todolist.Migrations
{
    /// <inheritdoc />
    public partial class AddCollaborationFeatures9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ListTodoId",
                table: "Todos",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TodoLists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    OwnerId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TodoLists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TodoLists_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TodoListCollaborators",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TodoListId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    AddedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TodoListCollaborators", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TodoListCollaborators_TodoLists_TodoListId",
                        column: x => x.TodoListId,
                        principalTable: "TodoLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TodoListCollaborators_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Todos_ListTodoId",
                table: "Todos",
                column: "ListTodoId");

            migrationBuilder.CreateIndex(
                name: "IX_TodoListCollaborators_TodoListId",
                table: "TodoListCollaborators",
                column: "TodoListId");

            migrationBuilder.CreateIndex(
                name: "IX_TodoListCollaborators_UserId",
                table: "TodoListCollaborators",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TodoLists_OwnerId",
                table: "TodoLists",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_TodoLists_ListTodoId",
                table: "Todos",
                column: "ListTodoId",
                principalTable: "TodoLists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todos_TodoLists_ListTodoId",
                table: "Todos");

            migrationBuilder.DropTable(
                name: "TodoListCollaborators");

            migrationBuilder.DropTable(
                name: "TodoLists");

            migrationBuilder.DropIndex(
                name: "IX_Todos_ListTodoId",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "ListTodoId",
                table: "Todos");
        }
    }
}
