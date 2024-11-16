using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Todolist.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreatea1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todos_TodoLists_ListTodoId",
                table: "Todos");

            migrationBuilder.DropIndex(
                name: "IX_Todos_ListTodoId",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "ListTodoId",
                table: "Todos");

            migrationBuilder.AddColumn<int>(
                name: "TodoListId",
                table: "Todos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Todos_TodoListId",
                table: "Todos",
                column: "TodoListId");

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_TodoLists_TodoListId",
                table: "Todos",
                column: "TodoListId",
                principalTable: "TodoLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todos_TodoLists_TodoListId",
                table: "Todos");

            migrationBuilder.DropIndex(
                name: "IX_Todos_TodoListId",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "TodoListId",
                table: "Todos");

            migrationBuilder.AddColumn<int>(
                name: "ListTodoId",
                table: "Todos",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Todos_ListTodoId",
                table: "Todos",
                column: "ListTodoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_TodoLists_ListTodoId",
                table: "Todos",
                column: "ListTodoId",
                principalTable: "TodoLists",
                principalColumn: "Id");
        }
    }
}
