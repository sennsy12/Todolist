using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Todolist.Migrations
{
    /// <inheritdoc />
    public partial class CombineDueDateAndDueTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DueTime",
                table: "Todos");

            migrationBuilder.RenameColumn(
                name: "DueDate",
                table: "Todos",
                newName: "DueDateTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DueDateTime",
                table: "Todos",
                newName: "DueDate");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "DueTime",
                table: "Todos",
                type: "interval",
                nullable: true);
        }
    }
}
