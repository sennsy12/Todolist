using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Todolist.Migrations
{
    /// <inheritdoc />
    public partial class EnhancedTodoListModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "TodoLists",
                newName: "Title");

            migrationBuilder.AddColumn<int>(
                name: "ListTodoId",
                table: "Todos",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "TodoLists",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DueDateTime",
                table: "TodoLists",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "TodoLists",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "TodoLists",
                type: "text",
                nullable: false,
                defaultValue: "");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "Category",
                table: "TodoLists");

            migrationBuilder.DropColumn(
                name: "DueDateTime",
                table: "TodoLists");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "TodoLists");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "TodoLists");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "TodoLists",
                newName: "Name");

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
    }
}
