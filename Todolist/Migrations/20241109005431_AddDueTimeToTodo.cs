using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Todolist.Migrations
{
    /// <inheritdoc />
    public partial class AddDueTimeToTodo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "DueTime",
                table: "Todos",
                type: "interval",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DueTime",
                table: "Todos");
        }
    }
}
